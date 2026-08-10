(() => {
  const elements = document.querySelectorAll('[data-page-scroll]');
  if (!elements.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = element => element.classList.add('is-page-scroll-visible');
  if (reduceMotion || !('IntersectionObserver' in window)) { elements.forEach(reveal); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    reveal(entry.target);
    observer.unobserve(entry.target);
  }), { threshold: .14, rootMargin: '0px 0px -7% 0px' });
  elements.forEach(element => observer.observe(element));
})();
