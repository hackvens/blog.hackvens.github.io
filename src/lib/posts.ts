import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;
export type Section = Post['data']['section'];

export const SITE = {
  title: 'Blog Hackvens',
  tagline: 'CTF, Research & Advisories',
  description: 'Articles, advisories et writeups de l’équipe Audit & Offensive Security Advens.',
  github: 'https://github.com/hackvens',
  twitter: 'https://twitter.com/hackvens',
};

export const SECTIONS: Record<Section, { label: string; blurb: string }> = {
  advisories: { label: 'Advisories', blurb: 'Vulnérabilités découvertes par nos équipes' },
  articles: { label: 'Articles', blurb: 'Outils, découvertes et conférences' },
  writeups: { label: 'Writeups', blurb: 'Writeups des différents CTF' },
};

/** Préfixe l'URL avec le `base` d'Astro (utile si le site n'est pas servi à la racine). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export const postUrl = (post: Post) => withBase(`/blog/${post.id}/`);

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.data.title.localeCompare(b.data.title),
  );
}

/** Les dates sont des jours calendaires : on formate en UTC pour éviter tout décalage. */
export function formatDate(date: Date, style: 'long' | 'iso' = 'long'): string {
  if (style === 'iso') return date.toISOString().slice(0, 10);
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

export function readingTime(body = ''): number {
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Premier vrai paragraphe de l'article, nettoyé du markdown (pour <meta description> et RSS). */
export function excerpt(body = '', max = 170): string {
  const blocks = body.replace(/```[\s\S]*?```/g, '').split(/\n\s*\n/);
  for (const raw of blocks) {
    const block = raw.trim();
    if (!block || /^(#|\||>|<|!\[|\[\*{0,2}\d|-{3,}|\{:)/.test(block)) continue;
    const text = block
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/[*_`>#]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length < 60) continue;
    if (text.length <= max) return text;
    return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;
  }
  return SITE.description;
}

/** Writeups regroupés par évènement, évènement le plus récent en premier. */
export function groupByEvent(posts: Post[]): { event: string; posts: Post[] }[] {
  const groups = new Map<string, Post[]>();
  for (const post of posts) {
    const key = post.data.event ?? 'Autres';
    groups.set(key, [...(groups.get(key) ?? []), post]);
  }
  return [...groups.entries()]
    .map(([event, list]) => ({ event, posts: list }))
    .sort((a, b) => b.posts[0].data.date.valueOf() - a.posts[0].data.date.valueOf());
}
