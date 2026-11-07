import type { ActivityEntry, PersonEntry, ProjectEntry, WorkEntry } from './content';
import {
  getActivities,
  getPerson,
  getProjects,
  getWorks,
  projectPath,
  workPath,
} from './content';
import {
  formatDate,
  projectUseLabels,
  stageLabels,
  workTypeLabels,
} from './format';

export const SITE_URL = 'https://wanqing.wang';
export const SITE_NAME = 'wanqing';
export const SITE_TITLE = 'wanqing｜思考有迹，实践有形';
export const SITE_DESCRIPTION =
  'wanqing 的个人网站：语文老师，也写公众号、拍视频，记录项目、文字与视频。';

export const verificationLabels = {
  verified: '已验证',
  partial: '部分验证',
  unverified: '未验证',
} as const;

export interface PublicBundle {
  person: PersonEntry;
  projects: ProjectEntry[];
  works: WorkEntry[];
  activities: ActivityEntry[];
  lastUpdated: string;
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

/** 把正文里的站内链接与图片改成绝对地址，便于外部 AI 直接引用。 */
export function absolutize(markdown: string): string {
  return markdown.replace(/\]\((\/[^)\s]+)\)/g, `](${SITE_URL}$1)`);
}

/** 把正文标题降级，避免文章内的 h2 与 llms-full 的顶层章节混在一起；跳过代码围栏。 */
export function demoteHeadings(markdown: string, levels: number): string {
  let inFence = false;
  return markdown
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)\s*[A-Za-z0-9_+-]*\s*$/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      return line.replace(/^(#{1,6})(\s+)/, (_, hashes: string, space: string) => {
        return '#'.repeat(Math.min(6, hashes.length + levels)) + space;
      });
    })
    .join('\n');
}

function maxDate(values: Array<string | null | undefined>): string {
  const dates = values.filter((value): value is string => Boolean(value)).sort();
  return dates.at(-1) ?? new Date().toISOString().slice(0, 10);
}

export async function getPublicBundle(): Promise<PublicBundle> {
  const [person, projects, works, activities] = await Promise.all([
    getPerson(),
    getProjects(),
    getWorks(),
    getActivities(),
  ]);

  const publicProjects = projects.filter((project) => project.data.visibility === 'public');
  const publicWorks = works.filter((work) => work.data.visibility === 'public');
  const publicActivities = activities.filter((activity) => activity.data.visibility === 'public');

  const lastUpdated = maxDate([
    person.data.updatedAt,
    ...publicProjects.flatMap((project) => [
      project.data.dates.started,
      project.data.dates.released,
      project.data.dates.updated,
      ...project.data.changes.map((change) => change.date),
    ]),
    ...publicWorks.flatMap((work) => [
      work.data.dates.authored,
      work.data.dates.published,
      work.data.dates.updated,
    ]),
    ...publicActivities.map((activity) => activity.data.occurredAt),
  ]);

  return {
    person,
    projects: publicProjects,
    works: publicWorks,
    activities: publicActivities,
    lastUpdated,
  };
}

export function personMarkdown(person: PersonEntry): string {
  const accounts = person.data.accounts
    .map((account) => `- ${account.label ?? account.platform}: ${account.url}`)
    .join('\n');

  return [
    `### ${person.data.displayName}`,
    '',
    `> ${person.data.tagline}`,
    '',
    `- 站点：${SITE_URL}/`,
    `- 关于页：${SITE_URL}/about/`,
    `- 邮箱：${person.data.email}`,
    '',
    '#### 联系方式',
    '',
    accounts,
    '',
    '#### 本人自述',
    '',
    absolutize(person.body ?? ''),
  ].join('\n');
}

export function projectMarkdown(project: ProjectEntry): string {
  const data = project.data;
  const lines = [
    `### ${data.title}`,
    '',
    `- 页面：${absoluteUrl(projectPath(project))}`,
    `- 阶段：${stageLabels[data.stage]}`,
    `- 验证：${verificationLabels[data.verification]}`,
    `- 用途：${data.useCases.map((use) => projectUseLabels[use]).join('、') || '未标注'}`,
    `- 摘要：${data.summary}`,
    `- 适合谁：${data.audience}`,
    `- 开始：${formatDate(data.dates.started)}`,
    `- 发布：${formatDate(data.dates.released)}`,
    `- 最近更新：${formatDate(data.dates.updated)}`,
    `- 来源说明：${data.provenance ?? '未标注'}`,
  ];

  if (data.limitations.length > 0) {
    lines.push('', '已知限制：', ...data.limitations.map((item) => `- ${item}`));
  }
  if (data.links.length > 0) {
    lines.push('', '入口：', ...data.links.map((link) => `- ${link.label}: ${link.url}`));
  }
  if (data.changes.length > 0) {
    lines.push(
      '',
      '重要变更：',
      ...data.changes.map((change) => `- ${formatDate(change.date)}：${change.summary}`),
    );
  }

  lines.push('', demoteHeadings(absolutize(project.body ?? ''), 2));
  return lines.join('\n');
}

export function workMarkdown(work: WorkEntry): string {
  const data = work.data;
  const topics = data.topics.length > 0 ? data.topics.join('、') : '未标注';
  const lines = [
    `### ${data.title}`,
    '',
    `- 页面：${absoluteUrl(workPath(work))}`,
    `- 类型：${workTypeLabels[data.type]}`,
    `- 摘要：${data.summary}`,
    `- 主题：${topics}`,
    `- 写作：${formatDate(data.dates.authored)}`,
    `- 发布：${formatDate(data.dates.published)}`,
    `- 修订：${formatDate(data.dates.updated)}`,
  ];

  if (data.media && data.media.durationSeconds != null) {
    const duration = data.media.durationSeconds;
    lines.push(`- 时长：${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`);
  }
  lines.push('', demoteHeadings(absolutize(work.body ?? ''), 2));
  return lines.join('\n');
}

export function activityMarkdown(activity: ActivityEntry): string {
  const targetType = activity.data.related.type === 'project' ? '项目' : '作品';
  return `- ${formatDate(activity.data.occurredAt)}：${activity.data.summary}（${targetType}：${activity.data.related.id}）`;
}
