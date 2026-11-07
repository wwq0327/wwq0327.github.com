import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
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
  return (await getWorks()).filter((entry) => entry.data.type === 'article');
}

export async function getVideos(): Promise<WorkEntry[]> {
  return (await getWorks()).filter((entry) => entry.data.type === 'video');
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
export async function getIndexEntries(): Promise<
  Array<
    | { kind: 'project'; entry: ProjectEntry; date: string | null }
    | { kind: 'work'; entry: WorkEntry; date: string | null }
  >
> {
  const [projects, works] = await Promise.all([getProjects(), getWorks()]);
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

export function projectPath(entry: ProjectEntry): string {
  return `/projects/${entry.data.id}/`;
}

export function workPath(entry: WorkEntry): string {
  return entry.data.type === 'video'
    ? `/videos/${entry.data.id}/`
    : `/writing/${entry.data.id}/`;
}

export async function getProjectById(id: string): Promise<ProjectEntry | undefined> {
  const entry = await getEntry('projects', id);
  if (!entry) return undefined;
  return isDisplayable(entry.data.visibility) ? entry : undefined;
}

export async function getWorkById(id: string): Promise<WorkEntry | undefined> {
  const entry = await getEntry('works', id);
  if (!entry) return undefined;
  return isDisplayable(entry.data.visibility) ? entry : undefined;
}
