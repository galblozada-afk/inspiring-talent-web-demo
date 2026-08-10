(() => {
  const route = document.querySelector('[data-coaching-route]');
  if (!route) return;

  const triggers = [...route.querySelectorAll('[data-coaching-route-card]')];
  const setOpen = (trigger, shouldOpen) => {
    const book = trigger.closest('.coaching-book');
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    book.classList.toggle('is-coaching-open', shouldOpen);
    trigger.setAttribute('aria-expanded', String(shouldOpen));
    if (panel) panel.hidden = !shouldOpen;
  };

  triggers.forEach(trigger => trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    triggers.forEach(item => setOpen(item, false));
    if (!isOpen) setOpen(trigger, true);
  }));

  const faqTriggers = [...route.querySelectorAll('[data-coaching-faq-trigger]')];
  const setFaqOpen = (trigger, shouldOpen) => {
    const item = trigger.closest('.coaching-faq-item');
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    item.classList.toggle('is-coaching-faq-open', shouldOpen);
    trigger.setAttribute('aria-expanded', String(shouldOpen));
    if (panel) panel.hidden = !shouldOpen;
  };

  faqTriggers.forEach(trigger => trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    faqTriggers.forEach(item => setFaqOpen(item, false));
    if (!isOpen) setFaqOpen(trigger, true);
  }));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...route.querySelectorAll('[data-coaching-reveal]')];
  if (!revealItems.length) return;
  document.body.classList.add('coaching-motion-ready');
  const reveal = item => item.classList.add('is-coaching-revealed');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(reveal);
    return;
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    reveal(entry.target);
    observer.unobserve(entry.target);
  }), { threshold: .13, rootMargin: '0px 0px -8% 0px' });
  revealItems.forEach(item => observer.observe(item));
})();
