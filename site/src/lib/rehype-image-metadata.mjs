/**
 * 给 Markdown 正文图片补上 intrinsic 宽高与加载策略。
 *
 * Astro 的 Markdown 图片默认不会读取 public/ 下的原图尺寸。这里在
 * rehype 阶段解析本地文件，避免图片加载前后布局跳动；第一张图不延迟，
 * 其余图片 lazy。外链图片只补 loading/decoding，不猜测尺寸。
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageSize } from 'image-size';

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));

function getAttr(node, name) {
  const prop = node.properties?.[name];
  return typeof prop === 'string' ? prop : undefined;
}

function setAttr(node, name, value) {
  node.properties = { ...node.properties, [name]: value };
}

export default function rehypeImageMetadata() {
  return (tree) => {
    let seen = 0;

    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'img') {
        seen += 1;
        const src = getAttr(node, 'src');

        if (src && src.startsWith('/') && !src.startsWith('//')) {
          const decoded = decodeURIComponent(src.split('?')[0] ?? src);
          const file = join(publicDir, decoded);
          if (existsSync(file)) {
            if (!getAttr(node, 'width') || !getAttr(node, 'height')) {
              try {
                const { width, height } = imageSize(readFileSync(file));
                if (width && height) {
                  setAttr(node, 'width', String(width));
                  setAttr(node, 'height', String(height));
                }
              } catch {
                // 尺寸读不出来时保持原样，交给构建后检查暴露。
              }
            }
          }
        }

        if (!getAttr(node, 'loading')) {
          setAttr(node, 'loading', seen === 1 ? 'eager' : 'lazy');
        }
        if (!getAttr(node, 'decoding')) {
          setAttr(node, 'decoding', 'async');
        }
      }

      for (const child of node.children ?? []) visit(child);
    };

    visit(tree);
  };
}
