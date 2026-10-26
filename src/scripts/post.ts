// Petites améliorations de confort sur la page d'un article. Rien n'est indispensable à la lecture.

const prose = document.querySelector<HTMLElement>('.prose');

/* ---------- Bouton « copier » sur les blocs de code ---------- */
prose?.querySelectorAll<HTMLPreElement>('pre').forEach((pre) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'codeblock';
  pre.replaceWith(wrapper);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy';
  button.textContent = 'copier';
  button.setAttribute('aria-label', 'Copier le code');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.textContent ?? '');
      button.textContent = 'copié';
    } catch {
      button.textContent = 'échec';
    }
    setTimeout(() => (button.textContent = 'copier'), 1500);
  });

  wrapper.append(pre, button);
});

/* ---------- Agrandissement des captures d'écran ---------- */
if (prose) {
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Image agrandie');
  const full = document.createElement('img');
  dialog.append(full);
  dialog.addEventListener('click', () => dialog.close());
  document.body.append(dialog);

  const open = (img: HTMLImageElement) => {
    full.src = img.currentSrc || img.src;
    full.alt = img.alt;
    dialog.showModal();
  };

  const markZoomable = (img: HTMLImageElement) => {
    // Seulement si l'image est affichée plus petite que sa taille réelle (et n'est pas une icône).
    if (img.clientHeight < 60 || img.naturalWidth <= img.clientWidth + 8) return;
    img.classList.add('zoomable');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `Agrandir l'image${img.alt ? ` : ${img.alt}` : ''}`);
  };

  prose.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
    if (img.complete) markZoomable(img);
    else img.addEventListener('load', () => markZoomable(img), { once: true });
  });

  prose.addEventListener('click', (event) => {
    const img = (event.target as HTMLElement).closest('img');
    if (img?.classList.contains('zoomable')) open(img);
  });
  prose.addEventListener('keydown', (event) => {
    const img = (event.target as HTMLElement).closest('img');
    if (img?.classList.contains('zoomable') && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      open(img);
    }
  });
}

/* ---------- Surlignage de la section courante dans le sommaire ---------- */
const links = new Map<string, HTMLAnchorElement>();
document.querySelectorAll<HTMLAnchorElement>('.toc a').forEach((a) => {
  links.set(decodeURIComponent(a.hash.slice(1)), a);
});

if (links.size && 'IntersectionObserver' in window) {
  const targets = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  const setCurrent = (id: string) => {
    links.forEach((a, key) => {
      if (key === id) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      // Le premier titre visible dans la moitié haute de l'écran est la « section courante ».
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setCurrent(visible[0].target.id);
    },
    { rootMargin: '0px 0px -60% 0px' },
  );
  targets.forEach((el) => observer.observe(el));
}
