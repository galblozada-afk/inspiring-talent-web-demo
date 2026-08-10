// Base de datos en JSON puro — sin dependencias nativas (nada de node-gyp,
// Visual Studio Build Tools, etc.). Funciona igual en Windows, Mac, Linux y
// cualquier hosting con solo Node.js instalado.
const fs = require('fs');
const path = require('path');

const IS_NETLIFY = process.env.NETLIFY === 'true' || Boolean(process.env.NETLIFY);
const DATA_DIR = IS_NETLIFY ? path.join('/tmp', 'inspiring-talent-data') : path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SEED_DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

const EMPTY_DB = {
  adminUsers: [],       // { id, email, password_hash }
  settings: {},         // { hero_text: {...}, topbar_text: "...", nom037: {...} }
  topbarLinks: [],       // { id, label, url, sort_order }
  heroMedia: [],          // { id, type, url, sort_order }
  servicesTabs: [],        // { tab_key, sort_order, number_label, tab_label, heading, description, body_html, media_image, media_badge_image }
  blogPosts: [],             // { id, slug, title, excerpt, cover_image, content_html, youtube_id, status, published_at, created_at, updated_at }
  blogBadges: [],            // { id, name, kind, color, created_at }
  blogPostBadges: [],        // { post_id, badge_id }
  blogGallery: [],           // { id, post_id, image, alt, sort_order, created_at }
  events: [],                // { id, title, description, event_date, location, image, cta_label, cta_href, status, created_at, updated_at }
  extraPages: [],            // { id, slug, menu_label, eyebrow, title, intro, image, layout, blocks, cta_label, cta_href, show_in_menu, status, created_at, updated_at }
  contactRequests: [],       // { id, name, company, email, phone, service, message, newsletter_opt_in, status, created_at, updated_at }
  newsletterSubscribers: [], // { id, email, created_at }
  _nextId: 1
};

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) {
  const seed = IS_NETLIFY && fs.existsSync(SEED_DB_FILE)
    ? fs.readFileSync(SEED_DB_FILE, 'utf8')
    : JSON.stringify(EMPTY_DB, null, 2);
  fs.writeFileSync(DB_FILE, seed);
}

function load() {
  const raw = fs.readFileSync(DB_FILE, 'utf8');
  const data = JSON.parse(raw);
  for (const key of Object.keys(EMPTY_DB)) {
    if (!(key in data)) data[key] = EMPTY_DB[key];
  }
  return data;
}

function save(data) {
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

function nextId(data) {
  const id = data._nextId || 1;
  data._nextId = id + 1;
  return id;
}

// ---------------- settings (bloques de contenido tipo objeto) ----------------
function getSetting(key, fallback) {
  const data = load();
  return key in data.settings ? data.settings[key] : fallback;
}
function setSetting(key, value) {
  const data = load();
  data.settings[key] = value;
  save(data);
}

// ---------------- admin users ----------------
function countAdmins() {
  return load().adminUsers.length;
}
function getAdminByEmail(email) {
  return load().adminUsers.find(u => u.email === email) || null;
}
function insertAdmin(email, passwordHash) {
  const data = load();
  const user = { id: nextId(data), email, password_hash: passwordHash };
  data.adminUsers.push(user);
  save(data);
  return user;
}
function setAdminPassword(email, passwordHash) {
  const data = load();
  const existing = data.adminUsers.find(u => u.email === email);
  if (existing) {
    existing.password_hash = passwordHash;
    save(data);
    return 'updated';
  }
  data.adminUsers.push({ id: nextId(data), email, password_hash: passwordHash });
  save(data);
  return 'created';
}

// ---------------- topbar links ----------------
function listTopbarLinks() {
  return load().topbarLinks.slice().sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
}
function insertTopbarLink(label, url) {
  const data = load();
  const maxOrder = data.topbarLinks.reduce((m, l) => Math.max(m, l.sort_order), 0);
  const link = { id: nextId(data), label, url, sort_order: maxOrder + 1 };
  data.topbarLinks.push(link);
  save(data);
  return link;
}
function deleteTopbarLink(id) {
  const data = load();
  data.topbarLinks = data.topbarLinks.filter(l => String(l.id) !== String(id));
  save(data);
}

// ---------------- hero media ----------------
function listHeroMedia() {
  return load().heroMedia.slice().sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
}
function insertHeroMedia(type, url) {
  const data = load();
  const maxOrder = data.heroMedia.reduce((m, x) => Math.max(m, x.sort_order), 0);
  const item = { id: nextId(data), type, url, sort_order: maxOrder + 1 };
  data.heroMedia.push(item);
  save(data);
  return item;
}
function deleteHeroMedia(id) {
  const data = load();
  data.heroMedia = data.heroMedia.filter(m => String(m.id) !== String(id));
  save(data);
}
function moveHeroMedia(id, dir) {
  const data = load();
  const items = data.heroMedia.slice().sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
  const idx = items.findIndex(i => String(i.id) === String(id));
  if (idx === -1) return;
  const swapWith = dir === 'up' ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= items.length) return;
  const a = items[idx], b = items[swapWith];
  const orderA = a.sort_order, orderB = b.sort_order;
  const realA = data.heroMedia.find(x => x.id === a.id);
  const realB = data.heroMedia.find(x => x.id === b.id);
  realA.sort_order = orderB;
  realB.sort_order = orderA;
  save(data);
}

