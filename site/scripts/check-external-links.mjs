#!/usr/bin/env node
/**
 * 检查构建产物里的外部链接。
 *
 * 不放进 build：构建不应依赖外网；这个脚本在需要时手动运行。
 * 403/419/429 视为反爬或限流，记录为 warning，不判失败。
 * learn.chatgpt.com 等已知 TLS 不稳的站点在 EXCEPTIONS 中说明。
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const EXCEPTIONS = new Map([
  ['book.douban.com', '豆瓣对脚本返回 403'],
  ['www.douban.com', '豆瓣对脚本返回 403'],
  ['www.zhihu.com', '知乎对脚本返回 403'],
  ['news.ycombinator.com', 'Hacker News 对脚本返回 419'],
  ['www.jianshu.com', '简书对脚本偶发超时，浏览器可打开'],
  ['web.archive.org', 'Wayback Machine 对批量脚本限流；链接已抽查'],
  ['learn.chatgpt.com', '官方文档站 TLS 偶发握手失败'],
]);

async function collectHtml(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await collectHtml(path)));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

function decode(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

async function checkOnce(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
      },
    });
    return { status: response.status, finalUrl: response.url };
  } catch (error) {
    return { status: 0, error: error.name === 'AbortError' ? 'timeout' : String(error.message) };
  } finally {
    clearTimeout(timer);
  }
}

async function check(url) {
  let result = await checkOnce(url);
  // 网络抖动与 5xx 重试一次；404/410 不重试，避免把死链拖慢。
  if (result.status === 0 || result.status >= 500) {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    result = await checkOnce(url);
  }
  return result;
}

const files = await collectHtml(DIST);
const links = new Map();
for (const file of files) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) {
    const href = decode(match[1]);
    if (!/^https?:\/\//i.test(href)) continue;
    const url = new URL(href);
    if (url.hostname === 'wanqing.wang' || url.hostname === 'www.wanqing.wang') continue;
    links.set(url.href, (links.get(url.href) ?? 0) + 1);
  }
}

const results = [];
const queue = [...links.entries()];
const workers = Array.from({ length: 4 }, async () => {
  while (queue.length > 0) {
    const [url, count] = queue.shift();
    results.push({ url, count, ...(await check(url)) });
  }
});
await Promise.all(workers);

const warnings = [];
const failures = [];
for (const result of results.sort((a, b) => a.url.localeCompare(b.url))) {
  const host = new URL(result.url).hostname;
  if (result.status >= 200 && result.status < 400) continue;
  if ([403, 419, 429].includes(result.status) || EXCEPTIONS.has(host)) {
    warnings.push(result);
  } else {
    failures.push(result);
  }
}

console.log(`检查 ${files.length} 个 HTML，${links.size} 个唯一外链。`);
if (warnings.length > 0) {
  console.log(`\n警告（反爬/限流/已知 TLS 问题，保留链接）：${warnings.length}`);
  for (const item of warnings) {
    const reason = EXCEPTIONS.get(new URL(item.url).hostname) ?? `HTTP ${item.status}`;
    console.log(`- ${item.url} ← ${reason}`);
  }
}
if (failures.length > 0) {
  console.log(`\n失败：${failures.length}`);
  for (const item of failures) {
    console.log(`- ${item.url} ← ${item.status || item.error}`);
  }
  process.exitCode = 1;
} else {
  console.log('\n没有未处理的失效外链。');
}
