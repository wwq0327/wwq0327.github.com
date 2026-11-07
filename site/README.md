# 新站（Astro）

这是个人网站重构的隔离实现，位于仓库的 `site/` 目录。旧的 Hexo 站点、主题、文章和根目录配置都保留未动；本目录可以独立安装、构建和预览。

## 当前状态

- 已完成：共享布局、基础设计变量、路由骨架、统一内容模型与字段校验。
- 内容：全部是 `visibility: sample` 的合成样本，页面会显示“示例内容”横幅并输出 `noindex`；它们不是正式公开名单。
- 未完成：首页/项目/关于的完整视觉还原（#3）、文章阅读与视频目录细节（#4）、真实内容迁移（#5）、采集与摘要（#6–#8）、JSON/Markdown 出口（#9）、部署与邮件（#10–#12）。
- 未连接：GitHub API、Sourcebase、邮件服务、调度、部署。`data/internal/sources.json` 里的来源状态是合成记录，`status: never`。
- 未授权：没有改动生产 DNS、发布配置或线上内容，也没有发送任何邮件。

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

路由：`/`、`/projects/`、`/projects/{id}/`、`/writing/`、`/writing/{slug}/`、`/videos/`、`/videos/{id}/`、`/about/`、`/subscribe/`、`/index/`、`/404.html`。

## 内容模型

| 集合 | 关键字段 | 说明 |
| --- | --- | --- |
| `person` | `name`、`displayName`、`tagline`、`reviewStatus`、`accounts`、`email` | 页脚与关于页共用；`reviewStatus: draft` 表示称呼与简介尚未由本人确认。 |
| `projects` | `id`、`title`、`summary`、`purpose`、`audience`、`stage`、`limitations`、`verification`、`links`、`dates` | 先说明解决什么、适合谁，再谈状态；`verified` 必须至少有一个 http(s) 入口。 |
| `works` | `id`、`type`、`title`、`author`、`summary`、`dates`、`originalUrl`、`platform`、`topics`、`relatedProjectIds`、`media` | 文章与视频共用；`dates.authored` 是原稿日期，`published`/`updated` 未知时写 `null`；视频必须有 `media`。 |
| `activities` | `id`、`occurredAt`、`kind`、`related`、`summary`、`evidenceUrl`、`displayed` | 只记录已经发生、能指向具体项目或作品的变更；关联对象不可见时不会出现在页面上。 |

公开级别 `visibility`：

- `public`：确认可以公开的内容。
- `sample`：合成样本，可展示但带“示例”标记，全站 `noindex`。
- `draft`：不进入任何页面。

日期只接受真实的 `YYYY-MM-DD`；未知就写 `null`，不用文件名或导入日补造。内部采集状态单独放在 `data/internal/sources.json`，通过 `sourceIds` 与公开内容对应，但不会被打包进站点。

## 新增内容

1. 在对应集合下新建 Markdown，`id` 与文件名一致，使用小写字母、数字和连字符。
2. 按 schema 填 frontmatter；不确定的日期写 `null`，不要猜。
3. 先设 `visibility: sample` 或 `draft`，确认可以公开后再改为 `public`。
4. 运行 `npm run validate` 和 `npm test`，再运行 `npm run build`。

## 与仓库其他部分的关系

- 根目录的 `package.json`、`_config.yml`、`source/`、`themes/` 仍是 Hexo 站点，没有改动。
- `site/` 有自己的 `package.json` 和依赖锁文件，构建互不影响。
- 最终部署方式、域名与 canonical 口径尚未确定，所以 `astro.config.mjs` 暂时不设置 `site`。