// ---------------- services tabs ----------------
function listServiceTabs() {
  return load().servicesTabs.slice().sort((a, b) => a.sort_order - b.sort_order);
}
function getServiceTab(tabKey) {
  return load().servicesTabs.find(t => t.tab_key === tabKey) || null;
}
function insertServiceTab(tab) {
  const data = load();
  data.servicesTabs.push(tab);
  save(data);
  return tab;
}
function updateServiceTab(tabKey, fields) {
  const data = load();
  const tab = data.servicesTabs.find(t => t.tab_key === tabKey);
  if (!tab) return null;
  Object.assign(tab, fields);
  save(data);
  return tab;
}

// ---------------- blog posts ----------------
function decorateBlogPost(data, post) {
  if (!post) return null;
  const badges = data.blogPostBadges
    .filter(item => String(item.post_id) === String(post.id))
    .map(item => data.blogBadges.find(badge => String(badge.id) === String(item.badge_id)))
    .filter(Boolean);
  const gallery = data.blogGallery
    .filter(item => String(item.post_id) === String(post.id))
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
  return { ...post, badges, gallery };
}

function listBlogPostsAll() {
  const data = load();
  return data.blogPosts
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map(post => decorateBlogPost(data, post));
}
function listBlogPostsPublished() {
  const data = load();
  return data.blogPosts
    .filter(p => p.status === 'published')
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    .map(post => decorateBlogPost(data, post));
}
function getBlogPostById(id) {
  const data = load();
  return decorateBlogPost(data, data.blogPosts.find(p => String(p.id) === String(id)));
}
function getBlogPostBySlug(slug) {
  const data = load();
  return decorateBlogPost(data, data.blogPosts.find(p => p.slug === slug));
}
function slugExists(slug) {
  return load().blogPosts.some(p => p.slug === slug);
}
function insertBlogPost(post) {
  const data = load();
  const now = new Date().toISOString();
  const row = {
    id: nextId(data),
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
    cover_image: post.cover_image || null,
    content_html: post.content_html || '',
    youtube_id: post.youtube_id || null,
    status: post.status || 'draft',
    published_at: post.published_at || null,
    created_at: now,
    updated_at: now
  };
  data.blogPosts.push(row);
  save(data);
  return row;
}
function updateBlogPost(id, fields) {
  const data = load();
  const post = data.blogPosts.find(p => String(p.id) === String(id));
  if (!post) return null;
  Object.assign(post, fields, { updated_at: new Date().toISOString() });
  save(data);
  return post;
}
function deleteBlogPost(id) {
  const data = load();
  data.blogPosts = data.blogPosts.filter(p => String(p.id) !== String(id));
  data.blogPostBadges = data.blogPostBadges.filter(item => String(item.post_id) !== String(id));
  data.blogGallery = data.blogGallery.filter(item => String(item.post_id) !== String(id));
  save(data);
}
function relatedPosts(excludeId, limit) {
  return listBlogPostsPublished().filter(p => String(p.id) !== String(excludeId)).slice(0, limit);
}

