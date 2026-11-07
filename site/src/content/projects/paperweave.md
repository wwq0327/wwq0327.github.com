---
id: "paperweave"
title: "拾题成卷 PaperWeave"
summary: "面向教师的本地题库桌面应用：从原卷 PDF 录题、拆题打标签，到检索选题、组卷和打印。"
purpose: "把原卷、题目整理、选题和打印放进一个本地工作流，题库与数据留在本机。"
audience: "需要长期积累题目、准备练习卷和答案卷的教师。"
stage: "prototype"
useCases: ["teaching", "productivity"]
provenance: "GitHub 公开仓库 README 与文档（2026-11-07 读取）"
limitations:
  - "方案已定，M0 开发中；当前没有可用安装包。"
  - "跨平台安装、编辑打印与 AI 输入仍在验证。"
  - "真实题库、用户原卷与 AI 密钥不进入仓库，公开仓库不能反映真实数据下的效果。"
visibility: "public"
verification: "partial"
featured: true
links:
  - label: "GitHub 仓库"
    url: "https://github.com/wwq0327/PaperWeave"
    kind: "repo"
dates:
  started: "2026-11-04"
  released: null
  updated: "2026-11-06"
sourceIds:
  - "github-paperweave"
---

## 解决什么问题

教师手里的题目常常分散在原卷 PDF、文件夹和不同的表格里。整理、选题、组卷、打印各用一套方式，换一台机器又要重新收拾。

PaperWeave 想把这些步骤放进一个本地应用：录题、拆题、打标签、检索、组卷，最后生成学生卷与教师答案卷。

## 现在是什么状态

方案已经确定，M0 开发中，重点是跨平台安装、编辑打印与 AI 输入验证。仓库里有产品需求、开发验收流程和本地跨平台技术方案，但还没有可安装的版本。

## 限制

真实题库和用户原卷不会进入公开仓库，所以仓库里的测试使用合成样卷与固定模型响应。它目前只能说明方案和开发进度，不能说明真实课堂中的使用效果。
