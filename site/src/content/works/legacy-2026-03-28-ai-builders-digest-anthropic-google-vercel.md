---
id: ai-builders-digest-anthropic-google-vercel
title: AI Builders 速递：Anthropic 限制调整、Google Gemini 升级、Vercel 发布 Sandbox
type: article
author: wanqing
summary: 过去 24 小时 AI 圈重要动态：Anthropic 调整 Claude Session 限制、Google Gemini 重大升级、Vercel Agent 持久化方案、以及 Andrej Karpathy 关于 DevOps 的深刻…
language: zh
visibility: public
featured: false
dates:
  authored: 2026-03-28
  published: 2026-03-28
  updated: null
originalUrl: https://wwq0327.github.io/2026-03-28/ai-builders-digest-anthropic-google-vercel/
legacyPath: /2026-03-28/ai-builders-digest-anthropic-google-vercel/
platform: 本站
topics:
  - AI
  - Builders
  - Anthropic
  - Gemini
  - 技术动态
relatedProjectIds: []
sourceIds:
  - legacy-blog
media: null
---

过去 24 小时，AI 圈子里最值得关注的声音来自一线建设者。

**Andrej Karpathy：DevOps 才是 AI Agent 的真正难题**

前 Tesla AI 总监、OpenAI 创始成员 Andrej Karpathy 分享了一个深刻观察。他在一年前构建 menugen 时意识到，最难的部分从来不是代码本身，而是把各种服务像 IKEA 家具一样组装起来的 DevOps 工作：支付、认证、数据库、安全、域名等等。他期待有一天只需对 AI agent 说"帮我构建 menugen"，它就能完成从阅读文档、获取 API key、调试到部署上线的全部工作。这才是真正的难点——DevOps 生命周期必须变成代码本身。

**Thariq（Anthropic Claude Code 团队）：Claude Session 限制调整**

Anthropic 宣布调整 Claude 的 5 小时 session 限制：周总量不变，但在工作日太平洋时间 5am-11am（即北京时间 1pm-7pm）的高峰时段，用户会更快耗尽 session 限制。约 7% 的用户会受到影响，尤其是 Pro 和 Max 层级。建议将 token 密集型后台任务移到非高峰时段。

**Josh Woodward（Google Labs VP）：Gemini 重大更新**

Gemini 推出两大更新：支持从其他 Chatbot 直接导入记忆和聊天记录；Gemini Live 获得迄今为止最大升级——响应更快、更智能、情商更高、语言范围更广、上下文长度翻倍至 2x，由 Gemini 3.1 Flash 驱动。

**Guillermo Rauch（Vercel CEO）：Agent 需要持久化**

关于 Agent 的基础设施思考："Agent 需要计算机。如果一台计算机没有持久化能力，它就不是一台好计算机。Vercel Sandbox 解决了这个问题：给它们命名，剩下的交给我们。"

**Amanda Askell（Anthropic）：远程工作的悖论**

Anthropic 哲学与伦理学家分享了一个反直觉的观察："也许向远程工作的转变实际上让那些不喜欢在家工作的人处境更糟，因为现在在家工作已经被默认假定为一种可行的替代方案。"

---

Generated through the Follow Builders skill: https://github.com/zarazhangrui/follow-builders