function listBlogBadges() {
  return load().blogBadges.slice().sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name, 'es'));
}
function getBlogBadgeById(id) {
  return load().blogBadges.find(badge => String(badge.id) === String(id)) || null;
}
function createBlogBadge(input) {
  const data = load();
  const badge = {
    id: nextId(data),
    name: String(input.name || '').trim(),
    kind: input.kind === 'format' ? 'format' : 'topic',
    color: String(input.color || '#14E8A6').trim(),
    created_at: new Date().toISOString()
  };
  data.blogBadges.push(badge);
  save(data);
  return badge;
}
function updateBlogBadge(id, input) {
  const data = load();
  const badge = data.blogBadges.find(item => String(item.id) === String(id));
  if (!badge) return null;
  Object.assign(badge, {
    name: String(input.name || '').trim(),
    kind: input.kind === 'format' ? 'format' : 'topic',
    color: String(input.color || '#14E8A6').trim()
  });
  save(data);
  return badge;
}
function deleteBlogBadge(id) {
  const data = load();
  const isInUse = data.blogPostBadges.some(item => String(item.badge_id) === String(id));
  if (isInUse) return false;
  data.blogBadges = data.blogBadges.filter(badge => String(badge.id) !== String(id));
  save(data);
  return true;
}
function setBlogPostEditorial(postId, { badgeIds = [], youtubeId = null, gallery = [] }) {
  const data = load();
  const post = data.blogPosts.find(item => String(item.id) === String(postId));
  if (!post) return null;
  const allowedBadgeIds = new Set(data.blogBadges.map(badge => String(badge.id)));
  const normalizedBadgeIds = [...new Set(badgeIds.map(String))].filter(id => allowedBadgeIds.has(id));
  data.blogPostBadges = data.blogPostBadges.filter(item => String(item.post_id) !== String(postId));
  normalizedBadgeIds.forEach(badgeId => data.blogPostBadges.push({ post_id: post.id, badge_id: Number(badgeId) }));
  data.blogGallery = data.blogGallery.filter(item => String(item.post_id) !== String(postId));
  gallery.forEach((item, index) => {
    if (!item || !item.image) return;
    data.blogGallery.push({
      id: nextId(data), post_id: post.id, image: item.image,
      alt: String(item.alt || '').trim(), sort_order: index + 1, created_at: new Date().toISOString()
    });
  });
  post.youtube_id = youtubeId || null;
  post.updated_at = new Date().toISOString();
  save(data);
  return decorateBlogPost(data, post);
}

// ---------------- events ----------------
function listEventsAll() {
  return load().events.slice().sort((a, b) => String(a.event_date || '').localeCompare(String(b.event_date || '')));
}
function listUpcomingEvents() {
  const today = new Date().toISOString().slice(0, 10);
  return listEventsAll().filter(event => event.status === 'published' && (!event.event_date || event.event_date >= today));
}
function getEventById(id) {
  return load().events.find(event => String(event.id) === String(id)) || null;
}
function insertEvent(event) {
  const data = load();
  const now = new Date().toISOString();
  const row = {
    id: nextId(data), title: event.title, description: event.description || '', event_date: event.event_date || '',
    location: event.location || '', image: event.image || null, cta_label: event.cta_label || 'Conocer más',
    cta_href: event.cta_href || '/contacto', status: event.status || 'draft', created_at: now, updated_at: now
  };
  data.events.push(row);
  save(data);
  return row;
}
function updateEvent(id, fields) {
  const data = load();
  const event = data.events.find(item => String(item.id) === String(id));
  if (!event) return null;
  Object.assign(event, fields, { updated_at: new Date().toISOString() });
  save(data);
  return event;
}
function deleteEvent(id) {
  const data = load();
  data.events = data.events.filter(event => String(event.id) !== String(id));
  save(data);
}

