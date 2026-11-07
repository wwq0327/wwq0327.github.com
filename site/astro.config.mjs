import { defineConfig } from 'astro/config';

// 最终域名（CNAME: wanqing.wang）与发布目标尚未核验，因此这里不写死 `site`。
// 等 #10 部署验证确认域名、HTTPS 与 canonical 口径后再统一设置。
export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
});
