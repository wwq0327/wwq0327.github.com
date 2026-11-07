import assert from 'node:assert/strict';
import test from 'node:test';
import {
  accountSchema,
  activitySchema,
  isIsoDate,
  projectSchema,
  workSchema,
} from '../src/lib/schema';

const baseWork = {
  id: 'demo-work',
  title: '示例标题',
  type: 'article' as const,
  author: '作者',
  summary: '一句摘要',
  dates: { authored: '2026-01-02' },
  originalUrl: 'https://example.com/a',
  platform: '示例平台',
};

const baseProject = {
  id: 'demo-project',
  title: '示例项目',
  summary: '一句摘要',
  purpose: '解决一个具体问题',
  audience: '需要它的人',
  stage: 'prototype' as const,
};

test('isIsoDate 只接受真实存在的日期', () => {
  assert.equal(isIsoDate('2024-02-29'), true);
  assert.equal(isIsoDate('2026-02-30'), false);
  assert.equal(isIsoDate('2026-13-01'), false);
  assert.equal(isIsoDate('2026-1-1'), false);
  assert.equal(isIsoDate(''), false);
});

test('未知日期用 null，而不是空字符串或导入日', () => {
  const parsed = workSchema.parse(baseWork);
  assert.equal(parsed.dates.published, null);
  assert.equal(parsed.dates.updated, null);
  assert.equal(parsed.visibility, 'draft');
});

test('视频作品必须提供 media', () => {
  const result = workSchema.safeParse({ ...baseWork, type: 'video' });
  assert.equal(result.success, false);

  const withMedia = workSchema.safeParse({
    ...baseWork,
    type: 'video',
    media: { durationSeconds: 120, chapters: [] },
  });
  assert.equal(withMedia.success, true);
});

test('修订日期不能早于原稿日期', () => {
  const result = workSchema.safeParse({
    ...baseWork,
    dates: { authored: '2026-03-01', published: null, updated: '2026-02-01' },
  });
  assert.equal(result.success, false);
});

test('标记 verified 的项目必须有可核查入口', () => {
  const withoutLinks = projectSchema.safeParse({
    ...baseProject,
    verification: 'verified',
    links: [],
  });
  assert.equal(withoutLinks.success, false);

  const withLink = projectSchema.safeParse({
    ...baseProject,
    verification: 'verified',
    links: [{ label: '仓库', url: 'https://example.com/repo', kind: 'repo' }],
  });
  assert.equal(withLink.success, true);
});

test('邮箱入口必须使用 mailto', () => {
  assert.equal(
    accountSchema.safeParse({
      platform: 'email',
      label: '邮箱',
      url: 'https://example.com',
    }).success,
    false,
  );
  assert.equal(
    accountSchema.safeParse({
      platform: 'email',
      label: '邮箱',
      url: 'mailto:someone@example.com',
    }).success,
    true,
  );
});

test('动态必须指向一个项目或作品', () => {
  const result = activitySchema.safeParse({
    id: 'demo-activity',
    occurredAt: '2026-01-03',
    kind: 'article-published',
    related: { type: 'work', id: 'demo-work' },
    summary: '发布了一篇文章',
  });
  if (!result.success) {
    assert.fail('示例动态应当通过校验');
  }
  assert.equal(result.data.displayed, true);
  assert.equal(result.data.visibility, 'draft');
});

test('未知公开级别会被拒绝', () => {
  const result = workSchema.safeParse({ ...baseWork, visibility: 'private' });
  assert.equal(result.success, false);
});