// ---------------- paginas editoriales (creadas sin codigo) ----------------
function listExtraPagesAll() {
  return load().extraPages.slice().sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}
function listExtraPagesPublishedMenu() {
  return listExtraPagesAll().filter(page => page.status === 'published' && page.show_in_menu);
}
function getExtraPageById(id) {
  return load().extraPages.find(page => String(page.id) === String(id)) || null;
}
function getExtraPageBySlug(slug) {
  return load().extraPages.find(page => page.slug === slug && page.status === 'published') || null;
}
function extraPageSlugExists(slug, excludeId) {
  return load().extraPages.some(page => page.slug === slug && String(page.id) !== String(excludeId || ''));
}
function insertExtraPage(page) {
  const data = load();
  const now = new Date().toISOString();
  const row = {
    id: nextId(data), slug: page.slug, menu_label: page.menu_label || page.title,
    eyebrow: page.eyebrow || '', title: page.title, intro: page.intro || '', image: page.image || null,
    layout: page.layout || 'program', blocks: Array.isArray(page.blocks) ? page.blocks : [],
    cta_label: page.cta_label || 'Hablemos', cta_href: page.cta_href || '/contacto',
    show_in_menu: Boolean(page.show_in_menu), status: page.status || 'draft', created_at: now, updated_at: now
  };
  data.extraPages.push(row); save(data); return row;
}
function updateExtraPage(id, fields) {
  const data = load();
  const page = data.extraPages.find(item => String(item.id) === String(id));
  if (!page) return null;
  Object.assign(page, fields, { updated_at: new Date().toISOString() }); save(data); return page;
}
function deleteExtraPage(id) {
  const data = load(); data.extraPages = data.extraPages.filter(page => String(page.id) !== String(id)); save(data);
}

// ---------------- contact requests ----------------
function listContactRequests() {
  return load().contactRequests.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}
function insertContactRequest(request) {
  const data = load();
  const now = new Date().toISOString();
  const row = {
    id: nextId(data), name: request.name, company: request.company || '', email: request.email,
    phone: request.phone || '', service: request.service, message: request.message || '',
    newsletter_opt_in: Boolean(request.newsletter_opt_in), status: 'new', created_at: now, updated_at: now
  };
  data.contactRequests.push(row);
  save(data);
  return row;
}
function updateContactRequestStatus(id, status) {
  const data = load();
  const request = data.contactRequests.find(item => String(item.id) === String(id));
  if (!request) return null;
  request.status = status;
  request.updated_at = new Date().toISOString();
  save(data);
  return request;
}

// ---------------- newsletter ----------------
function subscribeToNewsletter(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const data = load();
  const existing = data.newsletterSubscribers.find(subscriber => subscriber.email === normalizedEmail);
  if (existing) return { status: 'exists', subscriber: existing };

  const subscriber = { id: nextId(data), email: normalizedEmail, created_at: new Date().toISOString() };
  data.newsletterSubscribers.push(subscriber);
  save(data);
  return { status: 'created', subscriber };
}

module.exports = {
  getSetting, setSetting,
  countAdmins, getAdminByEmail, insertAdmin, setAdminPassword,
  listTopbarLinks, insertTopbarLink, deleteTopbarLink,
  listHeroMedia, insertHeroMedia, deleteHeroMedia, moveHeroMedia,
  listServiceTabs, getServiceTab, insertServiceTab, updateServiceTab,
  listBlogPostsAll, listBlogPostsPublished, getBlogPostById, getBlogPostBySlug,
  slugExists, insertBlogPost, updateBlogPost, deleteBlogPost, relatedPosts,
  listBlogBadges, getBlogBadgeById, createBlogBadge, updateBlogBadge, deleteBlogBadge, setBlogPostEditorial,
  listEventsAll, listUpcomingEvents, getEventById, insertEvent, updateEvent, deleteEvent,
  listExtraPagesAll, listExtraPagesPublishedMenu, getExtraPageById, getExtraPageBySlug, extraPageSlugExists, insertExtraPage, updateExtraPage, deleteExtraPage,
  listContactRequests, insertContactRequest, updateContactRequestStatus,
  subscribeToNewsletter
};
