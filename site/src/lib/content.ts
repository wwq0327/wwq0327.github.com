import { getCollection, type CollectionEntry } from 'astro:content';
import type { Visibility } from './schema';

export type PersonEntry = CollectionEntry<'person'>;
export type ProjectEntry = CollectionEntry<'projects'>;
export type WorkEntry = CollectionEntry<'works'>;
export type ActivityEntry = CollectionEntry<'activities'>;

/** draft 永不进入页面；sample 可看，但必须带“示例”标记。 */
export function isDisplayable(visibility: Visibility): boolean {
  return visibility === 'public' || visibility === 'sample';
}

export function isSample(visibility: Visibility): boolean {
  return visibility === 'sample';
}

/**
 * 当前站点是否仍在展示合成样本。
 * 只要有 sample 进入页面，就必须显示“非正式公开”提示与 noindex。
 */
export function containsSamples(
  entries: Array<{ data: { visibility: Visibility } }>,
): boolean {
  return entries.some((entry) => isSample(entry.data.visibility));
}

/** 只要任一可见集合里还有 sample，全站就显示示例横幅并禁止索引。 */
export async function siteHasSamples(): Promise<boolean> {
  const [projects, works, activities] = await Promise.all([
    getCollection('projects'),
    getCollection('works'),
    getCollection('activities'),
  ]);
  return containsSamples([...projects, ...works, ...activities]);
}

export async function getPerson(): Promise<PersonEntry> {
  const entries = await getCollection('person');
  if (entries.length !== 1) {
    throw new Error(
      `src/content/person 必须且只能有一个文件，当前为 ${entries.length} 个`,
    );
  }
  return entries[0]!;
}

function newestFirst(values: Array<string | null | undefined>): number {
  return values.reduce<number>((acc, value) => {
    if (!value) return acc;
    const time = Date.parse(value);
    return Number.isNaN(time) ? acc : Math.max(acc, time);
  }, 0);
}

export async function getProjects(): Promise<ProjectEntry[]> {
  const entries = await getCollection('projects');
  return entries
    .filter((entry) => isDisplayable(entry.data.visibility))
    .sort(
      (a, b) =>
        newestFirst([
          b.data.dates.updated,
          b.data.dates.released,
          b.data.dates.started,
        ]) -
        newestFirst([
          a.data.dates.updated,
          a.data.dates.released,
          a.data.dates.started,
        ]),
    );
}

export async function getWorks(): Promise<WorkEntry[]> {
  const entries = await getCollection('works');
  return entries
    .filter((entry) => isDisplayable(entry.data.visibility))
    .sort(
      (a, b) =>
        newestFirst([b.data.dates.published, b.data.dates.authored]) -
        newestFirst([a.data.dates.published, a.data.dates.authored]),
    );
}

export async function getArticles(): Promise<WorkEntry[]> {
  return (await getCanonicalWorks()).filter((entry) => entry.data.type === 'article');
}

export async function getVideos(): Promise<WorkEntry[]> {
  return (await getCanonicalWorks()).filter((entry) => entry.data.type === 'video');
}

/** 列表与机器出口只收首次出现的版本；旧路径仍由 [...legacy] 生成。 */
export async function getCanonicalWorks(): Promise<WorkEntry[]> {
  return (await getWorks()).filter((entry) => !entry.data.duplicateOf);
}

/**
 * 动态只展示“已发生且有指向”的条目：
 * 关联对象必须存在且可见，否则首页会出现指向空页面的更新。
 */
export async function getActivities(): Promise<ActivityEntry[]> {
  const [entries, projects, works] = await Promise.all([
    getCollection('activities'),
    getProjects(),
    getWorks(),
  ]);
  const projectIds = new Set(projects.map((entry) => entry.data.id));
  const workIds = new Set(works.map((entry) => entry.data.id));

  return entries
    .filter((entry) => entry.data.displayed && isDisplayable(entry.data.visibility))
    .filter((entry) =>
      entry.data.related.type === 'project'
        ? projectIds.has(entry.data.related.id)
        : workIds.has(entry.data.related.id),
    )
    .sort((a, b) => Date.parse(b.data.occurredAt) - Date.parse(a.data.occurredAt));
}

