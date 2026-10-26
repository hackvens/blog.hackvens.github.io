import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// src/content/blog/<année>/<article>/article.md  (+ img/ à côté)
// L'identifiant d'une entrée est "<année>/<article>" ; il sert aussi d'URL : /blog/<année>/<article>/
const blog = defineCollection({
  loader: glob({
    pattern: '*/*/article.md',
    base: './src/content/blog',
    generateId: ({ entry }) => entry.replace(/\/article\.md$/, ''),
  }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      section: z.enum(['advisories', 'articles', 'writeups']),
      // Nom du CTF / de l'évènement, pour les writeups ("StHack 2022"…)
      event: z.string().optional(),
      // Facultatif : sinon un extrait est généré depuis le premier paragraphe
      description: z.string().optional(),
      lang: z.string().default('fr'),
      draft: z.boolean().default(false),
    })
    .refine((d) => d.section !== 'writeups' || d.event, {
      message: 'Un writeup doit avoir un champ "event"',
      path: ['event'],
    }),
});

export const collections = { blog };
