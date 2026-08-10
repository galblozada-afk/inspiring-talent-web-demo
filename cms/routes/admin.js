const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// ---------------- helpers ----------------
function flash(req, type, message) {
  req.session.flash = { type, message };
}
function popFlash(req) {
  const f = req.session.flash;
  delete req.session.flash;
  return f || null;
}
function slugify(str) {
  return str.toString().trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeYouTubeId(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    let id = '';
    if (url.hostname === 'youtu.be' || url.hostname.endsWith('.youtu.be')) id = url.pathname.split('/')[1] || '';
    if (url.hostname.includes('youtube.com')) {
      id = url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop() || '';
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch (_) {
    return null;
  }
}

function normalizeBadgeIds(value) {
  return (Array.isArray(value) ? value : [value]).filter(Boolean).map(String);
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]*>/g, '').trim();
}
function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function lines(value) {
  return String(value || '').split('\n').map(item => item.trim()).filter(Boolean);
}
function serviceContentHtml(groups) {
  return groups.filter(group => group.title || group.items.length).map(group => {
    const title = group.title ? `<div class="subgroup-title">${escapeHtml(group.title)}</div>` : '';
    const items = group.items.length ? `<ul class="taglist">${group.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '';
    return title + items;
  }).join('');
}
function parseServiceContent(tab) {
  const source = String(tab.body_html || '');
  const titles = [...source.matchAll(/subgroup-title[^>]*>([\s\S]*?)<\/div>/gi)].map(match => stripHtml(match[1]));
  const lists = [...source.matchAll(/<ul[^>]*>([\s\S]*?)<\/ul>/gi)].map(match => [...match[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(item => stripHtml(item[1])).filter(Boolean));
  return [0, 1].map(index => ({ title: titles[index] || '', items: (lists[index] || []).join('\n') }));
}
function buildPageBlocks(body) {
  return [1, 2, 3].map(index => ({
    title: String(body[`block_${index}_title`] || '').trim(),
    text: String(body[`block_${index}_text`] || '').trim()
  })).filter(block => block.title || block.text);
}

function makeUploader(subdir, allowed) {
  const serverless = process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT || __dirname.includes('netlify/functions');
  const uploadRoot = serverless ? path.join('/tmp', 'inspiring-talent-uploads') : path.join(__dirname, '..', 'public', 'uploads');
  const dest = path.join(uploadRoot, subdir);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, dest),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1e6) + ext);
      }
    }),
    limits: { fileSize: 80 * 1024 * 1024 }, // 80MB (video)
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowed.includes(ext)) return cb(new Error('Tipo de archivo no permitido: ' + ext));
      cb(null, true);
    }
  });
}

const uploadHero = makeUploader('hero', ['.mp4', '.webm', '.mov', '.jpg', '.jpeg', '.png', '.webp']);
const uploadServices = makeUploader('services', ['.jpg', '.jpeg', '.png', '.webp']);
const uploadNom = makeUploader('nom037', ['.jpg', '.jpeg', '.png', '.webp']);
const uploadBlog = makeUploader('blog', ['.jpg', '.jpeg', '.png', '.webp']);
const uploadEvents = makeUploader('events', ['.jpg', '.jpeg', '.png', '.webp']);
const uploadPages = makeUploader('pages', ['.jpg', '.jpeg', '.png', '.webp']);

// ---------------- LOGIN ----------------
router.get('/login', (req, res) => {
  if (req.session.adminId) return res.redirect('/admin/dashboard');
  res.render('admin/login', { error: null });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.getAdminByEmail((email || '').trim());
  if (!user || !bcrypt.compareSync(password || '', user.password_hash)) {
    return res.render('admin/login', { error: 'Correo o contraseña incorrectos.' });
  }
  req.session.regenerate((err) => {
    if (err) return res.render('admin/login', { error: 'Error de sesión, intenta de nuevo.' });
    req.session.adminId = user.id;
    req.session.adminEmail = user.email;
    res.redirect('/admin/dashboard');
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// ---------------- DASHBOARD ----------------
router.get('/dashboard', requireAuth, (req, res) => {
  res.render('admin/dashboard', {
    email: req.session.adminEmail,
    flash: popFlash(req),
    postCount: db.listBlogPostsAll().length,
    linkCount: db.listTopbarLinks().length,
    mediaCount: db.listHeroMedia().length,
    contactCount: db.listContactRequests().filter(request => request.status === 'new').length
  });
});

// ---------------- HERO ----------------
router.get('/hero', requireAuth, (req, res) => {
  res.render('admin/hero', {
    heroText: db.getSetting('hero_text', {}),
    media: db.listHeroMedia(),
    flash: popFlash(req),
    email: req.session.adminEmail
  });
});

router.post('/hero/text', requireAuth, (req, res) => {
  const { eyebrow, headline_prefix, lede, cycle_words } = req.body;
  const words = (cycle_words || '').split('\n').map(w => w.trim()).filter(Boolean);
  db.setSetting('hero_text', {
    eyebrow: eyebrow || '',
    headline_prefix: headline_prefix || '',
    lede: lede || '',
    cycle_words: words.length ? words : ['']
  });
  flash(req, 'ok', 'Texto del hero actualizado.');
  res.redirect('/admin/hero');
});

router.post('/hero/media/add', requireAuth, uploadHero.single('file'), (req, res) => {
  const { external_url, type } = req.body;
  let url = external_url && external_url.trim();
  if (req.file) url = '/uploads/hero/' + req.file.filename;
  if (!url) {
    flash(req, 'error', 'Sube un archivo o proporciona una URL.');
    return res.redirect('/admin/hero');
  }
  db.insertHeroMedia(type === 'image' ? 'image' : 'video', url);
  flash(req, 'ok', 'Elemento agregado al hero.');
  res.redirect('/admin/hero');
});

router.post('/hero/media/:id/delete', requireAuth, (req, res) => {
  db.deleteHeroMedia(req.params.id);
  flash(req, 'ok', 'Elemento eliminado del hero.');
  res.redirect('/admin/hero');
});

router.post('/hero/media/:id/move', requireAuth, (req, res) => {
  db.moveHeroMedia(req.params.id, req.body.dir);
  res.redirect('/admin/hero');
});

// ---------------- TOPBAR ----------------
router.get('/topbar', requireAuth, (req, res) => {
  res.render('admin/topbar', {
    links: db.listTopbarLinks(),
    topbarText: stripHtml(db.getSetting('topbar_text', '')),
    flash: popFlash(req),
    email: req.session.adminEmail
  });
});

router.post('/topbar/text', requireAuth, (req, res) => {
  db.setSetting('topbar_text', stripHtml(req.body.topbar_text));
  flash(req, 'ok', 'Texto del topbar actualizado.');
  res.redirect('/admin/topbar');
});

router.post('/topbar/links/add', requireAuth, (req, res) => {
  const { label, url } = req.body;
  if (!label || !url) {
    flash(req, 'error', 'Falta la etiqueta o la URL del hipervínculo.');
    return res.redirect('/admin/topbar');
  }
  db.insertTopbarLink(label, url);
  flash(req, 'ok', 'Hipervínculo agregado.');
  res.redirect('/admin/topbar');
});

router.post('/topbar/links/:id/delete', requireAuth, (req, res) => {
  db.deleteTopbarLink(req.params.id);
  flash(req, 'ok', 'Hipervínculo eliminado.');
  res.redirect('/admin/topbar');
});

// ---------------- SERVICIOS ----------------
router.get('/services', requireAuth, (req, res) => {
  const tabs = db.listServiceTabs().map(tab => ({ ...tab, editorGroups: parseServiceContent(tab) }));
  res.render('admin/services', { tabs, flash: popFlash(req), email: req.session.adminEmail });
});

router.post('/services/:tabKey', requireAuth, uploadServices.fields([
  { name: 'media_image', maxCount: 1 },
  { name: 'media_badge_image', maxCount: 1 }
]), (req, res) => {
  const { tab_label, number_label, heading, description } = req.body;
  const tab = db.getServiceTab(req.params.tabKey);
  if (!tab) { flash(req, 'error', 'Servicio no encontrado.'); return res.redirect('/admin/services'); }

  const groups = [
    { title: req.body.group_1_title, items: lines(req.body.group_1_items) },
    { title: req.body.group_2_title, items: lines(req.body.group_2_items) }
  ];
  const fields = { tab_label, number_label, heading, description, body_html: serviceContentHtml(groups) };
  if (req.files && req.files.media_image && req.files.media_image[0]) {
    fields.media_image = '/uploads/services/' + req.files.media_image[0].filename;
  }
  if (req.files && req.files.media_badge_image && req.files.media_badge_image[0]) {
    fields.media_badge_image = '/uploads/services/' + req.files.media_badge_image[0].filename;
  }

  db.updateServiceTab(req.params.tabKey, fields);
  flash(req, 'ok', 'Servicio "' + tab_label + '" actualizado.');
  res.redirect('/admin/services');
});

// ---------------- NOM-037 ----------------
router.get('/nom037', requireAuth, (req, res) => {
  res.render('admin/nom037', { nom: db.getSetting('nom037', {}), flash: popFlash(req), email: req.session.adminEmail });
});

router.post('/nom037', requireAuth, uploadNom.single('image'), (req, res) => {
  const current = db.getSetting('nom037', {});
  const { eyebrow, heading, paragraph1, paragraph2, cta_label, cta_href, is_visible } = req.body;
  db.setSetting('nom037', {
    eyebrow: eyebrow || '', heading: heading || '',
    paragraph1: paragraph1 || '', paragraph2: paragraph2 || '',
    cta_label: cta_label || '', cta_href: cta_href || '#contacto',
    image: req.file ? '/uploads/nom037/' + req.file.filename : current.image,
    is_visible: is_visible === 'yes'
  });
  flash(req, 'ok', 'Sección NOM-037 actualizada.');
  res.redirect('/admin/nom037');
});

// ---------------- EVENTS ----------------
router.get('/events', requireAuth, (req, res) => {
  res.render('admin/events-list', { events: db.listEventsAll(), flash: popFlash(req), email: req.session.adminEmail });
});

router.get('/events/new', requireAuth, (req, res) => {
  res.render('admin/event-form', { event: null, pages: db.listExtraPagesAll(), flash: popFlash(req), email: req.session.adminEmail });
});

router.post('/events/new', requireAuth, uploadEvents.single('image'), (req, res) => {
  const { title, description, event_date, location, cta_label, cta_href, status, page_id } = req.body;
  if (!title || !title.trim()) { flash(req, 'error', 'El título es obligatorio.'); return res.redirect('/admin/events/new'); }
  const linkedPage = page_id ? db.getExtraPageById(page_id) : null;
  db.insertEvent({ title: title.trim(), description, event_date, location, cta_label, cta_href: linkedPage ? '/' + linkedPage.slug : cta_href, status: status === 'published' ? 'published' : 'draft', image: req.file ? '/uploads/events/' + req.file.filename : null });
  flash(req, 'ok', 'Evento creado.');
  res.redirect('/admin/events');
});

router.get('/events/:id/edit', requireAuth, (req, res) => {
  const event = db.getEventById(req.params.id);
  if (!event) { flash(req, 'error', 'Evento no encontrado.'); return res.redirect('/admin/events'); }
  res.render('admin/event-form', { event, pages: db.listExtraPagesAll(), flash: popFlash(req), email: req.session.adminEmail });
});

router.post('/events/:id/edit', requireAuth, uploadEvents.single('image'), (req, res) => {
  const event = db.getEventById(req.params.id);
  if (!event) { flash(req, 'error', 'Evento no encontrado.'); return res.redirect('/admin/events'); }
  const { title, description, event_date, location, cta_label, cta_href, status, page_id } = req.body;
  if (!title || !title.trim()) { flash(req, 'error', 'El título es obligatorio.'); return res.redirect('/admin/events/' + event.id + '/edit'); }
  const linkedPage = page_id ? db.getExtraPageById(page_id) : null;
  db.updateEvent(event.id, { title: title.trim(), description, event_date, location, cta_label, cta_href: linkedPage ? '/' + linkedPage.slug : cta_href, status: status === 'published' ? 'published' : 'draft', image: req.file ? '/uploads/events/' + req.file.filename : event.image });
  flash(req, 'ok', 'Evento actualizado.');
  res.redirect('/admin/events');
});

router.post('/events/:id/delete', requireAuth, (req, res) => {
  db.deleteEvent(req.params.id);
  flash(req, 'ok', 'Evento eliminado.');
  res.redirect('/admin/events');
});

// ---------------- PAGINAS EXTRA (plantillas sin codigo) ----------------
router.get('/pages', requireAuth, (req, res) => {
  res.render('admin/pages-list', { pages: db.listExtraPagesAll(), flash: popFlash(req), email: req.session.adminEmail });
});
router.get('/pages/new', requireAuth, (req, res) => {
  res.render('admin/page-form', { page: null, flash: popFlash(req), email: req.session.adminEmail });
});
router.post('/pages/new', requireAuth, uploadPages.single('image'), (req, res) => {
  const { title, menu_label, eyebrow, intro, layout, cta_label, cta_href, status, show_in_menu } = req.body;
  if (!title || !title.trim()) { flash(req, 'error', 'El título es obligatorio.'); return res.redirect('/admin/pages/new'); }
  let slug = slugify(title);
  if (db.extraPageSlugExists(slug)) slug += '-' + Date.now().toString().slice(-5);
  db.insertExtraPage({ slug, title: title.trim(), menu_label, eyebrow, intro, layout, cta_label, cta_href, status: status === 'published' ? 'published' : 'draft', show_in_menu: show_in_menu === 'yes', blocks: buildPageBlocks(req.body), image: req.file ? '/uploads/pages/' + req.file.filename : null });
  flash(req, 'ok', 'Página creada.'); res.redirect('/admin/pages');
});
router.get('/pages/:id/edit', requireAuth, (req, res) => {
  const page = db.getExtraPageById(req.params.id);
  if (!page) { flash(req, 'error', 'Página no encontrada.'); return res.redirect('/admin/pages'); }
  res.render('admin/page-form', { page, flash: popFlash(req), email: req.session.adminEmail });
});
router.post('/pages/:id/edit', requireAuth, uploadPages.single('image'), (req, res) => {
  const page = db.getExtraPageById(req.params.id);
  if (!page) { flash(req, 'error', 'Página no encontrada.'); return res.redirect('/admin/pages'); }
  const { title, menu_label, eyebrow, intro, layout, cta_label, cta_href, status, show_in_menu } = req.body;
  if (!title || !title.trim()) { flash(req, 'error', 'El título es obligatorio.'); return res.redirect('/admin/pages/' + page.id + '/edit'); }
  let slug = slugify(title);
  if (db.extraPageSlugExists(slug, page.id)) slug += '-' + Date.now().toString().slice(-5);
  db.updateExtraPage(page.id, { slug, title: title.trim(), menu_label, eyebrow, intro, layout, cta_label, cta_href, status: status === 'published' ? 'published' : 'draft', show_in_menu: show_in_menu === 'yes', blocks: buildPageBlocks(req.body), image: req.file ? '/uploads/pages/' + req.file.filename : page.image });
  flash(req, 'ok', 'Página actualizada.'); res.redirect('/admin/pages');
});
router.post('/pages/:id/delete', requireAuth, (req, res) => {
  db.deleteExtraPage(req.params.id); flash(req, 'ok', 'Página eliminada.'); res.redirect('/admin/pages');
});

router.get('/help', requireAuth, (req, res) => {
  res.render('admin/help', { flash: popFlash(req), email: req.session.adminEmail });
});

// ---------------- CONTACT REQUESTS ----------------
router.get('/contacts', requireAuth, (req, res) => {
  res.render('admin/contacts-list', { contacts: db.listContactRequests(), flash: popFlash(req), email: req.session.adminEmail });
});

router.post('/contacts/:id/status', requireAuth, (req, res) => {
  const allowedStatuses = ['new', 'in_progress', 'done'];
  const status = allowedStatuses.includes(req.body.status) ? req.body.status : 'new';
  const contact = db.updateContactRequestStatus(req.params.id, status);
  if (!contact) flash(req, 'error', 'Solicitud no encontrada.');
  else flash(req, 'ok', 'Estado de la solicitud actualizado.');
  res.redirect('/admin/contacts');
});

// ---------------- BLOG ----------------
router.get('/blog', requireAuth, (req, res) => {
  res.render('admin/blog-list', { posts: db.listBlogPostsAll(), flash: popFlash(req), email: req.session.adminEmail });
});

router.get('/blog/badges', requireAuth, (req, res) => {
  res.render('admin/blog-badges', { badges: db.listBlogBadges(), flash: popFlash(req), email: req.session.adminEmail });
});

router.post('/blog/badges', requireAuth, (req, res) => {
  const { name, kind, color } = req.body;
  if (!name || !name.trim()) {
    flash(req, 'error', 'El nombre del badge es obligatorio.');
    return res.redirect('/admin/blog/badges');
  }
  db.createBlogBadge({ name, kind, color });
  flash(req, 'ok', 'Badge creado.');
  res.redirect('/admin/blog/badges');
});

router.post('/blog/badges/:id/edit', requireAuth, (req, res) => {
  const { name, kind, color } = req.body;
  const badge = name && name.trim() ? db.updateBlogBadge(req.params.id, { name, kind, color }) : null;
  flash(req, badge ? 'ok' : 'error', badge ? 'Badge actualizado.' : 'Revisa el nombre del badge.');
  res.redirect('/admin/blog/badges');
});

router.post('/blog/badges/:id/delete', requireAuth, (req, res) => {
  const deleted = db.deleteBlogBadge(req.params.id);
  flash(req, deleted ? 'ok' : 'error', deleted ? 'Badge eliminado.' : 'No se puede eliminar: este badge está en uso.');
  res.redirect('/admin/blog/badges');
});

router.get('/blog/new', requireAuth, (req, res) => {
  res.render('admin/blog-form', { post: null, badges: db.listBlogBadges(), flash: popFlash(req), email: req.session.adminEmail });
});

router.post('/blog/new', requireAuth, uploadBlog.fields([
  { name: 'cover_image', maxCount: 1 },
  { name: 'gallery_images', maxCount: 12 }
]), (req, res) => {
  const { title, excerpt, content_html, status, youtube_url } = req.body;
  const badgeIds = normalizeBadgeIds(req.body.badge_ids);
  if (!title || !title.trim()) {
    flash(req, 'error', 'El título es obligatorio.');
    return res.redirect('/admin/blog/new');
  }
  if (status === 'published' && !badgeIds.length) {
    flash(req, 'error', 'Para publicar selecciona al menos un badge.');
    return res.redirect('/admin/blog/new');
  }
  const youtubeId = normalizeYouTubeId(youtube_url);
  if (youtube_url && !youtubeId) {
    flash(req, 'error', 'Usa un enlace válido de YouTube.');
    return res.redirect('/admin/blog/new');
  }
  let slug = slugify(title);
  if (db.slugExists(slug)) slug = slug + '-' + Date.now().toString().slice(-5);

  const coverFile = req.files && req.files.cover_image && req.files.cover_image[0];
  const cover = coverFile ? '/uploads/blog/' + coverFile.filename : null;
  const isPublished = status === 'published';

  const post = db.insertBlogPost({
    slug, title: title.trim(), excerpt: excerpt || '', cover_image: cover,
    content_html: content_html || '', youtube_id: youtubeId, status: isPublished ? 'published' : 'draft',
    published_at: isPublished ? new Date().toISOString() : null
  });

  const galleryFiles = (req.files && req.files.gallery_images) || [];
  db.setBlogPostEditorial(post.id, {
    badgeIds,
    youtubeId,
    gallery: galleryFiles.map((file, index) => ({ image: '/uploads/blog/' + file.filename, alt: (req.body.gallery_alt || [])[index] || '' }))
  });

  flash(req, 'ok', 'Entrada de blog creada.');
  res.redirect('/admin/blog');
});

router.get('/blog/:id/edit', requireAuth, (req, res) => {
  const post = db.getBlogPostById(req.params.id);
  if (!post) { flash(req, 'error', 'Entrada no encontrada.'); return res.redirect('/admin/blog'); }
  res.render('admin/blog-form', { post, badges: db.listBlogBadges(), flash: popFlash(req), email: req.session.adminEmail });
});

router.post('/blog/:id/edit', requireAuth, uploadBlog.fields([
  { name: 'cover_image', maxCount: 1 },
  { name: 'gallery_images', maxCount: 12 }
]), (req, res) => {
  const post = db.getBlogPostById(req.params.id);
  if (!post) { flash(req, 'error', 'Entrada no encontrada.'); return res.redirect('/admin/blog'); }

  const { title, excerpt, content_html, status, youtube_url } = req.body;
  const badgeIds = normalizeBadgeIds(req.body.badge_ids);
  const coverFile = req.files && req.files.cover_image && req.files.cover_image[0];
  const cover = coverFile ? '/uploads/blog/' + coverFile.filename : post.cover_image;
  if (!title || !title.trim()) {
    flash(req, 'error', 'El título es obligatorio.');
    return res.redirect('/admin/blog/' + post.id + '/edit');
  }
  if (status === 'published' && !badgeIds.length) {
    flash(req, 'error', 'Para publicar selecciona al menos un badge.');
    return res.redirect('/admin/blog/' + post.id + '/edit');
  }
  const youtubeId = normalizeYouTubeId(youtube_url);
  if (youtube_url && !youtubeId) {
    flash(req, 'error', 'Usa un enlace válido de YouTube.');
    return res.redirect('/admin/blog/' + post.id + '/edit');
  }
  const isPublished = status === 'published';
  let publishedAt = post.published_at;
  if (isPublished && !publishedAt) publishedAt = new Date().toISOString();

  db.updateBlogPost(req.params.id, {
    title: title.trim(), excerpt: excerpt || '', content_html: content_html || '',
    status: isPublished ? 'published' : 'draft', cover_image: cover, youtube_id: youtubeId, published_at: publishedAt
  });

  const removedGalleryIds = normalizeBadgeIds(req.body.remove_gallery_ids);
  const existingGallery = post.gallery
    .filter(item => !removedGalleryIds.includes(String(item.id)))
    .map(item => ({ image: item.image, alt: req.body['gallery_alt_' + item.id] || item.alt }));
  const galleryFiles = (req.files && req.files.gallery_images) || [];
  const newGallery = galleryFiles.map((file, index) => ({ image: '/uploads/blog/' + file.filename, alt: (req.body.gallery_alt || [])[index] || '' }));
  db.setBlogPostEditorial(post.id, { badgeIds, youtubeId, gallery: existingGallery.concat(newGallery) });

  flash(req, 'ok', 'Entrada actualizada.');
  res.redirect('/admin/blog');
});

router.post('/blog/:id/delete', requireAuth, (req, res) => {
  db.deleteBlogPost(req.params.id);
  flash(req, 'ok', 'Entrada eliminada.');
  res.redirect('/admin/blog');
});

module.exports = router;
