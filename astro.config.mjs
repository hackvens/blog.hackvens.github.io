// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import legacyRedirects from './src/data/redirects.json' with { type: 'json' };
import { satteri } from '@astrojs/markdown-satteri';
import demoteHeadings from './src/plugins/demote-headings.mjs';

// En CI (GitHub Pages) ces deux variables viennent de actions/configure-pages.
// En local, les valeurs par défaut suffisent.
const site = process.env.SITE_URL || 'https://hackvens.github.io';
const base = process.env.BASE_PATH || '/';
const basePrefix = base.replace(/\/$/, '');

// Anciennes URLs Jekyll (/<categorie>/<titre>.html) -> nouvelles URLs (/blog/<annee>/<slug>/)
const redirects = {
  ...Object.fromEntries(
    Object.entries(legacyRedirects).map(([from, to]) => [from, `${basePrefix}${to}`]),
  ),
  '/about.html': `${basePrefix}/about/`,
};

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  redirects,
  integrations: [sitemap()],
  markdown: {
    processor: satteri({ mdastPlugins: [demoteHeadings] }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
