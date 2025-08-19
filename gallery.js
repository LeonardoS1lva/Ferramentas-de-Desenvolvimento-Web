(function () {
  const SELECTOR = '.grid-photos img';

  // Cria o overlay/lightbox
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Imagem ampliada');
  overlay.style.display = 'none';

  const backdrop = document.createElement('div');
  backdrop.className = 'lightbox-backdrop';

  const figure = document.createElement('figure');
  figure.className = 'lightbox-figure';

  const img = document.createElement('img');
  img.className = 'lightbox-image';
  img.alt = '';
  img.decoding = 'async';

  const figcap = document.createElement('figcaption');
  figcap.className = 'lightbox-caption';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Fechar');
  closeBtn.innerHTML = '&#x2715;';

  figure.appendChild(img);
  figure.appendChild(figcap);
  overlay.appendChild(backdrop);
  overlay.appendChild(figure);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  let lastActive = null;

  function openLightbox(src, alt) {
    lastActive = document.activeElement;
    img.src = src;
    img.alt = alt || '';
    figcap.textContent = alt || '';
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('open'));
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    overlay.addEventListener(
      'transitionend',
      () => {
        overlay.style.display = 'none';
        img.src = '';
      },
      { once: true }
    );
    document.removeEventListener('keydown', onKeydown);
    if (lastActive && typeof lastActive.focus === 'function') lastActive.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'Enter' && overlay.style.display !== 'none') {
      // evita scroll ao pressionar Enter em botões
      e.preventDefault();
    }
  }

  backdrop.addEventListener('click', closeLightbox);
  closeBtn.addEventListener('click', closeLightbox);

  function onThumbClick(e) {
    const target = e.target;
    if (!(target instanceof HTMLImageElement)) return;
    openLightbox(target.currentSrc || target.src, target.alt);
  }

  function onThumbKeydown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    const target = e.currentTarget;
    if (target && target.tagName === 'IMG') {
      openLightbox(target.currentSrc || target.src, target.alt);
    }
  }

  function setupThumbnails() {
    const thumbs = document.querySelectorAll(SELECTOR);
    thumbs.forEach((t) => {
      t.style.cursor = 'zoom-in';
      t.setAttribute('tabindex', '0');
      t.setAttribute('role', 'button');
      t.setAttribute('aria-label', (t.getAttribute('alt') || 'Imagem') + ' — ampliar');
      t.addEventListener('click', onThumbClick);
      t.addEventListener('keydown', onThumbKeydown);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupThumbnails);
  } else {
    setupThumbnails();
  }
})();
