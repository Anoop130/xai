// content collection schemas: bad frontmatter fails the build with a file and field level error
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// one entry per weekly program session
const sessions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sessions' }),
  schema: z.object({
    date: z.coerce.date(),
    week: z.number().int().min(1),
    year: z.number().int().min(2020),
    title: z.string(),
    presenter: z.string().optional(),
    topic: z.enum(['ai', 'ml', 'data-science', 'tooling', 'guest']),
    slidesUrl: z.string().url().optional(),
    recordingUrl: z.string().url().optional(),
    summary: z.string(),
  }),
});

// one entry per program year cohort
const cohorts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cohorts' }),
  schema: z.object({
    year: z.number().int().min(2020),
    description: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
  }),
});

// one entry per participant, keyed by cohort year
const students = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/students' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      cohortYear: z.number().int().min(2020),
      photo: image().optional(),
      school: z.string().optional(),
      major: z.string().optional(),
      bio: z.string(),
      internship: z
        .object({
          org: z.string(),
          role: z.string(),
          year: z.number().int(),
        })
        .optional(),
      capstone: z
        .object({
          title: z.string(),
          summary: z.string(),
          repoUrl: z.string().url().optional(),
        })
        .optional(),
      links: z
        .object({
          github: z.string().url().optional(),
          linkedin: z.string().url().optional(),
        })
        .optional(),
    }),
});

export const collections = { sessions, cohorts, students };
