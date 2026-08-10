document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('.solutions-page');
  if (!page) return;

  const tabs = Array.from(page.querySelectorAll('[data-solutions-tab]'));
  const panels = Array.from(page.querySelectorAll('[data-solutions-panel]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activePanel = panels.find(panel => !panel.hidden) || panels[0];
  let transitionTimer;

  const selectTab = key => {
    tabs.forEach(tab => {
      const active = tab.dataset.solutionsTab === key;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    const nextPanel = panels.find(panel => panel.dataset.solutionsPanel === key);
    if (!nextPanel || nextPanel === activePanel) return;

    window.clearTimeout(transitionTimer);
    const revealNext = () => {
      nextPanel.hidden = false;
      nextPanel.classList.remove('is-leaving');
      requestAnimationFrame(() => nextPanel.classList.add('is-active'));
      activePanel = nextPanel;
    };

    if (reduceMotion || !activePanel) {
      if (activePanel) {
        activePanel.hidden = true;
        activePanel.classList.remove('is-active');
      }
      revealNext();
      return;
    }

    activePanel.classList.remove('is-active');
    activePanel.classList.add('is-leaving');
    transitionTimer = window.setTimeout(() => {
      activePanel.hidden = true;
      activePanel.classList.remove('is-leaving');
      revealNext();
    }, 220);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.solutionsTab));
    tab.addEventListener('keydown', event => {
      const last = tabs.length - 1;
      let next = index;
      if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
      if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = last;
      if (next === index && !['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      tabs[next].focus();
      selectTab(tabs[next].dataset.solutionsTab);
    });
  });

  const journey = page.querySelector('.solutions-journey-visual');
  const journeySteps = Array.from(page.querySelectorAll('[data-solutions-journey-step]'));
  const setJourneyProgress = step => {
    if (!journey) return;
    journey.style.setProperty('--solutions-journey-progress', `${step.dataset.solutionsJourneyStep}%`);
    journeySteps.forEach(item => item.classList.toggle('is-active', Number(item.dataset.solutionsJourneyStep) <= Number(step.dataset.solutionsJourneyStep)));
  };

  journeySteps.forEach(step => {
    step.addEventListener('pointerenter', () => setJourneyProgress(step));
    step.addEventListener('focus', () => setJourneyProgress(step));
    step.addEventListener('click', () => setJourneyProgress(step));
  });
  if (journeySteps[0]) setJourneyProgress(journeySteps[0]);

  const revealed = page.querySelectorAll('[data-solutions-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealed.forEach(item => item.classList.add('is-solutions-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-solutions-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  revealed.forEach(item => observer.observe(item));
});
