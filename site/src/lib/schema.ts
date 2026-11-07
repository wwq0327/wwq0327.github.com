import { z } from 'astro/zod';

/**
 * 统一内容模型的字段定义。
 *
 * 设计原则（见 docs/网站重构方案-V1.md 第 6 节）：
 * - 公开数据（src/content/）与内部采集状态（data/internal/）分开保存，互不引用路径。
 * - 未知的日期一律允许为 null，不用文件名或“今天”补造。
 * - 公开级别与“是否已验收”分开表达：visibility 表示能不能展示，
 *   verification 表示项目或作品实际确认到哪一步。
 */

/** 稳定 ID：小写字母/数字，用连字符分词；同时作为 URL 片段。 */
export const stableId = z
  .string()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: '稳定 ID 只能使用小写字母、数字和单个连字符（如 sample-notes-export）',
  });

/** 严格的 YYYY-MM-DD；不接受 2026-02-30 这类会被 Date 自动进位的日期。 */
export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export const isoDate = z.string().refine(isIsoDate, {
  message: '日期必须是有效的 YYYY-MM-DD',
});

/** 未知或未确认的日期写 null，而不是留空字符串。 */
export const nullableIsoDate = isoDate.nullable().default(null);

export const visibilitySchema = z.enum(['public', 'sample', 'draft']);
export type Visibility = z.infer<typeof visibilitySchema>;

export const platformSchema = z.enum([
  'github',
  'weibo',
  'bilibili',
  'x',
  'youtube',
  'email',
]);

export const accountSchema = z
  .object({
    platform: platformSchema,
    label: z.string().min(1),
    url: z.string().min(1),
    handle: z.string().nullable().default(null),
  })
  .superRefine((account, ctx) => {
    if (account.platform === 'email') {
      if (!account.url.startsWith('mailto:')) {
        ctx.addIssue({
          code: 'custom',
          message: '邮箱入口的 url 必须使用 mailto: 协议',
          path: ['url'],
        });
      }
      return;
    }
    if (!/^https?:\/\//.test(account.url)) {
      ctx.addIssue({
        code: 'custom',
        message: '社交账号入口必须是 http(s) 绝对地址',
        path: ['url'],
      });
    }
  });

/** 本人资料：关于页、页脚、机器索引共用同一份。 */
export const personSchema = z.object({
  id: stableId,
  name: z.string().min(1),
  displayName: z.string().min(1),
  romanizedName: z.string().nullable().default(null),
  tagline: z.string().min(1),
  /** 名称与简介是否已经本人最终确认；draft 时页面不得当作定稿介绍。 */
  reviewStatus: z.enum(['draft', 'confirmed']).default('draft'),
  accounts: z.array(accountSchema).min(1),
  email: z.email(),
  updatedAt: isoDate,
});
export type Person = z.infer<typeof personSchema>;

export const projectStageSchema = z.enum([
  'idea',
  'prototype',
  'alpha',
  'beta',
  'released',
  'maintained',
  'paused',
  'archived',
]);
export type ProjectStage = z.infer<typeof projectStageSchema>;

export const verificationSchema = z.enum(['unverified', 'partial', 'verified']);
export type Verification = z.infer<typeof verificationSchema>;

export const linkSchema = z.object({
  label: z.string().min(1),
  url: z.url(),
  kind: z.enum(['repo', 'demo', 'download', 'article', 'other']).default('other'),
});

export const changeSchema = z.object({
  date: isoDate,
  summary: z.string().min(1),
  evidenceUrl: z.url().nullable().default(null),
});

/** 项目：先说解决什么、适合谁，再谈状态和限制。 */
export const projectSchema = z
  .object({
    id: stableId,
    title: z.string().min(1),
    summary: z.string().min(1).max(200),
    purpose: z.string().min(1),
    audience: z.string().min(1),
    stage: projectStageSchema,
    limitations: z.array(z.string().min(1)).default([]),
    visibility: visibilitySchema.default('draft'),
    verification: verificationSchema.default('unverified'),
    featured: z.boolean().default(false),
    links: z.array(linkSchema).default([]),
    /** 只记录重要变化，不搬每条 commit。 */
    changes: z.array(changeSchema).default([]),
    relatedWorkIds: z.array(stableId).default([]),
    sourceIds: z.array(stableId).default([]),
    dates: z
      .object({
        started: nullableIsoDate,
        released: nullableIsoDate,
        updated: nullableIsoDate,
      })
      .default({ started: null, released: null, updated: null }),
  })
  .superRefine((project, ctx) => {
    if (project.verification === 'verified' && project.links.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: '标记为 verified 的项目必须至少提供一个可核查入口（仓库、下载或演示）',
        path: ['links'],
      });
    }
  });
