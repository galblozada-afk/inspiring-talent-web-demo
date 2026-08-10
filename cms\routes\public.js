const express = require('express');
const db = require('../db');
const { getInternalPage } = require('../content/internal-pages');

const router = express.Router();

function plainText(value) {
  return String(value || '').replace(/<[^>]*>/g, '').trim();
}

router.use((req, res, next) => {
  res.locals.topbarText = plainText(db.getSetting('topbar_text', ''));
  res.locals.topbarLinks = db.listTopbarLinks();
  res.locals.newsletterStatus = req.query.newsletter || '';
  res.locals.contactStatus = req.query.contact || '';
  res.locals.extraMenuPages = db.listExtraPagesPublishedMenu();
  next();
});

function loadContent() {
  const heroText = db.getSetting('hero_text', { eyebrow: '', headline_prefix: '', lede: '', cycle_words: [''] });
  const heroMedia = db.listHeroMedia();
  const topbarText = plainText(db.getSetting('topbar_text', ''));
  const topbarLinks = db.listTopbarLinks();

  const tabRows = db.listServiceTabs();
  const services = {};
  tabRows.forEach(t => { services[t.tab_key] = t; });

  const nom037 = db.getSetting('nom037', {});
  const events = db.listUpcomingEvents();

  return { heroText, heroMedia, topbarText, topbarLinks, services, servicesTabsOrdered: tabRows, nom037, events };
}

router.get('/', (req, res) => {
  res.render('index', loadContent());
});

router.get('/blog', (req, res) => {
  res.render('blog/index', { posts: db.listBlogPostsPublished(), badges: db.listBlogBadges() });
});

router.post('/newsletter', (req, res) => {
  const email = String(req.body.email || '').trim();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const referer = req.get('referer');
  const fallback = '/';
  let returnPath = fallback;

  if (referer) {
    try {
      const url = new URL(referer);
      if (url.host === req.get('host')) returnPath = `${url.pathname}${url.search}`;
    } catch (_) {
      // Si no hay una URL válida, la suscripción regresa al inicio de forma segura.
    }
  }

  const separator = returnPath.includes('?') ? '&' : '?';
  if (!isValidEmail) return res.redirect(`${returnPath}${separator}newsletter=invalid#footer-newsletter`);

  const { status } = db.subscribeToNewsletter(email);
  return res.redirect(`${returnPath}${separator}newsletter=${status}#footer-newsletter`);
});

router.get('/contacto', (req, res) => {
  res.render('contact', { formData: {}, formError: null });
});

router.post('/contacto', (req, res) => {
  const formData = {
    name: String(req.body.name || '').trim(),
    company: String(req.body.company || '').trim(),
    email: String(req.body.email || '').trim().toLowerCase(),
    phone: String(req.body.phone || '').trim(),
    service: String(req.body.service || '').trim(),
    message: String(req.body.message || '').trim(),
    newsletter_opt_in: req.body.newsletter_opt_in === 'yes'
  };
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  if (!formData.name || !isValidEmail || !formData.service) {
    return res.status(400).render('contact', {
      formData,
      formError: 'Completa tu nombre, un correo válido y el servicio que te interesa.'
    });
  }

  db.insertContactRequest(formData);
  if (formData.newsletter_opt_in) db.subscribeToNewsletter(formData.email);
  return res.redirect('/contacto?contact=sent');
});

router.get('/blog/:slug', (req, res) => {
  const post = db.getBlogPostBySlug(req.params.slug);
  if (!post || post.status !== 'published') return res.status(404).render('blog/not-found');
  res.render('blog/post', { post, related: db.relatedPosts(post.id, 3) });
});

router.get('/:pageSlug', (req, res, next) => {
  const extraPage = db.getExtraPageBySlug(req.params.pageSlug);
  if (extraPage) return res.render('pages/extra-page', { page: extraPage });
  const page = getInternalPage(req.params.pageSlug);
  if (!page) return next();
  if (page.slug === 'nosotros') return res.render('pages/about-page', { page });
  if (page.slug === 'coaching-organizacional') return res.render('pages/coaching-page', { page });
  if (page.slug === 'formacion') return res.render('pages/training-page', { page });
  if (page.slug === 'evaluacion-de-talento') return res.render('pages/evaluation-page', { page });
  if (page.slug === 'soluciones-para-empresas') return res.render('pages/solutions-page', { page });
  res.render('pages/service-page', { page });
});

module.exports = router;
