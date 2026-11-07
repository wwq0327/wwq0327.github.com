import type { ActivityKind, ProjectStage } from './schema';

/** 站点统一使用 2026.11.06 这种不带时区的写法，避免把导入日当发生日。 */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '日期待确认';
  return value.replaceAll('-', '.');
}

export function formatMonthDay(value: string | null | undefined): string {
  if (!value) return '日期待确认';
  const [, month, day] = value.split('-');
  return `${month}.${day}`;
}

export const stageLabels: Record<ProjectStage, string> = {
  idea: '想法',
  prototype: '原型',
  alpha: '内测',
  beta: '公测',
  released: '已发布',
  maintained: '维护中',
  paused: '暂停',
  archived: '归档',
};

export const activityLabels: Record<ActivityKind, string> = {
  'project-release': '项目发布',
  'project-update': '项目更新',
  'article-published': '文章发布',
  'article-updated': '文章修订',
  'video-published': '视频发布',
  milestone: '阶段记录',
};

export const workTypeLabels = {
  article: '文字',
  video: '视频',
} as const;
