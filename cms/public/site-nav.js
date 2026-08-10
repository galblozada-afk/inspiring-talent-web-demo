document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('kineticToggle');
  const overlay = document.getElementById('kineticOverlay');
  const backdrop = document.getElementById('kineticBackdrop');
  if (!header || !toggle || !overlay || !backdrop) return;
  const close = () => { overlay.classList.remove('is-open'); toggle.classList.remove('is-active'); toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
  toggle.addEventListener('click', () => { const open = overlay.classList.toggle('is-open'); toggle.classList.toggle('is-active', open); toggle.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : ''; });
  backdrop.addEventListener('click', close);
  overlay.querySelectorAll('.kinetic-link, .kinetic-academy-link').forEach(link => link.addEventListener('click', close));
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 8));
  window.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
});
