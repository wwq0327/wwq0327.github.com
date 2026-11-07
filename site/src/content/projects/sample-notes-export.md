---
id: "sample-notes-export"
title: "示例项目：长文导出"
summary: "把站内长文导出为结构一致的 HTML、Markdown 与 JSON，验证同一份内容能否从三个出口读取。"
purpose: "验证“原始 HTML 可直接读、链接稳定、出口一致”这条规则在真实构建里是否成立。"
audience: "需要长期保存和引用自己文章的人；也包括未来接手这个站点的维护者。"
stage: "prototype"
limitations:
  - "目前只有合成样本，没有接入真实文章。"
  - "导出脚本尚未处理图片与脚注。"
visibility: "sample"
verification: "partial"
featured: true
links:
  - label: "示例仓库"
    url: "https://example.com/sample-notes-export"
    kind: "repo"
changes:
  - date: "2026-10-28"
    summary: "确定三种出口共用同一份内容模型，先做 Markdown 与 JSON。"
    evidenceUrl: null
dates:
  started: "2026-10-12"
  released: null
  updated: "2026-10-28"
sourceIds:
  - "sample-github"
---

## 为什么先做导出

如果站点只输出一种格式，内容就被锁在页面里。这个示例项目先把“同一份内容、多个出口”跑通，再谈样式和自动化。

## 目前做到哪一步

结构已经确定：文章元数据、正文、来源和日期都来自同一份内容文件。导出脚本读取它，生成 Markdown 与 JSON，HTML 则由站点构建直接产出。三者的标题、日期和链接必须一致。

## 还没做的

图片、脚注和代码块的语言标记还没有统一处理；这些会在接入真实文章前补齐。
