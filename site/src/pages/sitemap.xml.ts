import type { APIRoute } from 'astro';
import type { WorkEntry } from '../lib/content';
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

function latestDate(entries: WorkEntry[]): string | null {
  return entries.reduce<string | null>((latest, entry) => {
    const value = entry.data.dates.updated ?? workDate(entry);
    return value && (!latest || value > latest) ? value : latest;
  }, null);
}

export const GET: APIRoute = async () => {
  const [articles, projects, topics, indexEntries] = await Promise.all([
    getArticles(),
    getProjects(),
    getTopics(),
    getIndexEntries(),
  ]);
  const site = 'https://wanqing.wang';
  const latestArticle = articles.reduce<string | null>((latest, article) => {
    const value = article.data.dates.updated ?? workDate(article);
    return value && (!latest || value > latest) ? value : latest;
  }, null);
  const latestProject = projects.reduce<string | null>((latest, project) => {
    const value =
      project.data.dates.updated ??
      project.data.dates.released ??
      project.data.dates.started;
    return value && (!latest || value > latest) ? value : latest;
  }, null);
  const writingPages = Math.ceil(articles.length / 20);
  const indexPages = Math.ceil(indexEntries.length / 30);

  const lastmods = new Map<string, string>();
  const setLastmod = (path: string, value: string | null) => {
    if (value) lastmods.set(path, value);
  };

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

  // 聚合页只有在能对应到明确内容日期时才写 lastmod；无法确定的静态页省略。
  setLastmod('/', latestArticle);
  setLastmod('/projects/', latestProject);
  setLastmod('/writing/', latestArticle);
  setLastmod('/topics/', latestArticle);
  setLastmod('/archive/', latestArticle);
  setLastmod('/index/', latestArticle);

  for (const article of articles) {
    const path = workPath(article);
    paths.add(path);
    setLastmod(path, article.data.dates.updated ?? workDate(article));
  }
  for (const project of projects) {
    const path = projectPath(project);
    paths.add(path);
    setLastmod(
      path,
      project.data.dates.updated ??
        project.data.dates.released ??
        project.data.dates.started,
    );
  }
  for (const topic of topics.filter((item) => item.count >= 2)) {
    const path = topicPath(topic.name);
    paths.add(path);
    setLastmod(path, latestDate(topic.articles));
  }
  // 分页页的内容会随新增文章整体后移，无法给单页可靠日期，省略 lastmod。
  for (let page = 2; page <= writingPages; page += 1) paths.add(`/writing/page/${page}/`);
  for (let page = 2; page <= indexPages; page += 1) paths.add(`/index/page/${page}/`);

  const urls = [...paths]
    .sort()
    .map((path) => {
      const loc = escapeXml(new URL(path, site).href);
      const lastmod = lastmods.get(path);
      return lastmod
        ? `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`
        : `  <url><loc>${loc}</loc></url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
