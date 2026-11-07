import type { APIRoute } from 'astro';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  absoluteUrl,
  absolutize,
  getPublicBundle,
} from '../../lib/machine';
import { projectPath, workPath } from '../../lib/content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const bundle = await getPublicBundle();

  const payload = {
    site: {
      name: SITE_NAME,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: `${SITE_URL}/`,
      lastUpdated: bundle.lastUpdated,
      language: 'zh-CN',
      license: '文字与图片未经说明均为 wanqing 所有；引用请注明来源。',
    },
    person: {
      id: bundle.person.data.id,
      name: bundle.person.data.name,
      displayName: bundle.person.data.displayName,
      tagline: bundle.person.data.tagline,
      reviewStatus: bundle.person.data.reviewStatus,
      email: bundle.person.data.email,
      accounts: bundle.person.data.accounts,
      bioMarkdown: bundle.person.body ?? '',
      url: `${SITE_URL}/about/`,
    },
    projects: bundle.projects.map((project) => ({
      id: project.data.id,
      title: project.data.title,
      summary: project.data.summary,
      purpose: project.data.purpose,
      audience: project.data.audience,
      stage: project.data.stage,
      verification: project.data.verification,
      useCases: project.data.useCases,
      provenance: project.data.provenance,
      limitations: project.data.limitations,
      links: project.data.links,
      changes: project.data.changes,
      dates: project.data.dates,
      bodyMarkdown: absolutize(project.body ?? ''),
      url: absoluteUrl(projectPath(project)),
    })),
    works: bundle.works.map((work) => ({
      id: work.data.id,
      title: work.data.title,
      type: work.data.type,
      summary: work.data.summary,
      topics: work.data.topics,
      dates: work.data.dates,
      media: work.data.media,
      bodyMarkdown: absolutize(work.body ?? ''),
      url: absoluteUrl(workPath(work)),
    })),
    activities: bundle.activities.map((activity) => ({
      id: activity.data.id,
      occurredAt: activity.data.occurredAt,
      kind: activity.data.kind,
      summary: activity.data.summary,
      related: activity.data.related,
      evidenceUrl: activity.data.evidenceUrl,
    })),
    machineReadable: {
      index: `${SITE_URL}/llms.txt`,
      fullText: `${SITE_URL}/llms-full.txt`,
      prompt: `${SITE_URL}/ai/`,
    },
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
