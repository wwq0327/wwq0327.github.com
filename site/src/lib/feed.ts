import type { WorkEntry } from './content';
import { getArticles, workDate, workPath } from './content';
import { workDescription } from './description';

export interface FeedData {
  site: string;
  updated: Date;
  items: Array<{
    title: string;
    url: string;
    description: string;
    date: Date;
    categories: string[];
  }>;
}

function articleDate(entry: WorkEntry): Date {
  const value = workDate(entry) ?? '2026-11-07';
  return new Date(`${value}T00:00:00+08:00`);
}

export async function getFeedData(): Promise<FeedData> {
  const site = 'https://wanqing.wang';
  const articles = await getArticles();
  const items = articles.map((article) => ({
    title: article.data.title,
    url: new URL(workPath(article), site).href,
    description: workDescription(article, 40),
    date: articleDate(article),
    categories: article.data.topics,
  }));
  const updated = items.reduce(
    (latest, item) => (item.date > latest ? item.date : latest),
    new Date('2026-11-07T00:00:00+08:00'),
  );
  return { site, updated, items };
}

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
