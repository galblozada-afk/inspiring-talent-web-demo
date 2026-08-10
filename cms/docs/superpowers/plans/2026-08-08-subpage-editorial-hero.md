# Hero editorial para subpáginas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Incorporar un hero editorial reutilizable en las páginas de servicios y Nosotros, sin cambiar la página principal.

**Architecture:** Un partial EJS recibe el objeto `page` existente y renderiza texto, CTA, redes y la imagen de Airam. Una hoja CSS independiente define la composición, el círculo verde y la animación accesible. Las páginas que lo consumen conservan el header y footer compartidos.

**Tech Stack:** Node.js, Express, EJS, CSS nativo y `node:test`.

## Global Constraints

- No modificar `views/index.ejs` ni el hero de la página principal.
- No instalar dependencias ni añadir React/Tailwind.
- Reutilizar los enlaces sociales actuales del footer y mostrar `CDMX, MX`.
- Respetar `prefers-reduced-motion`.

---

### Task 1: Cubrir el contrato público del hero compartido

**Files:**
- Modify: `test/public-pages.integration.test.js`

- [ ] **Step 1: Write the failing test**

```js
test('service and about pages use an editorial Airam hero while home stays unchanged', () => {
  const service = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'service-page.ejs'), 'utf8');
  const about = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'about-page.ejs'), 'utf8');
  const home = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.ejs'), 'utf8');
  const hero = fs.readFileSync(path.join(__dirname, '..', 'views', 'partials', 'subpage-editorial-hero.ejs'), 'utf8');
  assert.match(service, /subpage-editorial-hero/);
  assert.match(about, /subpage-editorial-hero/);
  assert.match(hero, /airam-hero-nosotros\.png/);
  assert.match(hero, /CDMX, MX/);
  assert.match(hero, /aria-label="Instagram"/);
  assert.ok(!home.includes('subpage-editorial-hero'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --test-name-pattern="editorial Airam hero"`

Expected: FAIL because the partial and hero references do not exist.

### Task 2: Construir e integrar el hero

**Files:**
- Create: `views/partials/subpage-editorial-hero.ejs`
- Create: `public/subpage-editorial-hero.css`
- Create: `public/assets/img/airam-hero-nosotros.png`
- Modify: `views/pages/service-page.ejs`
- Modify: `views/pages/about-page.ejs`

- [ ] **Step 1: Add the shared semantic partial**

```ejs
<section class="subpage-editorial-hero" aria-labelledby="subpage-editorial-title">
  <div class="subpage-editorial-copy">...</div>
  <figure class="subpage-editorial-portrait">...</figure>
  <div class="subpage-editorial-title">...</div>
  <div class="subpage-editorial-meta">...</div>
</section>
```

- [ ] **Step 2: Add isolated responsive CSS**

```css
@keyframes subpage-editorial-orbit { ... }
@media (prefers-reduced-motion: reduce) { .subpage-editorial-hero * { animation: none; } }
```

- [ ] **Step 3: Include the partial and stylesheet in service pages and Nosotros**

```ejs
<link rel="stylesheet" href="/subpage-editorial-hero.css">
<%- include('../partials/subpage-editorial-hero', { page }) %>
```

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm.cmd test -- --test-name-pattern="editorial Airam hero"`

Expected: PASS.

### Task 3: Verificar la integración completa

**Files:**
- Test: `test/public-pages.integration.test.js`

- [ ] **Step 1: Run the complete suite**

Run: `npm.cmd test`

Expected: All tests pass.

- [ ] **Step 2: Review responsive and accessibility behavior**

Check one `h1` per page, readable mobile layout, accessible social links and motion fallback.