/** 内容索引需要的全部可见条目（项目＋作品），按时间排序。 */
export type IndexEntry =
  | { kind: 'project'; entry: ProjectEntry; date: string | null }
  | { kind: 'work'; entry: WorkEntry; date: string | null };

export interface TopicSummary {
  name: string;
  count: number;
  articles: WorkEntry[];
}

export interface ArchiveYear {
  year: string;
  articles: WorkEntry[];
}

export function workDate(entry: WorkEntry): string | null {
  return entry.data.dates.published ?? entry.data.dates.authored ?? null;
}

export async function getIndexEntries(): Promise<IndexEntry[]> {
  const [projects, works] = await Promise.all([getProjects(), getCanonicalWorks()]);
  const rows = [
    ...projects.map((entry) => ({
      kind: 'project' as const,
      entry,
      date: entry.data.dates.updated ?? entry.data.dates.released ?? entry.data.dates.started,
    })),
    ...works.map((entry) => ({
      kind: 'work' as const,
      entry,
      date: entry.data.dates.published ?? entry.data.dates.authored,
    })),
  ];
  return rows.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}



/** 同义主题合并表：只处理明确同义的标签，保留“明史切片”等系列名。 */
const TOPIC_ALIASES: Record<string, string> = {
  人工智能: 'AI',
  AI助手: 'AI工具',
  AI效率工具: 'AI工具',
  效率工具: 'AI工具',
  工作流优化: '工作流',
  AI工作流: '工作流',
  写作方法: '写作',
  写作工具: '写作',
  公众号创作: '公众号',
  创作: '写作',
  个人记录: '记录',
  教学效率: '效率',
  教师效率: '效率',
  'AI Builders': 'Builders',
  技术折腾: '技术动态',
  腾讯WorkBuddy: 'WorkBuddy',
  读书方法: '阅读',
};

export function canonicalTopic(topic: string): string {
  return TOPIC_ALIASES[topic] ?? topic;
}

export function topicLabel(topic: string): string {
  return canonicalTopic(topic);
}
/** 某个主题的固定路径；主题名直接作为路径段，由浏览器编码。 */
export function topicPath(topic: string): string {
  return `/topics/${canonicalTopic(topic)}/`;
}

/** 主题页与主题索引共用同一份聚合，避免计数和列表不一致。 */
export async function getTopics(): Promise<TopicSummary[]> {
  const articles = await getArticles();
  const topics = new Map<string, WorkEntry[]>();
  for (const article of articles) {
    for (const rawTopic of article.data.topics) {
      const topic = canonicalTopic(rawTopic);
      const list = topics.get(topic) ?? [];
      list.push(article);
      topics.set(topic, list);
    }
  }
  return [...topics.entries()]
    .map(([name, list]) => ({ name, count: list.length, articles: list }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}

/** 年份归档只收首次发布的版本，按年、月、日倒序。 */
export async function getArchiveYears(): Promise<ArchiveYear[]> {
  const articles = await getArticles();
  const years = new Map<string, WorkEntry[]>();
  for (const article of articles) {
    const year = workDate(article)?.slice(0, 4) ?? '未标注';
    const list = years.get(year) ?? [];
    list.push(article);
    years.set(year, list);
  }
  return [...years.entries()]
    .map(([year, list]) => ({ year, articles: list }))
    .sort((a, b) => b.year.localeCompare(a.year));
}

export function projectPath(entry: ProjectEntry): string {
  return `/projects/${entry.data.id}/`;
}

export function workPath(entry: WorkEntry): string {
  if (entry.data.legacyPath) return entry.data.legacyPath;
  return entry.data.type === 'video'
    ? `/videos/${entry.data.id}/`
    : `/writing/${entry.data.id}/`;
}

export async function getProjectById(id: string): Promise<ProjectEntry | undefined> {
  return (await getProjects()).find((entry) => entry.data.id === id);
}

export async function getWorkById(id: string): Promise<WorkEntry | undefined> {
  return (await getWorks()).find((entry) => entry.data.id === id);
}