export type Project = z.infer<typeof projectSchema>;

export const workTypeSchema = z.enum(['article', 'video']);
export type WorkType = z.infer<typeof workTypeSchema>;

/**
 * 作品：文章与视频共用一个对象，一稿多平台时保留 originalUrl，
 * 平台差异放在 platform，不复制成多篇“原创”。
 */
export const workSchema = z
  .object({
    id: stableId,
    title: z.string().min(1),
    type: workTypeSchema,
    author: z.string().min(1),
    summary: z.string().min(1).max(300),
    language: z.enum(['zh', 'en']).default('zh'),
    visibility: visibilitySchema.default('draft'),
    featured: z.boolean().default(false),
    dates: z.object({
      /** 原稿日期：历史文章保持原日期，不改成本次导入日。 */
      authored: isoDate,
      /** 正式发布时间未知时留 null。 */
      published: nullableIsoDate,
      /** 实质修订时间；纯格式调整不算。 */
      updated: nullableIsoDate,
    }),
    originalUrl: z.url(),
    platform: z.string().min(1),
    topics: z.array(z.string().min(1)).default([]),
    relatedProjectIds: z.array(stableId).default([]),
    sourceIds: z.array(stableId).default([]),
    media: z
      .object({
        durationSeconds: z.number().int().positive().nullable().default(null),
        chapters: z
          .array(
            z.object({
              title: z.string().min(1),
              startSeconds: z.number().int().nonnegative(),
            }),
          )
          .default([]),
      })
      .nullable()
      .default(null),
  })
  .superRefine((work, ctx) => {
    if (work.dates.updated && work.dates.updated < work.dates.authored) {
      ctx.addIssue({
        code: 'custom',
        message: '修订日期不能早于原稿日期',
        path: ['dates', 'updated'],
      });
    }
    if (work.dates.published && work.dates.published < work.dates.authored) {
      ctx.addIssue({
        code: 'custom',
        message: '发布日期不能早于原稿日期',
        path: ['dates', 'published'],
      });
    }
    if (work.type === 'video' && work.media === null) {
      ctx.addIssue({
        code: 'custom',
        message: '视频作品必须提供 media 字段（时长和章节未知时可以留空数组/null）',
        path: ['media'],
      });
    }
  });
export type Work = z.infer<typeof workSchema>;

export const activityKindSchema = z.enum([
  'project-release',
  'project-update',
  'article-published',
  'article-updated',
  'video-published',
  'milestone',
]);
export type ActivityKind = z.infer<typeof activityKindSchema>;

/** 动态：一件已经发生、可指向证据的实质变化；不是“本周总结”占位。 */
export const activitySchema = z.object({
  id: stableId,
  occurredAt: isoDate,
  kind: activityKindSchema,
  related: z.object({
    type: z.enum(['project', 'work']),
    id: stableId,
  }),
  summary: z.string().min(1),
  evidenceUrl: z.url().nullable().default(null),
  displayed: z.boolean().default(true),
  visibility: visibilitySchema.default('draft'),
  sourceIds: z.array(stableId).default([]),
});
export type Activity = z.infer<typeof activitySchema>;

/**
 * 内部采集状态：只用于增量判断与恢复，不进入公开产物。
 * 与公开作品/项目通过 sourceIds 对应，但本文件不会被打包进站点。
 */
export const sourceSchema = z.object({
  id: stableId,
  kind: z.enum(['github', 'sourcebase', 'blog', 'manual']),
  label: z.string().min(1),
  /** 远程 URL 或本机路径；本机路径换环境后需重新核对。 */
  location: z.string().min(1),
  contentHash: z.string().nullable().default(null),
  lastCheckedAt: nullableIsoDate,
  lastSuccessAt: nullableIsoDate,
  lastFailureAt: nullableIsoDate,
  lastFailureReason: z.string().nullable().default(null),
  status: z.enum(['never', 'ok', 'failed', 'stale']).default('never'),
  notes: z.string().nullable().default(null),
});
export type Source = z.infer<typeof sourceSchema>;

export const sourcesFileSchema = z.object({
  version: z.literal(1),
  sources: z.array(sourceSchema),
});
