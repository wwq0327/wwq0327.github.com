import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkCjkFriendly from 'remark-cjk-friendly/parseOnly';
import rehypeImageMetadata from './src/lib/rehype-image-metadata.mjs';

// 站点部署在 wanqing.wang 根路径；CNAME 与 .nojekyll 随 public/ 一起发布。
export default defineConfig({
  site: 'https://wanqing.wang',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  markdown: {
    // CommonMark 的强调定界规则会漏掉“**中文。**中文”这类写法；
    // 站点以中文为主，统一按 CJK-friendly 规则解析。
    processor: unified({
      remarkPlugins: [remarkCjkFriendly],
      rehypePlugins: [rehypeImageMetadata],
    }),
  },
  devToolbar: {
    enabled: false,
  },
});
