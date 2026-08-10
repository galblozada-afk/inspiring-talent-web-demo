(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const search = document.querySelector('[data-blog-search]');
  const filters = Array.from(document.querySelectorAll('[data-blog-filter]'));
  const cards = Array.from(document.querySelectorAll('[data-blog-card]'));
  const results = document.querySelector('[data-blog-results]');
  let activeFilter = 'all';

  function applyFilters() {
    const query = (search?.value || '').trim().toLowerCase();
    let count = 0;
    cards.forEach(card => {
      const hasBadge = activeFilter === 'all' || card.dataset.blogBadges.split(' ').includes(activeFilter);
      const matchesSearch = !query || card.dataset.blogSearchable.includes(query);
      const visible = hasBadge && matchesSearch;
      card.hidden = !visible;
      if (visible) count += 1;
    });
    if (results) results.textContent = `${count} ${count === 1 ? 'artículo disponible' : 'artículos disponibles'}`;
  }

  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.blogFilter;
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    applyFilters();
  }));
  search?.addEventListener('input', applyFilters);

  document.querySelectorAll('[data-blog-gallery]').forEach(gallery => {
    const slides = Array.from(gallery.querySelectorAll('[data-blog-gallery-slide]'));
    const dots = Array.from(gallery.querySelectorAll('[data-blog-gallery-dot]'));
    const caption = gallery.querySelector('[data-blog-gallery-caption]');
    let current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => { slide.hidden = slideIndex !== current; });
      dots.forEach((dot, dotIndex) => dot.setAttribute('aria-pressed', String(dotIndex === current)));
      if (caption) caption.textContent = slides[current].alt || `Imagen ${current + 1} de la galería`;
      if (!reduceMotion) gallery.classList.remove('is-switching'), requestAnimationFrame(() => gallery.classList.add('is-switching'));
    }
    gallery.querySelector('[data-blog-gallery-prev]')?.addEventListener('click', () => show(current - 1));
    gallery.querySelector('[data-blog-gallery-next]')?.addEventListener('click', () => show(current + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => show(index)));
    gallery.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });
  });
})();
