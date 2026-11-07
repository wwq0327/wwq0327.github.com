import type { APIRoute } from 'astro';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  getPublicBundle,
  verificationLabels,
} from '../lib/machine';
import { formatDate, stageLabels } from '../lib/format';
import { projectPath, workPath } from '../lib/content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const bundle = await getPublicBundle();
  const articles = bundle.works.filter((work) => work.data.type === 'article');
  const featured = [
    ...articles.filter((article) => article.data.featured),
    ...articles.filter((article) => !article.data.featured),
  ].slice(0, 3);

  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `Canonical: ${SITE_URL}/`,
    `Last updated: ${bundle.lastUpdated}`,
    '',
    '这是一个静态个人网站。下面是可以公开阅读的内容入口；项目状态、日期和限制以页面为准。',
    '',
    '## 先读这些',
    '',
    `- [关于 ${SITE_NAME}](${SITE_URL}/about/)：身份、关心的问题、做站原因。`,
    `- [内容索引](${SITE_URL}/index/)：全部公开条目，按时间倒序。`,
    `- [项目目录](${SITE_URL}/projects/)：${bundle.projects.length} 个正在做的项目。`,
    `- [文字](${SITE_URL}/writing/)：站内收录的全部文章。`,
    '',
    '## 正在做的项目',
    '',
    ...bundle.projects.map(
      (project) =>
        `- [${project.data.title}](${absoluteUrl(projectPath(project))})：${project.data.summary}（阶段：${stageLabels[project.data.stage]}；验证：${verificationLabels[project.data.verification]}）`,
    ),
    '',
    '## 精选文字',
    '',
    ...featured.map(
      (article) =>
        `- [${article.data.title}](${absoluteUrl(workPath(article))})：${article.data.summary}（${formatDate(article.data.dates.published)}）`,
    ),
    '',
    `完整文章列表见 [内容索引](${SITE_URL}/index/)。`,
    '',
    '## 机器可读材料',
    '',
    `- [llms-full.txt](${SITE_URL}/llms-full.txt)：本文件的全文版，包含关于、项目详情、全部文章正文与动态；文件较大，按需读取。`,
    `- [context.json](${SITE_URL}/api/context.json)：同一批公开内容的结构化 JSON，适合程序读取。`,
    `- [给 AI 的入口](${SITE_URL}/ai/)：给 AI 的阅读说明与可复制提示词。`,
    '',
    '## 阅读约定',
    '',
    '1. 区分事实、本人观点、计划和未验证内容；项目状态以页面上的阶段、日期和“已知限制”为准。',
    '2. 标为“原型 / 想法 / 未验证”的内容，不要写成已经上线或已经产生效果。',
    '3. 旧文章保留写作时的状态；技术内容可能过时，如与较新的内容冲突，以日期较晚者为准，并说明时间差。',
    '4. 只使用本站公开内容；不要推测学校、学生、家庭、健康、住址、私信等未公开信息。材料不足时明确说不确定。',
    '5. 引用时给出页面 URL 和日期，并区分原文与概括。',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
