#!/usr/bin/env node
/**
 * 一次性迁移旧 Hexo 博客文章。
 *
 * - 只读取 source/_posts，不修改旧博客原文。
 * - 每篇生成 site/src/content/works/legacy-*.md，保留原始日期与旧 URL。
 * - 本地图片复制到 site/public/legacy/images；远程图片下载后改为本地路径。
 * - 生成 docs/内容迁移清单-2026-11-07.md。
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(siteDir, '..');
const postsDir = path.join(rootDir, 'source/_posts');
const outDir = path.join(siteDir, 'src/content/works');
const imageOutDir = path.join(siteDir, 'public/legacy/images');
const assetsDir = path.join(rootDir, 'assets/images');
const inventoryPath = path.join(rootDir, 'docs/内容迁移清单-2026-11-07.md');

const SPECIAL_IDS = {
  '2014-02-12-blog-why': 'blog-why-2014-02',
  '2014-04-19-blog-why': 'blog-why-2014-04',
  '2020-11-20-我是如何把WIFI带宽由100M提升到400M的': 'wifi-100m-to-400m',
  '2020-11-30-作为一个网民，你到底购买了多少个会员服务？': 'membership-services',
  '2021-02-18-iphone摔坏之后': 'iphone-x-dropped',
  '2021-02-18-谈四十而不惑': 'forty-years-without-doubt',
  '2026-03-08-把流程梳理出来交给ai': 'flow-to-ai',
  '2026-03-15-which-chinese-llm-is-best-for-wechat-public-account-content-creation-i-tested-5-mainstream-models':
    'chinese-llm-wechat-test',
  '2026-03-20-yi-ge-yu-wen-lao-shi-yong-yi-ci-shen-du-dui-hua-rang-ai-sheng-cheng-ti-ku-kuang-jia':
    'ai-question-bank-framework',
};

const LOCAL_SNAPSHOT_SEQUENCES = {
  '2015-09-21-keynote-tut-01': [
    '2015-09-21 15.47.42.png',
    '2015-09-21 15.48.04.png',
    '界面.png',
    '2015-09-21 16.03.50.png',
    '2015-09-21 16.04.22.png',
    '2015-09-21 16.13.04.png',
  ],
  '2016-01-03-scrapy-m-page': [
    '2016-01-03 09.51.28.png',
    '2016-01-03 10.04.29.png',
    '2016-01-03 10.05.19.png',
    '2016-01-03 10.14.47.png',
    '2016-01-03 10.54.23.png',
  ],
  '2015-01-27-hello-2015-test': ['2015-01-01 10.33.41.png'],
};

const warnings = [];

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/^\uFEFF/, '');
}

function splitFrontmatter(raw) {
  let text = normalizeNewlines(raw);
  // 两篇 2021 文章的开头被写成了“$---ntags:”，其余字段正常。
  if (text.startsWith('$---ntags:\n')) text = '---\ntags:\n' + text.slice('$---ntags:\n'.length);
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { fm: {}, body: text };
  let fm = {};
  try {
    fm = YAML.parse(match[1]) ?? {};
  } catch (error) {
    warnings.push(`${raw.slice(0, 20)} 前置字段解析失败：${error.message}`);
  }
  return { fm, body: text.slice(match[0].length) };
}

function getField(fm, name) {
  if (Object.prototype.hasOwnProperty.call(fm, name)) return fm[name];
  const key = Object.keys(fm).find((item) => item.toLowerCase() === name.toLowerCase());
  return key ? fm[key] : undefined;
}

function isoDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = String(value ?? '').trim();
  const match = text.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : '';
}

function list(value) {
  if (value == null) return [];
  return (Array.isArray(value) ? value : [value])
    .map((item) => String(item).trim())
    .filter(Boolean);
}

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function clipText(text, max) {
  if (text.length <= max) return text;
  const window = text.slice(0, max);
  const sentenceEnd = Math.max(
    window.lastIndexOf('。'),
    window.lastIndexOf('！'),
    window.lastIndexOf('？'),
  );
  if (sentenceEnd >= 40) return window.slice(0, sentenceEnd + 1);
  return `${window.slice(0, max - 1)}…`;
}

function makeSummary(fm, body, title) {
  const description = String(getField(fm, 'description') ?? '').trim();
  if (description) return clipText(description, 120);
  const plain = stripMarkdown(body);
  if (plain) return clipText(plain, 110);
  return `${title}（旧博客存档）`;
}

function normalizeId(stem) {
  if (SPECIAL_IDS[stem]) return SPECIAL_IDS[stem];
  const base = stem.replace(/^\d{4}-\d{2}-\d{2}-/, '').toLowerCase();
  let id = base.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!id) throw new Error(`无法从文件名生成稳定 ID：${stem}`);
  if (id.length > 80) id = id.slice(0, 80).replace(/-[^-]*$/, '');
  return id;
}

function escapeCell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

async function fetchImage(url, filenameBase) {
  const targetPath = path.join(imageOutDir, filenameBase);
  if (existsSync(targetPath)) return `/legacy/images/${filenameBase}`;
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(targetPath, buffer);
    return `/legacy/images/${filenameBase}`;
  } catch (error) {
    warnings.push(`远程图片下载失败：${url}（${error.message}）`);
    return null;
  }
}

function imageExtension(url) {
  const pathname = new URL(url).pathname;
  const ext = path.extname(decodeURIComponent(pathname)).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext) ? ext : '.jpg';
}

async function processImages(body, stem, id) {
  const snapshotQueue = LOCAL_SNAPSHOT_SEQUENCES[stem] ? [...LOCAL_SNAPSHOT_SEQUENCES[stem]] : [];
  let imageIndex = 0;
  const lines = body.split('\n');
  let fenced = false;
  const output = [];

  for (const line of lines) {
    if (/^```|^~~~/.test(line.trim())) {
      fenced = !fenced;
      output.push(line);
      continue;
    }
    if (fenced || /^( {4}|\t)/.test(line)) {
      output.push(line);
      continue;
    }
    const imagePattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
    if (!imagePattern.test(line)) {
      output.push(line);
      continue;
    }
    imagePattern.lastIndex = 0;
    const replaced = line.replace(imagePattern, (whole, alt, rawUrl) => {
      imageIndex += 1;
      let nextUrl = null;
      if (rawUrl.startsWith('/assets/images/')) {
        let name = decodeURIComponent(rawUrl.slice('/assets/images/'.length));
        let sourceName = name;
        if (!path.extname(name) && name.startsWith('屏幕快照') && snapshotQueue.length > 0) {
          sourceName = snapshotQueue.shift();
        }
        const sourcePath = path.join(assetsDir, sourceName);
        if (existsSync(sourcePath)) {
          const ext = path.extname(sourceName).toLowerCase() || '.png';
          const filename = `${id}-${String(imageIndex).padStart(2, '0')}${ext}`;
          // 同步复制，确保写入 Markdown 前文件已经存在。
          copyFileSync(sourcePath, path.join(imageOutDir, filename));
          nextUrl = `/legacy/images/${filename}`;
        } else {
          warnings.push(`本地图片缺失：${stem} -> ${rawUrl}`);
        }
      }
      if (!nextUrl) return whole;
      return `![${alt}](${nextUrl})`;
    });
    output.push(replaced);
  }
  return output.join('\n');
}

async function processRemoteImages(body, id) {
  let imageIndex = 0;
  const lines = body.split('\n');
  let fenced = false;
  const output = [];
  for (const line of lines) {
    if (/^```|^~~~/.test(line.trim())) {
      fenced = !fenced;
      output.push(line);
      continue;
    }
    if (fenced || /^( {4}|\t)/.test(line)) {
      output.push(line);
      continue;
    }
    const imagePattern = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g;
    imagePattern.lastIndex = 0;
    if (!imagePattern.test(line)) {
      output.push(line);
      continue;
    }
    imagePattern.lastIndex = 0;
    let replaced = line;
    for (const match of [...line.matchAll(imagePattern)]) {
      imageIndex += 1;
      const [whole, alt, url] = match;
      const ext = imageExtension(url);
      const filename = `${id}-remote-${String(imageIndex).padStart(2, '0')}${ext}`;
      const local = await fetchImage(url, filename);
      // 下载失败且没有本地副本时删掉图片，避免公开页出现裂图或混合内容。
      replaced = replaced.replace(whole, local ? `![${alt}](${local})` : '');
    }
    output.push(replaced);
  }
  return output.join('\n');
}

function cleanBody(body, title) {
  let text = body.replace(/<!--\s*more\s*-->/gi, '').trim();
  text = text.replace(/^(#{1,6})([^\s#])/gm, '$1 $2');
  const lines = text.split('\n');
  const firstContent = lines.findIndex((line) => line.trim());
  if (firstContent >= 0) {
    const candidate = lines[firstContent].replace(/^#\s*/, '').trim();
    if (candidate === title.trim()) lines.splice(firstContent, 1);
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(imageOutDir, { recursive: true });

  const files = (await readdir(postsDir)).filter((name) => name.endsWith('.md') || name.endsWith('.markdown')).sort();
  const rows = [];
  const usedIds = new Map();

  for (const file of files) {
    const stem = path.basename(file, path.extname(file));
    const raw = await readFile(path.join(postsDir, file), 'utf8');
    const { fm, body: rawBody } = splitFrontmatter(raw);
    const date = isoDate(getField(fm, 'date')) || stem.slice(0, 10);
    const title = String(getField(fm, 'title') ?? getField(fm, 'Title') ?? '').trim() || stem.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const slug = stem.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const legacyPath = `/${date}/${slug}/`;
    const id = normalizeId(stem);
    if (usedIds.has(id)) throw new Error(`稳定 ID 冲突：${id}（${usedIds.get(id)} 与 ${stem}）`);
    usedIds.set(id, stem);

    const topics = [...new Set([...list(getField(fm, 'tags')), ...list(getField(fm, 'categories'))])].slice(0, 6);
    let body = cleanBody(rawBody, title);
    body = await processImages(body, stem, id);
    body = await processRemoteImages(body, id);

    const authored = date;
    const published = date;
    const updated = isoDate(getField(fm, 'updated')) || null;
    const summary = makeSummary(fm, rawBody, title);
    const originalUrl = `https://wwq0327.github.io${encodeURI(legacyPath)}`;

    const data = {
      id,
      title,
      type: 'article',
      author: 'wanqing',
      summary,
      language: 'zh',
      visibility: 'public',
      featured: false,
      dates: { authored, published, updated },
      originalUrl,
      legacyPath,
      platform: '旧博客',
      topics,
      relatedProjectIds: [],
      sourceIds: ['legacy-blog'],
      media: null,
    };

    const frontmatter = YAML.stringify(data, { lineWidth: 0 }).trim();
    const output = `---\n${frontmatter}\n---\n\n${body}\n`;
    await writeFile(path.join(outDir, `legacy-${date}-${id}.md`), output, 'utf8');
    rows.push({ date, title, legacyPath, topics, id, chars: body.length });
  }

  rows.sort((a, b) => b.date.localeCompare(a.date));

  const table = rows
    .map(
      (row) =>
        `| ${row.date} | ${escapeCell(row.title)} | \`${row.legacyPath}\` | ${escapeCell(row.topics.join('、') || '—')} | 迁入 |`,
    )
    .join('\n');

  const doc = `# 内容迁移清单（旧博客）

生成时间：2026-11-07
来源：\`source/_posts\`（只读，未修改）
范围：${rows.length} 篇旧博客文章。按本人 2026-11-07 的指示全部迁入；所有条目原本已在旧站公开。

- 新站内容文件：\`site/src/content/works/legacy-*.md\`
- 旧路径：\`/YYYY-MM-DD/slug/\`，由 \`site/src/pages/[...legacy].astro\` 原路径生成
- 新站固定链接字段：\`legacyPath\`；\`workPath()\` 对旧文返回旧路径
- 图片：本地图片复制到 \`site/public/legacy/images/\`；可访问的远程图片下载后本地化
- 两篇 2021 文章的 \`$---ntags:\` 前缀已修复为 \`---\\ntags:\`
- 正文仅做格式清理：去掉重复 H1、修复标题井号后缺空格、移除 \`<!-- more -->\`；未重写个人经历
- 未完成：archives/tags/分页/atom.xml 等旧入口尚未逐一复刻；正文未逐篇人工校对

## 逐项清单

| 日期 | 标题 | 旧路径 | 主题 | 决定 |
| --- | --- | --- | --- | --- |
${table}

## 生成过程中的提示

${warnings.length ? warnings.map((item) => `- ${item}`).join('\n') : '- 无'}
`;

  await writeFile(inventoryPath, doc, 'utf8');
  console.log(`迁移 ${rows.length} 篇，图片目录 ${imageOutDir}`);
  console.log(`提示 ${warnings.length} 条，详见 ${inventoryPath}`);
}

await main();
