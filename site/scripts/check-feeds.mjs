#!/usr/bin/env node
/**
 * 构建后检查 sitemap / RSS / Atom 的基本一致性与日期可信度。
 * 不依赖外网；只验证本地产物。
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const SITE = 'https://wanqing.wang';
const failures = [];

function fail(message) {
  failures.push(message);
}

function pathToFile(url) {
  const { pathname } = new URL(url);
  const decoded = decodeURIComponent(pathname);
  const relative = decoded.endsWith('/') ? `${decoded}index.html` : decoded;
  return join(DIST, relative);
}

function checkDate(value, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    fail(`${label} 日期格式不合法：${value}`);
    return;
  }
  const date = new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(date.getTime())) fail(`${label} 日期无法解析：${value}`);
  if (date > new Date()) fail(`${label} 日期晚于今天：${value}`);
}

const sitemap = await readFile(join(DIST, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?<\/url>/g)].map(
  (match) => ({ loc: match[1], lastmod: match[2] ?? null }),
);
if (urls.length === 0) fail('sitemap 没有 URL');
const seen = new Set();
for (const { loc, lastmod } of urls) {
  if (seen.has(loc)) fail(`sitemap 重复 URL：${loc}`);
  seen.add(loc);
  if (!loc.startsWith(`${SITE}/`)) fail(`sitemap 主机不匹配：${loc}`);
  if (!existsSync(pathToFile(loc))) fail(`sitemap 目标不存在：${loc}`);
  if (lastmod) checkDate(lastmod, `sitemap ${loc}`);
}
const dated = urls.filter((item) => item.lastmod);
const distinctDates = new Set(dated.map((item) => item.lastmod));
if (dated.length > 0 && distinctDates.size < 5) {
  fail(`sitemap lastmod 过于集中：只有 ${distinctDates.size} 个不同日期`);
}

const rss = await readFile(join(DIST, 'rss.xml'), 'utf8');
const rssItems = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
if (rssItems.length === 0) fail('RSS 没有 item');
const rssLinks = new Set();
for (const item of rssItems) {
  const link = item.match(/<link>([^<]+)<\/link>/)?.[1];
  if (!link) {
    fail('RSS item 缺少 link');
    continue;
  }
  if (rssLinks.has(link)) fail(`RSS 重复 link：${link}`);
  rssLinks.add(link);
  if (!existsSync(pathToFile(link))) fail(`RSS 目标不存在：${link}`);
}

const atom = await readFile(join(DIST, 'atom.xml'), 'utf8');
const entries = [...atom.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);
if (entries.length === 0) fail('Atom 没有 entry');
const atomLinks = new Set();
for (const entry of entries) {
  const link = entry.match(/<link href="([^"]+)"/)?.[1];
  const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];
  if (!link) {
    fail('Atom entry 缺少 link');
    continue;
  }
  if (atomLinks.has(link)) fail(`Atom 重复 link：${link}`);
  atomLinks.add(link);
  if (!existsSync(pathToFile(link))) fail(`Atom 目标不存在：${link}`);
  if (published) checkDate(published.slice(0, 10), `Atom ${link}`);
}

if (rssItems.length !== entries.length) {
  fail(`RSS ${rssItems.length} 条与 Atom ${entries.length} 条不一致`);
}

if (failures.length > 0) {
  console.error(`sitemap/feed 检查失败：${failures.length}`);
  for (const message of failures) console.error(`- ${message}`);
  process.exitCode = 1;
} else {
  console.log(
    `sitemap/feed 检查通过：${urls.length} 个 URL（${dated.length} 个 lastmod，${distinctDates.size} 个日期），RSS/Atom 各 ${entries.length} 条。`,
  );
}
