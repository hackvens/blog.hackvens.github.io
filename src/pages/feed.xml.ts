import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SECTIONS, SITE, excerpt, getPosts, postUrl } from '../lib/posts';

// Même adresse que l'ancien flux jekyll-feed (/feed.xml) pour ne pas casser les abonnements.
export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${SITE.title} · ${SITE.tagline}`,
    description: SITE.description,
    site: context.site!,
    customData: '<language>fr</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? excerpt(post.body),
      link: postUrl(post),
      categories: [SECTIONS[post.data.section].label, ...(post.data.event ? [post.data.event] : [])],
    })),
  });
}
