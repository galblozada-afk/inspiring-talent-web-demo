(() => {
  const page = document.querySelector('[data-evaluation-page]');
  if (!page) return;

  const tools = [...page.querySelectorAll('[data-evaluation-tool]')];
  const detail = page.querySelector('[data-evaluation-tool-detail]');
  const content = {
    disc: { title: 'DISC', text: 'Hace visibles preferencias de comportamiento y comunicación para que personas y equipos puedan coordinarse mejor.', focus: 'Estilo de comunicación, toma de decisiones y colaboración.', conversation: 'Cómo adaptar la forma de trabajar con otras personas sin perder autenticidad.' },
    eq: { title: 'Inteligencia emocional', text: 'Aporta un punto de partida para reconocer la conciencia emocional y la forma de responder ante presión y relaciones exigentes.', focus: 'Autoconciencia, autorregulación, empatía y habilidades relacionales.', conversation: 'Qué prácticas ayudan a responder con mayor intención en situaciones de presión.' },
    alignment: { title: 'Talent Alignment', text: 'Conecta capacidades, expectativas y necesidades del rol para orientar conversaciones de desempeño y desarrollo.', focus: 'Fortalezas aplicadas, necesidades del puesto y oportunidades de crecimiento.', conversation: 'Qué ajustar para que las capacidades de la persona se expresen mejor en su rol.' },
    axes: { title: 'AXES 360', text: 'Integra perspectivas de colaboradores, pares y líderes para observar patrones y acordar prioridades de desarrollo.', focus: 'Conductas observables, impacto en otros y prioridades compartidas.', conversation: 'Qué sostener, qué ajustar y cómo dar seguimiento con el equipo.' }
  };
  const updateTool = key => {
    const item = content[key];
    if (!item || !detail) return;
    tools.forEach(tool => { const active = tool.dataset.evaluationTool === key; tool.classList.toggle('is-evaluation-tool-active', active); tool.setAttribute('aria-selected', String(active)); });
    detail.querySelector('[data-evaluation-detail-title]').textContent = item.title;
    detail.querySelector('[data-evaluation-detail-text]').textContent = item.text;
    detail.querySelector('[data-evaluation-detail-focus]').textContent = item.focus;
    detail.querySelector('[data-evaluation-detail-conversation]').textContent = item.conversation;
    detail.dataset.evaluationToolActive = key;
    detail.classList.remove('is-evaluation-detail-switching');
    void detail.offsetWidth;
    detail.classList.add('is-evaluation-detail-switching');
  };
  tools.forEach((tool, index) => { tool.addEventListener('click', () => updateTool(tool.dataset.evaluationTool)); tool.addEventListener('keydown', event => { if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return; event.preventDefault(); const next = (index + (event.key === 'ArrowRight' ? 1 : tools.length - 1)) % tools.length; tools[next].focus(); updateTool(tools[next].dataset.evaluationTool); }); });

  const revealItems = [...page.querySelectorAll('[data-evaluation-reveal]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = item => item.classList.add('is-evaluation-revealed');
  if (reduced || !('IntersectionObserver' in window)) { revealItems.forEach(reveal); return; }
  document.body.classList.add('evaluation-motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; reveal(entry.target); observer.unobserve(entry.target); }), { threshold: .14, rootMargin: '0px 0px -8% 0px' });
  revealItems.forEach(item => observer.observe(item));
})();
