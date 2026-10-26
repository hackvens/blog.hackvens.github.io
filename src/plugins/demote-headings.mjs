// Le titre de l'article est déjà le <h1> de la page. Si le markdown contient lui-même
// des "# Titre", on décale tous les niveaux d'un cran (h1 -> h2, h2 -> h3…) pour garder
// un seul <h1> par page. Les articles qui commencent à "##" ne sont pas touchés.
// Plugin Sätteri (niveau mdast) : les ids et le sommaire sont donc calculés après coup.
export default {
  name: 'demote-headings',
  before(root, ctx) {
    ctx.data.demoteHeadings = root.children.some((n) => n.type === 'heading' && n.depth === 1);
  },
  heading(node, ctx) {
    if (ctx.data.demoteHeadings) ctx.setProperty(node, 'depth', Math.min(6, node.depth + 1));
  },
};
