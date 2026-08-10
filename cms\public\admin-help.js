(() => {
  const dialog = document.querySelector('[data-admin-tour]');
  if (!dialog) return;
  const steps = [
    ['Todo se edita con campos sencillos', 'Escribe como lo harías en un documento. No pegues código ni etiquetas HTML.'],
    ['Publica cuando estés listo', 'Guarda primero como borrador. Cuando revises todo, cambia el estado a “Publicado”.'],
    ['Páginas extra para campañas y eventos', 'Crea una página desde plantillas y elige si debe aparecer en el menú cinético. Después conéctala desde un evento.'],
    ['NOM-037 es opcional', 'Activa o desactiva ese mensaje final desde su propia sección sin borrar el contenido.']
  ];
  const title = dialog.querySelector('[data-tour-title]'); const copy = dialog.querySelector('[data-tour-copy]'); const count = dialog.querySelector('[data-tour-step]');
  const prev = dialog.querySelector('[data-tour-prev]'); const next = dialog.querySelector('[data-tour-next]'); let index = 0;
  const render = () => { title.textContent = steps[index][0]; copy.textContent = steps[index][1]; count.textContent = `${index + 1} de ${steps.length}`; prev.disabled = index === 0; next.textContent = index === steps.length - 1 ? 'Terminar' : 'Siguiente'; };
  const open = () => { index = 0; render(); dialog.showModal(); };
  document.querySelectorAll('[data-admin-help-open]').forEach(button => button.addEventListener('click', event => { event.preventDefault(); open(); }));
  dialog.querySelector('[data-admin-help-close]').addEventListener('click', () => dialog.close());
  prev.addEventListener('click', () => { if (index) { index -= 1; render(); } });
  next.addEventListener('click', () => { if (index === steps.length - 1) dialog.close(); else { index += 1; render(); } });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
})();
