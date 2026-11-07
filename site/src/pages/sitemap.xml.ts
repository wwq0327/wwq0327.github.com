import type { APIRoute } from 'astro';
import {
  getArticles,
  getIndexEntries,
  getProjects,
  getTopics,
  projectPath,
  topicPath,
  workDate,
  workPath,
} from '../lib/content';

export const prerender = true;

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = async () => {
  const [articles, projects, topics, indexEntries] = await Promise.all([
    getArticles(),
    getProjects(),
    getTopics(),
    getIndexEntries(),
  ]);
  const site = 'https://wanqing.wang';
  const latest = articles[0] ? workDate(articles[0]) : null;
  const writingPages = Math.ceil(articles.length / 20);
  const indexPages = Math.ceil(indexEntries.length / 30);

  const paths = new Set<string>([
    '/',
    '/projects/',
    '/writing/',
    '/videos/',
    '/topics/',
    '/archive/',
    '/about/',
    '/subscribe/',
    '/index/',
    '/ai/',
  ]);

  for (const article of articles) paths.add(workPath(article));
  for (const project of projects) paths.add(projectPath(project));
  for (const topic of topics.filter((item) => item.count >= 2)) {
    paths.add(topicPath(topic.name));
  }
  for (let page = 2; page <= writingPages; page += 1) paths.add(`/writing/page/${page}/`);
  for (let page = 2; page <= indexPages; page += 1) paths.add(`/index/page/${page}/`);

  const urls = [...paths]
    .sort()
    .map((path) => {
      const loc = new URL(path, site).href;
      return latest
        ? `  <url><loc>${escapeXml(loc)}</loc><lastmod>${latest}</lastmod></url>`
        : `  <url><loc>${escapeXml(loc)}</loc></url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
