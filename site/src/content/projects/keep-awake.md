---
id: "keep-awake"
title: "Keep Awake"
summary: "macOS 菜单栏的小工具：让 Mac 在长任务期间保持唤醒，同时仍可锁屏、熄屏。"
purpose: "下载、渲染、编译、跑模型这类长任务，不该因为人离开一会儿就被系统闲置睡眠打断。"
audience: "需要让 Mac 长时间保持运行，又不想改系统电源设置的人。"
stage: "released"
useCases: ["productivity"]
provenance: "GitHub 公开仓库与 v1.2.0 Release 说明（2026-11-07 读取）"
limitations:
  - "仅提供 Apple Silicon 版本，要求 macOS 13 或更高。"
  - "使用临时签名，未经 Apple 开发者签名与公证；首次打开可能需要在“系统设置 → 隐私与安全性”中放行。"
  - "手动睡眠、合盖、低电量等强制睡眠条件仍会让 Mac 睡眠。"
  - "没有对 CPU、电池节省幅度或过夜锁屏作新的验证结论。"
visibility: "public"
verification: "verified"
featured: true
links:
  - label: "GitHub 仓库"
    url: "https://github.com/wwq0327/keep-awake"
    kind: "repo"
  - label: "下载 v1.2.0（Apple Silicon）"
    url: "https://github.com/wwq0327/keep-awake/releases/tag/v1.2.0"
    kind: "download"
changes:
  - date: "2026-11-06"
    summary: "v1.2.0 发布：修复异常统计值，增加快捷键冲突后的重试，减少闲置状态查询。"
    evidenceUrl: "https://github.com/wwq0327/keep-awake/releases/tag/v1.2.0"
dates:
  started: "2026-11-06"
  released: "2026-11-06"
  updated: "2026-11-06"
sourceIds:
  - "github-keep-awake"
---

## 解决什么问题

长任务跑到一半，人离开电脑，系统按闲置时间进入睡眠，任务就停在半路。改系统电源设置能解决，但会一直生效，也容易忘记改回来。

Keep Awake 把这件事收进菜单栏：需要时打开，结束后关掉，锁屏和熄屏仍然照常。

## 现在是什么状态

v1.2.0 已发布，提供 Apple Silicon 版本下载。Release 说明记录了 25 项回归测试、快捷键冲突检测与恢复、代码签名、arm64 架构和 macOS 13 部署目标等验证结果。

## 限制

它只处理“闲置睡眠”这一种情况。手动睡眠、合盖、低电量仍会按系统规则生效。应用没有做 Apple 开发者签名与公证，首次打开可能需要手动放行。
