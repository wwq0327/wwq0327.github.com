import { defineConfig } from 'astro/config';

// 站点部署在 wanqing.wang 根路径；CNAME 与 .nojekyll 随 public/ 一起发布。
export default defineConfig({
  site: 'https://wanqing.wang',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
});
