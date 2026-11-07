/**
 * 内容校验：在构建前检查字段、引用与内部来源状态是否自洽。
 *
 * 这里不依赖 astro:content，而是直接读取 Markdown 与 data/internal/sources.json，
 * 因此可以在 `npm run validate` 里独立运行，也能在 CI 里先于构建失败。
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import type { z } from 'astro/zod';
import {
  activitySchema,
  personSchema,
  projectSchema,
  sourcesFileSchema,
  workSchema,
} from '../src/lib/schema';

const root = fileURLToPath(new URL('..', import.meta.url));
const contentRoot = join(root, 'src', 'content');

interface LoadedEntry<T> {
  file: string;
  data: T;
  body: string;
}

function splitFrontmatter(raw: string, file: string): { data: unknown; body: string } {
  if (!raw.startsWith('---')) {
    throw new Error(`${file}: 缺少 YAML frontmatter`);
  }
  const end = raw.indexOf('\n---', 3);
  if (end === -1) {
    throw new Error(`${file}: frontmatter 没有结束标记`);
  }
  const yamlText = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).trim();
  try {
    return { data: parseYaml(yamlText), body };
  } catch (error) {
    throw new Error(`${file}: YAML 解析失败：${(error as Error).message}`);
  }
}

async function loadCollection<T>(
  name: string,
  schema: z.ZodType<T>,
): Promise<LoadedEntry<T>[]> {
  const dir = join(contentRoot, name);
  let files: string[];
  try {
    files = (await readdir(dir)).filter((file) => file.endsWith('.md'));
  } catch {
    throw new Error(`内容目录不存在：${relative(root, dir)}`);
  }

  const entries: LoadedEntry<T>[] = [];
  for (const file of files.sort()) {
    const fullPath = join(dir, file);
    const raw = await readFile(fullPath, 'utf8');
    const { data, body } = splitFrontmatter(raw, relative(root, fullPath));
    const result = schema.safeParse(data);
    if (!result.success) {
      const details = result.error.issues
        .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
        .join('\n');
      throw new Error(`${relative(root, fullPath)} 字段不合法：\n${details}`);
    }
    entries.push({ file: relative(root, fullPath), data: result.data, body });
  }
  return entries;
}

function assertUnique(values: string[], label: string, errors: string[]): void {
  const seen = new Map<string, number>();
  for (const value of values) {
    seen.set(value, (seen.get(value) ?? 0) + 1);
  }
  for (const [value, count] of seen) {
    if (count > 1) errors.push(`${label} 重复 ${count} 次：${value}`);
  }
}

async function main(): Promise<void> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const people = await loadCollection('person', personSchema);
  const projects = await loadCollection('projects', projectSchema);
  const works = await loadCollection('works', workSchema);
  const activities = await loadCollection('activities', activitySchema);

  if (people.length !== 1) {
    errors.push(`src/content/person 必须且只能有一个文件，当前 ${people.length} 个`);
  }

  const person = people[0]?.data;
  if (person) {
    const platforms = person.accounts.map((account) => account.platform);
    assertUnique(platforms, '联系入口平台', errors);
    const emailAccount = person.accounts.find((account) => account.platform === 'email');
    if (emailAccount && emailAccount.url !== `mailto:${person.email}`) {
      errors.push(
        `person.email（${person.email}）与邮箱入口（${emailAccount.url}）不一致`,
      );
    }
  }

  assertUnique(projects.map((entry) => entry.data.id), '项目 id', errors);
  assertUnique(works.map((entry) => entry.data.id), '作品 id', errors);
  assertUnique(activities.map((entry) => entry.data.id), '动态 id', errors);

  // 作品 id 会成为 /writing/{id}/ 或 /videos/{id}/，文章与视频之间也不应重复。
  assertUnique(
    works.map((entry) => `${entry.data.type}:${entry.data.id}`),
    '作品路由',
    errors,
  );

  const projectIds = new Set(projects.map((entry) => entry.data.id));
  const workIds = new Set(works.map((entry) => entry.data.id));
  const displayableProjects = new Set(
    projects.filter((entry) => entry.data.visibility !== 'draft').map((entry) => entry.data.id),
  );
  const displayableWorks = new Set(
    works.filter((entry) => entry.data.visibility !== 'draft').map((entry) => entry.data.id),
  );

  const sourcesRaw = await readFile(join(root, 'data', 'internal', 'sources.json'), 'utf8');
  const sourcesResult = sourcesFileSchema.safeParse(JSON.parse(sourcesRaw));
  if (!sourcesResult.success) {
    errors.push(
      `data/internal/sources.json 不合法：${sourcesResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ')}`,
    );
  }
  const sourceIds = new Set(
    sourcesResult.success ? sourcesResult.data.sources.map((source) => source.id) : [],
  );

  for (const project of projects) {
    for (const id of project.data.relatedWorkIds) {
      if (!workIds.has(id)) {
        errors.push(`${project.file}: relatedWorkIds 指向不存在的作品 ${id}`);
      } else if (!displayableWorks.has(id)) {
        errors.push(`${project.file}: relatedWorkIds 指向 draft 作品 ${id}，公开页会出现空链接`);
      }
    }
    for (const id of project.data.sourceIds) {
      if (!sourceIds.has(id)) {
        errors.push(`${project.file}: sourceIds 指向不存在的内部来源 ${id}`);
      }
    }
    if (project.data.visibility === 'public' && project.data.verification === 'verified') {
      const hasEvidence = project.data.links.some((link) => link.url.startsWith('http'));
      if (!hasEvidence) {
        errors.push(`${project.file}: 公开且已验证的项目必须提供 http(s) 可核查入口`);
      }
    }
  }

  const allTopics: string[] = [];

  for (const work of works) {
    for (const topic of work.data.topics) {
      allTopics.push(topic);
      if (/[\\/?#%]/.test(topic)) {
        errors.push(`${work.file}: 主题“${topic}”含有不能用于静态路径的字符（/ ? # % \\）`);
      }
    }
    for (const id of work.data.relatedProjectIds) {
      if (!projectIds.has(id)) {
        errors.push(`${work.file}: relatedProjectIds 指向不存在的项目 ${id}`);
      } else if (!displayableProjects.has(id)) {
        errors.push(`${work.file}: relatedProjectIds 指向 draft 项目 ${id}，公开页会出现空链接`);
      }
    }
    for (const id of work.data.sourceIds) {
      if (!sourceIds.has(id)) {
        errors.push(`${work.file}: sourceIds 指向不存在的内部来源 ${id}`);
      }
    }
    if (work.data.duplicateOf) {
      const target = works.find((entry) => entry.data.id === work.data.duplicateOf);
      if (!target) {
        errors.push(`${work.file}: duplicateOf 指向不存在的作品 ${work.data.duplicateOf}`);
      } else if (target.data.id === work.data.id) {
        errors.push(`${work.file}: duplicateOf 不能指向自己`);
      } else if (target.data.duplicateOf) {
        errors.push(`${work.file}: duplicateOf 不能指向另一个重复条目 ${target.data.id}`);
      } else if (target.data.type !== work.data.type) {
        errors.push(`${work.file}: duplicateOf 必须指向同类型作品`);
      }
    }
  }

  assertUnique([...new Set(allTopics)].map((topic) => topic.toLocaleLowerCase('zh-CN')), '主题（不区分大小写）', errors);

  for (const activity of activities) {
    const exists =
      activity.data.related.type === 'project'
        ? projectIds.has(activity.data.related.id)
        : workIds.has(activity.data.related.id);
    if (!exists) {
      errors.push(
        `${activity.file}: related 指向不存在的${activity.data.related.type === 'project' ? '项目' : '作品'} ${activity.data.related.id}`,
      );
    }
    for (const id of activity.data.sourceIds) {
      if (!sourceIds.has(id)) {
        errors.push(`${activity.file}: sourceIds 指向不存在的内部来源 ${id}`);
      }
    }
  }

  const sampleCount =
    projects.filter((entry) => entry.data.visibility === 'sample').length +
    works.filter((entry) => entry.data.visibility === 'sample').length +
    activities.filter((entry) => entry.data.visibility === 'sample').length;

  if (sampleCount > 0) {
    warnings.push(
      `当前有 ${sampleCount} 条 sample 内容会显示“示例”横幅并禁止搜索引擎索引；这不等于正式公开。`,
    );
  }

  console.log('内容统计');
  console.log(`  本人资料：${people.length}`);
  console.log(`  项目：${projects.length}（public ${projects.filter((e) => e.data.visibility === 'public').length} / sample ${projects.filter((e) => e.data.visibility === 'sample').length} / draft ${projects.filter((e) => e.data.visibility === 'draft').length}）`);
  console.log(`  作品：${works.length}（文章 ${works.filter((e) => e.data.type === 'article').length} / 视频 ${works.filter((e) => e.data.type === 'video').length}；重复 ${works.filter((e) => e.data.duplicateOf).length}）`);
  console.log(`  动态：${activities.length}`);
  console.log(`  内部来源：${sourceIds.size}`);

  for (const warning of warnings) {
    console.warn(`提示：${warning}`);
  }

  if (errors.length > 0) {
    console.error('\n校验失败：');
    for (const error of errors) console.error(`  - ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log('\n校验通过：字段、路由、关联与来源引用一致。');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
