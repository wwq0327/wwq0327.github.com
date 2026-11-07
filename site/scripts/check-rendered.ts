/**
 * 构建后检查：在真实 HTML 上验证正文语义和图片可访问性。
 *
 * 背景：#14 的 `**` 未渲染只有在 HTML 里才看得见；#20 的 alt/尺寸
 * 也不能只信 Markdown 源文件。这个脚本在 `npm run build` 末尾执行，
 * 失败就阻止发布。
 */
import { access, readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function decodeEntities(value: string): string {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function visibleText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|pre|code)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  );
}

function imageIssues(html: string): string[] {
  const issues: string[] = [];
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const attr = (name: string) =>
      tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1];
    const alt = attr('alt');
    if (alt === undefined) issues.push(`缺少 alt：${tag.slice(0, 120)}`);
    else if (alt.trim() === '' && !/\b(aria-hidden|role)="(true|presentation)"/i.test(tag)) {
      issues.push(`alt 为空且未标装饰图：${tag.slice(0, 120)}`);
    }
    if (!attr('width') || !attr('height')) {
      issues.push(`缺少宽高：${tag.slice(0, 120)}`);
    }
    if (!attr('loading')) issues.push(`缺少 loading：${tag.slice(0, 120)}`);
    if (!attr('decoding')) issues.push(`缺少 decoding：${tag.slice(0, 120)}`);
  }
  return issues;
}

async function main(): Promise<void> {
  const files = await walk(dist);
  const errors: string[] = [];

  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const rel = relative(dist, file);
    const text = visibleText(html);

    const bold = [...text.matchAll(/\*\*[^*\n]{1,240}\*\*/g)].map((m) => m[0]);
    if (bold.length > 0) {
      errors.push(`${rel}: 正文仍有字面 **：${bold.slice(0, 3).join(' / ')}`);
    }

    for (const issue of imageIssues(html)) {
      errors.push(`${rel}: ${issue}`);
    }

    // 本地图片必须真实存在；外链留给线上检查，不在构建期请求网络。
    for (const match of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)) {
      const src = decodeEntities(match[1]!);
      if (!src.startsWith('/')) continue;
      const path = decodeURIComponent(src.split('?')[0]!);
      const target = join(dist, path);
      try {
        await access(target);
      } catch {
        errors.push(`${rel}: 图片不存在 ${src}`);
      }
    }
  }

  console.log(`已检查 ${files.length} 个 HTML 页面。`);
  if (errors.length > 0) {
    console.error(`发现 ${errors.length} 个问题：`);
    for (const error of errors.slice(0, 40)) console.error(`- ${error}`);
    if (errors.length > 40) console.error(`- 其余 ${errors.length - 40} 条省略`);
    process.exit(1);
  }
  console.log('渲染检查通过：无字面 Markdown 强调，图片 alt/宽高/加载属性完整。');
}

await main();
