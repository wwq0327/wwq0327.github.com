import type { APIRoute } from 'astro';
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  activityMarkdown,
  getPublicBundle,
  personMarkdown,
  projectMarkdown,
  workMarkdown,
} from '../lib/machine';

export const prerender = true;

export const GET: APIRoute = async () => {
  const bundle = await getPublicBundle();
  const articles = bundle.works.filter((work) => work.data.type === 'article');
  const videos = bundle.works.filter((work) => work.data.type === 'video');

  const lines = [
    `# ${SITE_TITLE}：公开内容全文`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `Canonical: ${SITE_URL}/`,
    `Last updated: ${bundle.lastUpdated}`,
    `统计：${bundle.projects.length} 个项目，${articles.length} 篇文章，${videos.length} 个视频，${bundle.activities.length} 条动态。`,
    '',
    '本文件由站点构建生成，只包含公开内容。项目状态、日期和限制以对应页面为准。',
    '',
    '## 关于',
    '',
    personMarkdown(bundle.person),
    '',
    '## 项目',
    '',
    ...bundle.projects.map((project) => `${projectMarkdown(project)}\n\n---\n`),
    '## 文字',
    '',
    ...articles.map((article) => `${workMarkdown(article)}\n\n---\n`),
    '## 视频',
    '',
    ...(videos.length > 0
      ? videos.map((video) => `${workMarkdown(video)}\n\n---\n`)
      : ['站内暂时没有逐条收录的视频；平台入口见 ' + SITE_URL + '/videos/。']),
    '',
    '## 最近发生',
    '',
    ...bundle.activities.map(activityMarkdown),
    '',
    '## 引用与边界',
    '',
    '- 本站只有公开内容；不包含未公开的个人资料、订阅名单、访问统计或后台数据。',
    '- 标为“原型 / 想法 / 未验证”的内容，不要写成已经上线或已经产生效果。',
    '- 旧文章保留写作时的状态；技术内容可能过时，如与较新的内容冲突，以日期较晚者为准，并说明时间差。',
    '- 引用时请给出页面 URL 和日期，并区分原文与概括。',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
