(() => {
  const page = document.querySelector('[data-training-page]');
  if (!page) return;

  const routeTriggers = [...page.querySelectorAll('[data-training-route-trigger]')];
  const setRouteOpen = (trigger, shouldOpen) => {
    const route = trigger.closest('.training-route');
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    route.classList.toggle('is-training-route-open', shouldOpen);
    trigger.setAttribute('aria-expanded', String(shouldOpen));
    if (!panel) return;
    if (shouldOpen) {
      panel.hidden = false;
      window.requestAnimationFrame(() => panel.classList.add('is-training-route-panel-open'));
      return;
    }
    panel.classList.remove('is-training-route-panel-open');
    window.setTimeout(() => {
      if (!route.classList.contains('is-training-route-open')) panel.hidden = true;
    }, 480);
  };
  routeTriggers.forEach(trigger => {
    if (trigger.getAttribute('aria-expanded') === 'true') {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (panel) panel.classList.add('is-training-route-panel-open');
    }
  });
  routeTriggers.forEach(trigger => trigger.addEventListener('click', () => {
    const shouldOpen = trigger.getAttribute('aria-expanded') !== 'true';
    routeTriggers.forEach(item => setRouteOpen(item, false));
    if (shouldOpen) setRouteOpen(trigger, true);
  }));

  const transferRail = page.querySelector('.training-transfer-rail');
  const transferSteps = [...page.querySelectorAll('[data-training-transfer-step]')];
  if (transferRail && transferSteps.length) {
    const setRoadmapProgress = progress => {
      const normalized = Math.max(0, Math.min(1, progress));
      const activeIndex = Math.round(normalized * (transferSteps.length - 1));
      transferRail.style.setProperty('--training-roadmap-progress', normalized.toFixed(3));
      transferSteps.forEach((step, index) => {
        const active = index === activeIndex;
        step.setAttribute('aria-pressed', String(active));
        step.closest('li').classList.toggle('is-training-transfer-active', index <= activeIndex);
      });
    };
    const progressFromPointer = event => {
      const bounds = transferRail.getBoundingClientRect();
      const horizontal = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      return Math.max(0, Math.min(1, (horizontal - .125) / .75));
    };
    transferRail.addEventListener('pointermove', event => setRoadmapProgress(progressFromPointer(event)));
    transferSteps.forEach((step, index) => {
      step.addEventListener('click', () => setRoadmapProgress(index / (transferSteps.length - 1)));
      step.addEventListener('keydown', event => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const nextIndex = Math.max(0, Math.min(transferSteps.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)));
        transferSteps[nextIndex].focus();
        setRoadmapProgress(nextIndex / (transferSteps.length - 1));
      });
    });
    setRoadmapProgress(0);
  }

  const items = [...page.querySelectorAll('[data-training-reveal]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = item => item.classList.add('is-training-revealed');
  if (reducedMotion || !('IntersectionObserver' in window)) return items.forEach(reveal);
  document.body.classList.add('training-motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    reveal(entry.target);
    observer.unobserve(entry.target);
  }), { threshold: .12, rootMargin: '0px 0px -7% 0px' });
  items.forEach(item => observer.observe(item));
})();
