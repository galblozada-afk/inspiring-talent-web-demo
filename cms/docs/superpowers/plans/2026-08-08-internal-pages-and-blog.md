# InspiringTalent Internal Pages and Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create five conversion-focused public pages and publish three researched articles without changing the existing home.

**Architecture:** Add a data-driven public page catalog to the existing public router and render every new route with one EJS view. Keep page-only styling in a separate stylesheet and seed blog records idempotently through the existing database module.

**Tech Stack:** Node.js, Express 4, EJS, JSON file database, vanilla CSS.

## Global Constraints

- Do not modify `views/index.ejs`, `public/site.css`, admin routes, or existing home data.
- Do not add dependencies.
- All page copy is Spanish (Mexico); claims must remain informational and cannot invent credentials, results, dates or prices.
- Keep existing navigation and WhatsApp destination `https://wa.link/77etlj`.

---

### Task 1: Shared page catalog and public routing

**Files:**
- Create: `views/pages/service-page.ejs`
- Modify: `routes/public.js`

**Interfaces:**
- Produces `GET /coaching-organizacional`, `GET /formacion`, `GET /evaluacion-de-talento`, `GET /soluciones-para-empresas`, `GET /nosotros`.
- View input: `page = { slug, eyebrow, title, intro, focus, sections, ctaTitle, ctaText }`.

- [ ] **Step 1: Add the five page records to `routes/public.js`**

```js
const pages = {
  'coaching-organizacional': { slug: 'coaching-organizacional', eyebrow: 'Desarrollo organizacional', title: 'Coaching para liderar el cambio', intro: '...', focus: '...', sections: [{ title: 'Coaching ejecutivo y de liderazgo', items: ['...'] }], ctaTitle: 'Conversemos sobre tu organización', ctaText: '...' }
};
```

- [ ] **Step 2: Add one route that validates the requested slug**

```js
router.get('/:pageSlug', (req, res, next) => {
  const page = pages[req.params.pageSlug];
  if (!page) return next();
  res.render('pages/service-page', { page });
});
```

- [ ] **Step 3: Build the semantic EJS template**

Include a header linking to `/`, one `h1`, service sections rendered from `page.sections`, internal links to related routes, and a final CTA to `https://wa.link/77etlj` with `target="_blank" rel="noopener"`.

- [ ] **Step 4: Verify each route**

Run: `node --check routes/public.js` and start the server. Request every new URL and confirm HTTP 200; request an unknown URL and confirm the existing 404 response remains.

### Task 2: Internal-page visual system

**Files:**
- Create: `public/pages.css`
- Modify: `views/pages/service-page.ejs`

**Interfaces:**
- `service-page.ejs` loads `/pages.css` after `/site.css`.
- CSS owns only `.page-*` class selectors.

- [ ] **Step 1: Define page-local visual tokens and layout**

```css
.page-main { background: var(--mist, #f3f4f6); color: var(--navy-950); }
.page-hero { background: var(--navy-950); color: #fff; padding: clamp(7rem, 15vw, 12rem) 0 5rem; }
.page-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1.25rem; }
```

- [ ] **Step 2: Style cards, CTA rail, focus indicators and responsive states**

Use the existing brand palette. At `max-width: 720px`, collapse `.page-grid` to one column and preserve at least 18px horizontal padding. Add `:focus-visible` styles and a `prefers-reduced-motion` override.

- [ ] **Step 3: Verify responsive rendering**

Open one service page at 360px and 1440px. Confirm text has no horizontal overflow, buttons remain reachable, and the CTA maintains contrast.

### Task 3: Connect the new pages from existing public navigation without editing the home

**Files:**
- Modify: `views/pages/service-page.ejs`

**Interfaces:**
- Produces navigation links among the five pages and back to the existing home service anchors.

- [ ] **Step 1: Add an internal navigation strip in the new template**

Use exact links: `/coaching-organizacional`, `/formacion`, `/evaluacion-de-talento`, `/soluciones-para-empresas`, `/nosotros` and `/#servicios`.

- [ ] **Step 2: Mark the current link accessibly**

```ejs
<a href="/<%= item.slug %>" <%= item.slug === page.slug ? 'aria-current="page"' : '' %>><%= item.label %></a>
```

- [ ] **Step 3: Verify links**

Confirm each nav item lands on an existing route and the current page carries `aria-current="page"` once.

### Task 4: Seed the three researched blog articles

**Files:**
- Create: `scripts/seed-blog-posts.js`
- Modify: `package.json`

**Interfaces:**
- New command: `npm run seed:blog`.
- Each article record is passed to `db.insertBlogPost({ slug, title, excerpt, content_html, status, published_at })` only when `db.slugExists(slug)` is false.

- [ ] **Step 1: Create three complete editorial records**

Use slugs `cultura-de-coaching`, `liderazgo-en-tiempos-de-cambio`, and `nom-037-guia-practica-teletrabajo`. Each article must include an intro, 3–4 `h2` sections, a practical checklist, a restrained CTA and a source link to ICF, WHO, or STPS where relevant.

- [ ] **Step 2: Implement the idempotent seed loop**

```js
for (const post of posts) {
  if (!db.slugExists(post.slug)) db.insertBlogPost(post);
}
```

- [ ] **Step 3: Register and run the script**

```json
"seed:blog": "node scripts/seed-blog-posts.js"
```

Run `npm run seed:blog` twice. The first run must create three articles; the second must create zero.

- [ ] **Step 4: Verify public articles**

Request `/blog` and each expected `/blog/:slug`; verify visible title, date, source link and no raw HTML in the browser.

### Task 5: Smoke-test regression and documentation

**Files:**
- Modify: `README.md`

**Interfaces:**
- Documents the five new routes and `npm run seed:blog`.

- [ ] **Step 1: Add a concise README section**

List the five page URLs and explain that `npm run seed:blog` creates only missing default posts.

- [ ] **Step 2: Run syntax and route smoke checks**

Run `node --check routes/public.js`, `node --check scripts/seed-blog-posts.js`, then start the app and request `/`, `/blog`, `/admin/login`, every new page, and each new article.

- [ ] **Step 3: Review changed files**

Run `git diff --check` when the project is put under Git; until then, inspect the modified file list and ensure `views/index.ejs` and `public/site.css` are absent.

## Self-review

- Spec coverage: Tasks 1–3 cover five pages and their design; Task 4 covers three published articles; Task 5 protects the home and existing routes.
- Placeholder scan: no implementation requirement is deferred.
- Type consistency: `page` is the only new template input; `slug`, `sections`, and blog post fields match existing `db.js` APIs.
