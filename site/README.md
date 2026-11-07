# 新站（Astro）

这是个人网站重构的实现，位于仓库的 `site/` 目录。自 2026-11-07 起，`site/dist` 发布在 `master` 根目录，`https://wanqing.wang/` 直接打开新站；旧的 Hexo 源码仍保留，但不再对外提供服务。

## 当前状态

- 已完成：共享布局、路由、统一内容模型与字段校验；#3 的首页/项目/关于视觉；#4 的文章阅读、视频目录、订阅说明与 404；#5 的旧博客文章迁移与真实项目资料写入；`/ai/` 与三层机器可读入口。
- 内容：148 篇旧博客文章按原路径生成（`/{YYYY-MM-DD}/{slug}/`），另收录 6 篇 2026-10-03 至 10-31 的 Sourcebase 公开稿（AI、写作、阅读）；3 个真实项目（Keep Awake、Live Deck、PaperWeave），3 条动态，5 个内部来源；旧文图片本地化 44 张（约 5MB），B091 两张配图在 `public/writing-images/`；微信公众号与视频号二维码在 `public/wechat/`。
- 内容边界：旧文按 2026-11-07 的本人指示全部迁入，只做格式清理，不重写原文；无法下载的 2 张旧图已移除；简介已按 Sourcebase 个人档案与公开稿重写（语文老师、写作/视频、教师 AI 与明史），不再标注待确认。
- 未完成：#5 的 tags/archives/atom 复刻与逐篇校对；#6–#8 采集与摘要；#9 JSON/Markdown 与订阅出口；#11–#12 邮件与调度；#13 端到端验收。
- 已发布：`npm run build` 后把 `dist/` 放到 `master` 根目录；站点包含 `CNAME`（wanqing.wang）与 `.nojekyll`，GitHub Pages 从 `master` 根目录发布。
- 未连接：GitHub API、Sourcebase、邮件服务、自动调度。`data/internal/sources.json` 记录的是 2026-11-07 人工读取状态，不是自动同步。
- 未授权：没有发送任何邮件，没有配置定时发布；本次只做了经本人要求的线上切换。

## 环境与命令

要求 Node.js ≥ 22.12（当前开发机 v22.23.3）。Astro 固定为 7.3.8：最新的 7.4.x 要求 Node ≥ 22.23.4，当前环境不满足。

```bash
cd site
npm install
npm run dev       # 本地开发，默认 http://localhost:4321
npm run check     # astro check（类型与模板检查）
npm run build     # astro check && astro build，输出到 dist/
npm run preview   # 预览已构建的静态站点
npm run validate  # 独立校验内容字段、路由与引用
npm test          # schema 单元测试
```

首次从干净环境开始时，需要 Node、npm 和网络；`node_modules/`、`dist/`、`.astro/` 都不入库。

## 目录

```text
site/
  src/
    content/            公开内容（Markdown + frontmatter）
      person/           本人资料，必须有且只有一个文件
      projects/         项目
      works/            文章与视频（共用模型，type 区分）
      activities/       动态：已发生、可指向证据的变更
    content.config.ts   集合与 schema 绑定
    lib/
      schema.ts         字段定义与跨字段约束
      content.ts        查询、过滤、排序、路径
      format.ts         日期与状态文案
    layouts/            共享布局
    components/         页头、页脚
    pages/              路由
    styles/global.css   设计变量与基础样式
  data/internal/        内部采集状态，不进入公开产物
  scripts/              校验脚本与测试
```

路由：`/`、`/projects/`、`/projects/{id}/`、`/writing/`、`/writing/page/{n}/`、`/videos/`、`/videos/{id}/`、`/about/`、`/subscribe/`、`/index/`、`/404.html`、`/ai/`；旧文保留原路径 `/{YYYY-MM-DD}/{slug}/`。机器可读出口为 `/llms.txt`、`/llms-full.txt`、`/api/context.json`。

