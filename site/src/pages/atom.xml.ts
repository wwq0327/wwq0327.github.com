import type { APIRoute } from 'astro';
import { escapeXml, getFeedData } from '../lib/feed';

export const prerender = true;

export const GET: APIRoute = async () => {
  const { site, updated, items } = await getFeedData();
  const entries = items
    .map(
      (item) => `  <entry>
    <title>${escapeXml(item.title)}</title>
    <id>${escapeXml(item.url)}</id>
    <link href="${escapeXml(item.url)}" />
    <published>${item.date.toISOString()}</published>
    <updated>${item.date.toISOString()}</updated>
    <summary>${escapeXml(item.description)}</summary>
    ${item.categories.map((category) => `<category term="${escapeXml(category)}" />`).join('\n    ')}
  </entry>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>wanqing</title>
  <subtitle>wanqing 的个人网站：项目、文字与视频，以及它们发生的时间。</subtitle>
  <id>${site}/</id>
  <link href="${site}/atom.xml" rel="self" type="application/atom+xml" />
  <link href="${site}/" rel="alternate" type="text/html" />
  <updated>${updated.toISOString()}</updated>
  <author><name>wanqing</name><uri>${site}/about/</uri></author>
${entries}
</feed>
`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
};
