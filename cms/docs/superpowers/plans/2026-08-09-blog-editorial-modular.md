# Blog editorial modular Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir descubrir y publicar artículos de blog con badges obligatorios, video de YouTube y galería de imágenes desde el panel administrativo.

**Architecture:** Se extiende la base JSON con badges y medios asociados a cada entrada. Las rutas administrativas validan y persisten estos datos, mientras el blog público los muestra mediante filtros del lado del cliente, un reproductor seguro de YouTube y una galería manual accesible.

**Tech Stack:** Node.js, Express, EJS, JSON, Multer, CSS y JavaScript nativo.

## Global Constraints

- Los badges son administrables y al publicar se exige al menos uno.
- Las imágenes aceptadas son JPG, PNG y WebP cargadas desde el dispositivo.
- El video solo admite URLs válidas de YouTube y se renderiza como iframe de 16:9.
- La galería no se reproduce automáticamente y respeta `prefers-reduced-motion`.
- Las entradas existentes siguen funcionando sin badges, video ni galería.

---

### Task 1: Modelo editorial y consultas de blog

**Files:**
- Modify: `db.js`
- Modify: `test/public-pages.integration.test.js`

**Interfaces:**
- Produces: `listBlogBadges()`, `createBlogBadge(input)`, `updateBlogBadge(id, input)`, `deleteBlogBadge(id)`, `getBlogPostWithEditorial(idOrSlug)`, `setBlogPostEditorial(postId, { badgeIds, youtubeId, gallery })`.

- [ ] **Step 1: Write failing persistence tests**

```js
assert.match(dbSource, /blogBadges/);
assert.match(dbSource, /listBlogBadges/);
assert.match(dbSource, /setBlogPostEditorial/);
```

- [ ] **Step 2: Run the target test and verify it fails**

Run: `npm.cmd test -- --test-name-pattern="editorial blog"`

- [ ] **Step 3: Add data collections and compatibility defaults**

```js
blogBadges: [],
blogPostBadges: [],
blogGallery: []
```

Store `youtube_id` on each post and join badges/gallery into returned post objects without changing existing callers.

- [ ] **Step 4: Run the target test and verify it passes**

Run: `npm.cmd test -- --test-name-pattern="editorial blog"`

### Task 2: Administración de badges y publicación enriquecida

**Files:**
- Modify: `routes/admin.js`
- Modify: `views/admin/blog-list.ejs`
- Modify: `views/admin/blog-form.ejs`
- Create: `views/admin/blog-badges.ejs`
- Modify: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: Task 1 database methods.
- Produces: `/admin/blog/badges`, validated create/edit/delete routes, and a multipart article form accepting `gallery_images`.

- [ ] **Step 1: Write failing route/template assertions**

```js
assert.match(adminRoutes, /\/blog\/badges/);
assert.match(form, /name="badge_ids"/);
assert.match(form, /name="youtube_url"/);
assert.match(form, /name="gallery_images"/);
```

- [ ] **Step 2: Run the target test and verify it fails**

Run: `npm.cmd test -- --test-name-pattern="editorial blog"`

- [ ] **Step 3: Implement admin controls and validation**

```js
const uploadBlog = makeUploader('blog', ['.jpg', '.jpeg', '.png', '.webp']);
router.post('/blog/new', requireAuth, uploadBlog.fields([
  { name: 'cover_image', maxCount: 1 },
  { name: 'gallery_images', maxCount: 12 }
]), createBlogPost);
```

Normalize YouTube URLs to an ID, reject invalid URLs, and reject `published` submissions without badge IDs. Provide inline admin flash messages.

- [ ] **Step 4: Run the target test and verify it passes**

Run: `npm.cmd test -- --test-name-pattern="editorial blog"`

### Task 3: Blog discovery, article media and accessible gallery

**Files:**
- Modify: `routes/public.js`
- Modify: `views/blog/index.ejs`
- Modify: `views/blog/post.ejs`
- Modify: `public/blog.css`
- Create: `public/blog.js`
- Modify: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: enriched public post objects from Task 1.
- Produces: `data-blog-filter`, `data-blog-search`, `data-blog-gallery` and responsive YouTube rendering.

- [ ] **Step 1: Write failing public markup and behavior assertions**

```js
assert.match(index, /data-blog-filter/);
assert.match(index, /data-blog-search/);
assert.match(post, /blog-video-frame/);
assert.match(post, /data-blog-gallery/);
assert.match(script, /aria-live/);
```

- [ ] **Step 2: Run the target test and verify it fails**

Run: `npm.cmd test -- --test-name-pattern="editorial blog"`

- [ ] **Step 3: Implement visual discovery and manual gallery controls**

```html
<button type="button" data-blog-filter="all" aria-pressed="true">Todo</button>
<input type="search" data-blog-search aria-label="Buscar artículos">
<iframe class="blog-video-frame" title="Video de Inspiring Talent" loading="lazy"></iframe>
```

Use an editorial chip rail, results count, keyboard-accessible filter buttons and gallery controls. Pause any motion on hover/focus and disable decorative transitions for reduced motion.

- [ ] **Step 4: Run the target test and verify it passes**

Run: `npm.cmd test -- --test-name-pattern="editorial blog"`

### Task 4: Full verification

**Files:**
- Modify: `test/public-pages.integration.test.js`

- [ ] **Step 1: Run the full suite**

Run: `npm.cmd test`

- [ ] **Step 2: Verify all existing pages and new editorial functionality pass**

Expected: Every test reports pass with zero failures.
