---
id: "live-deck"
title: "Live Deck：边讲边长的幻灯片"
summary: "本地流式转写、小模型实时导演与模板渲染，让幻灯片随着讲话一页页长出来。"
purpose: "把“先做 PPT 再讲”的顺序反过来：你先讲，画面跟着讲的内容出现和改写。"
audience: "做口播、直播、内训，或不希望提前花几个小时排版的人。"
stage: "prototype"
useCases: ["productivity", "teaching"]
provenance: "GitHub 公开仓库 README 与代码（2026-11-07 读取）"
limitations:
  - "需要本地 Python 环境和语音模型，不是双击即用的应用。"
  - "没有安装包、在线演示或 Release，只在本地通过 node server.mjs 运行。"
  - "实时效果依赖机器性能；尚未做不同机器上的延迟对比。"
visibility: "public"
verification: "partial"
featured: true
links:
  - label: "GitHub 仓库"
    url: "https://github.com/wwq0327/live-deck"
    kind: "repo"
dates:
  started: "2026-11-06"
  released: null
  updated: "2026-11-06"
sourceIds:
  - "github-live-deck"
---

## 解决什么问题

做口播、直播或内训时，内容往往是讲出来的，画面却是事先排好的。要么提前花三四个小时做 PPT，要么边讲边翻一堆对不上的页。

Live Deck 把顺序反过来：讲话先发生，幻灯片跟着长出来。同一句话内的更新在原页上改写，不会因为说错或绕回去就突然跳走。

## 现在是什么状态

仓库公开，README 记录了本地运行方式：拉下代码后执行 `node server.mjs`，打开本机地址。它还是原型，没有安装包，也没有对外演示。

## 限制

需要本地 Python 环境和模型，运行门槛高于普通桌面应用。实时转写与画面更新的延迟取决于机器性能，目前没有跨机器的对比数据。
