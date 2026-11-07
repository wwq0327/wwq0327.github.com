---
id: claude-code-agent-based-on-ancient-classics-like-analects-and-tao-te-ching
title: 基于《论语》《道德经》等古籍的 Claude Code 智能体
type: article
author: wanqing
summary: 基于《论语》《道德经》等古籍的 Claude Code 智能体，让古代智慧帮你解决现代问题。
language: zh
visibility: public
featured: false
dates:
  authored: 2026-04-06
  published: 2026-04-06
  updated: null
originalUrl: https://wwq0327.github.io/2026-04-06/claude-code-agent-based-on-ancient-classics-like-analects-and-tao-te-ching/
legacyPath: /2026-04-06/claude-code-agent-based-on-ancient-classics-like-analects-and-tao-te-ching/
platform: 旧博客
topics:
  - Claude Code
  - 《论语》
  - 《道德经》
  - 古代智慧
  - AI助手
relatedProjectIds: []
sourceIds:
  - legacy-blog
media: null
---

基于《论语》《道德经》等古籍的 Claude Code 智能体，让古代智慧帮你解决现代问题。

## 包含 Skills

### lunyu（论语）

基于《论语》的古典智慧 AI 助手，帮助现代人用古代智慧解决现实问题。

**触发方式：** `/lunyu`

**三大功能：**

- **自由探索**：随机推荐论语好句
  - 输入："来点论语" / "推荐一些关于学习的"
- **主题探索**：按主题查找相关句子
  - 输入："找找论语里讲诚信的" / "关于君子和小人有哪些"
- **思考探索**：描述困惑，获得针对性的古代智慧
  - 输入："我最近总被同事误解，很烦躁"

---

### daodejing（道德经）

基于《道德经》的古典智慧 AI 助手，探讨无为而治、柔弱胜刚强。

**触发方式：** `/daodejing`

**三大功能：**

- **自由探索**：随机推荐道德经好句
  - 输入："来点道德经" / "有什么好句子"
- **主题探索**：按主题查找相关章节
  - 输入："关于不争的有哪些" / "道德经里讲水的"
- **思考探索**：描述困惑，获得针对性的道家智慧
  - 输入："我做了很多事但感觉没效果" / "我总想跟人争输赢"

---

## 安装方法

```bash
# 克隆到本地 Claude Code skills 目录
git clone https://github.com/wwq0327/classical-wisdom-skills.git ~/.claude/skills/classical-wisdom-skills
```

## 使用方式

在 Claude Code 中：

```
/lunyu       — 进入论语智慧助手
/daodejing   — 进入道德经智慧助手
```

## 数据来源

- 《论语》原文：499 条
- 《道德经》原文：81 章
- 古典原文出处：https://github.com/ahua/dataset
