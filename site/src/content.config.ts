import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  activitySchema,
  personSchema,
  projectSchema,
  workSchema,
} from './lib/schema';

const person = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/person' }),
  schema: personSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: projectSchema,
});

const works = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/works' }),
  schema: workSchema,
});

const activities = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/activities' }),
  schema: activitySchema,
});

export const collections = { person, projects, works, activities };
