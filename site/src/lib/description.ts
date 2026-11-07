import type { CollectionEntry } from 'astro:content';

type WorkLike = {
  data: { title: string; summary?: string };
  body?: string;
};

/** 去掉 Markdown 结构，留下适合摘要/描述的一段纯文本。 */
export function plainText(value: string, maxLength = 120): string {
  const text = value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[>*_`~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/[，。；：、\s]+$/, '')}…`;
}

/**
 * 文章列表、meta description、OG 与 feed 共用同一份描述。
 * 作者写的 summary 足够长时优先保留；过短时从正文首段生成回退，
 * 不改写原文，也不伪造事实。
 */
export function workDescription(entry: WorkLike, minLength = 40): string {
  const summary = entry.data.summary?.trim() ?? '';
  if (summary.length >= minLength) return summary;

  const fallback = plainText(entry.body ?? '', 96);
  if (fallback.length >= minLength) return fallback;
  if (fallback) return fallback;
  if (summary) return summary;
  return `${entry.data.title}，wanqing 的文字。`;
}

export function workDescriptionFromEntry(entry: CollectionEntry<'works'>): string {
  return workDescription(entry);
}
