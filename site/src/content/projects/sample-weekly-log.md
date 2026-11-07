---
id: "sample-weekly-log"
title: "示例项目：每周记录"
summary: "把一周内实际发生的变化整理成可核查的短记录，失败与没变化也照实写。"
purpose: "避免把“这周很忙”写成“这周完成了很多”，让更新记录能对上具体日期和证据。"
audience: "希望长期维护个人站点、又不想每周从零回忆的人。"
stage: "prototype"
limitations:
  - "调度尚未接入，目前靠手动触发。"
  - "“无变化”与“采集失败”的区分只在字段层面成立，还没有真实运行记录。"
visibility: "sample"
verification: "partial"
featured: true
links:
  - label: "示例说明"
    url: "https://example.com/sample-weekly-log"
    kind: "article"
changes:
  - date: "2026-09-30"
    summary: "把记录拆成扫描、判断、验证、发布四段，发布失败时保留上一版。"
    evidenceUrl: null
dates:
  started: "2026-09-18"
  released: null
  updated: "2026-09-30"
sourceIds:
  - "sample-github"
---

## 记录什么

每条记录回答四个问题：什么时候发生的、改变了什么、在哪里能看到、有没有验证过。没有发生实质变化的一周，就写“无变化”，不硬凑内容。

## 和自动化的关系

自动采集只负责发现候选变化；是否公开、是否值得推送，仍然要过公开规则。这个示例项目先固定字段和失败处理，不把调度当成已经完成。
