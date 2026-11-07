# CLAUDE.md

## Current handoff (2026-11-07)

Read [AGENTS.md](AGENTS.md) and [docs/README.md](docs/README.md) before working. The new Astro site is live (#2–#5): `https://wanqing.wang/` serves `site/dist` from `master`, with 154 articles and three real projects. The old Hexo site is no longer public; its source and the previous `master` backup tag remain. Collection, scheduling, and email are still not connected. These documents define the selected design, sources, public-content rules, future update workflow, and actual incomplete state. The legacy commands below are background: `npm run deploy` does **not** build first, and the current `.gitignore` has `.public/`, not `public/`. Inspect current files before relying on those older descriptions.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

The live site is the Astro app in `site/`, published from the root of the `master` branch to `https://wanqing.wang/`. The old Hexo blog in `source/` and `themes/` is retained as an archive only; it is no longer the production site.

## Common Commands

New site:

```bash
cd site
npm run build    # astro check && astro build → site/dist
npm run preview  # preview the built site
```

**Do not run the legacy root `npm run deploy` / `hexo deploy`** — it would rebuild the old Hexo site and push it to `master`, overwriting the live new site. The legacy `npm run build`, `npm run clean` and `npm run server` only apply to the archived Hexo tree.

## Architecture

- **Live source**: `site/src/` — Astro pages, layouts, components, content collections, styles.
- **Live output**: `site/dist/` — 173 static pages, published from the root of `master`.
- **Deployment**: Manual build, then copy `site/dist` to `master`; GitHub Pages serves `wanqing.wang`. `CNAME` and `.nojekyll` live in `site/public/`.
- **Legacy Hexo archive**: `source/_posts/`, `themes/zenmind/`, `_config.yml`, root `package.json`; retained for reference and old-source history, not served.

## Legacy Hexo

- Posts: `source/_posts/{year}-{month}-{day}-{title}.md`
- Theme: `zenmind` (custom theme at `themes/zenmind/`)
- Old URL pattern: `/{year}-{month}-{day}/{title}/` (the Astro site preserves these paths)
- `hexo-generator-feed` and `hexo-generator-tag` belonged to the retired Hexo build.
