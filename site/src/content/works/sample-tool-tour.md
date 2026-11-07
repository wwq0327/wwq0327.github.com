---
id: "sample-tool-tour"
title: "示例视频：一条视频看懂内容结构"
type: "video"
author: "王老师"
summary: "用一条合成视频验证视频目录、时长与章节字段，不对应真实发布内容。"
language: "zh"
visibility: "sample"
featured: false
dates:
  authored: "2026-10-30"
  published: "2026-11-01"
  updated: null
originalUrl: "https://example.com/videos/tool-tour"
platform: "示例视频站"
topics:
  - "演示"
  - "结构"
relatedProjectIds:
  - "sample-notes-export"
sourceIds:
  - "sample-github"
media:
  durationSeconds: 754
  chapters:
    - title: "为什么要统一内容模型"
      startSeconds: 0
    - title: "三个出口分别是什么"
      startSeconds: 186
    - title: "还没做的部分"
      startSeconds: 512
---

> 这是合成视频条目，没有真实视频文件。页面上的媒体与章节信息只用于验证目录与详情结构。

这条示例视频用来检查：视频是否和文章共用一套日期、来源与可见性字段，是否能在目录页显示时长和章节，而不是另建一套内容。

## 视频与文章的共同点

两者都是“作品”：有作者、有原稿日期、有首次发布时间、有来源链接。区别只在媒体字段和展示方式。

## 视频特有的地方

时长与章节是视频才需要的字段；章节起点按秒记录，避免不同平台的时间格式不一致。
