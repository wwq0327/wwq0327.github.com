import type { APIRoute } from 'astro';
import { escapeXml, getFeedData } from '../lib/feed';

export const prerender = true;

export const GET: APIRoute = async () => {
  const { site, updated, items } = await getFeedData();
  const entries = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
      ${item.categories.map((category) => `<category>${escapeXml(category)}</category>`).join('\n      ')}
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>wanqing</title>
    <link>${site}/</link>
    <description>wanqing 的个人网站：项目、文字与视频，以及它们发生的时间。</description>
    <language>zh-CN</language>
    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
${entries}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