## 内容模型

| 集合 | 关键字段 | 说明 |
| --- | --- | --- |
| `person` | `name`、`displayName`、`tagline`、`reviewStatus`、`accounts`、`email` | 页脚与关于页共用；`accounts[].url` 可为 `null`，微信公众号/视频号无公开链接时只显示名称；`reviewStatus: confirmed` 表示称呼与简介已按本人公开资料定稿。 |
| `projects` | `id`、`title`、`summary`、`purpose`、`audience`、`stage`、`useCases`、`provenance`、`limitations`、`verification`、`links`、`dates` | 先说明解决什么、适合谁，再谈状态；`useCases` 用于目录筛选，`provenance` 是可公开的来路说明；`verified` 必须至少有一个 http(s) 入口。 |
| `works` | `id`、`type`、`title`、`author`、`summary`、`dates`、`originalUrl`、`legacyPath`、`platform`、`topics`、`relatedProjectIds`、`media` | 文章与视频共用；`dates.authored` 是原稿日期，`published`/`updated` 未知时写 `null`；没有公开原文链接时 `originalUrl` 写 `null`；视频必须有 `media`；旧文用 `legacyPath` 保留原地址。 |
| `activities` | `id`、`occurredAt`、`kind`、`related`、`summary`、`evidenceUrl`、`displayed` | 只记录已经发生、能指向具体项目或作品的变更；关联对象不可见时不会出现在页面上。 |

公开级别 `visibility`：

- `public`：确认可以公开的内容。
- `sample`：合成样本，可展示但带“示例”标记，全站 `noindex`。
- `draft`：不进入任何页面。

日期只接受真实的 `YYYY-MM-DD`；未知就写 `null`，不用文件名或导入日补造。内部采集状态单独放在 `data/internal/sources.json`，通过 `sourceIds` 与公开内容对应，但不会被打包进站点。

项目目录的用途筛选是少量前端脚本：没有脚本时筛选按钮隐藏、全部项目仍然可见；文章正文、目录与日期均为构建时输出，不依赖脚本。

## 机器可读入口

- `/llms.txt`：短导读，列出身份、项目、精选文字、全文与 JSON 地址，并写明阅读约定。
- `/llms-full.txt`：关于、项目详情、154 篇文章全文与动态；文章标题会降级，避免和顶层章节混淆。文件约 580KB，按需读取。
- `/api/context.json`：同一批公开内容的字段化 JSON（约 620KB），正文中的站内链接已转为绝对地址。
- `/ai/`：给人看的说明页，提供可复制的 AI 提示词与三层材料入口。

这些文件在构建时从 `site/src/content` 的 public 内容生成，不包含 `data/internal/`、Sourcebase 私有资料、订阅名单或后台数据。新增内容后重新构建即可同步。

## 新增内容

1. 在对应集合下新建 Markdown，`id` 与文件名一致，使用小写字母、数字和连字符。
2. 按 schema 填 frontmatter；不确定的日期写 `null`，不要猜。
3. 先设 `visibility: sample` 或 `draft`，确认可以公开后再改为 `public`。
4. 旧文迁移用 `legacyPath` 保留原地址；一次性脚本 `scripts/migrate-legacy.mjs` 会覆盖 `legacy-*` 文件，重跑前先确认源文件与手工修订。
5. 运行 `npm run validate` 和 `npm test`，再运行 `npm run build`。

## 与仓库其他部分的关系

- 根目录的 `package.json`、`_config.yml`、`source/`、`themes/` 仍是 Hexo 站点，没有改动。
- `site/` 有自己的 `package.json` 和依赖锁文件，构建互不影响。
- 线上地址为 `https://wanqing.wang/`；`astro.config.mjs` 的 `site` 已设为该地址，canonical、机器可读文件与绝对链接都以它为准。
- 发布时把 `site/dist` 放到 `master` 根目录；不要运行根目录的 Hexo `npm run deploy`。
