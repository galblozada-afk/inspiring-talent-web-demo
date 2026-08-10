# Formación Unificada Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear una experiencia dedicada de Formación que conecte capacitación empresarial, certificación y desarrollo continuo de coaches.

**Architecture:** El slug `formacion` se separa del template genérico y carga una vista, CSS y JavaScript propios. La vista organiza contenido editorial y tres rutas de acordeón; el JavaScript sincroniza sus estados ARIA y revela secciones al scroll.

**Tech Stack:** Express, EJS, CSS y JavaScript nativo, Node test runner.

## Global Constraints

- No añadir dependencias ni alterar otras páginas.
- Conservar header/footer y todos los CTA hacia `/contacto?service=formacion`.
- Usar el hero editorial existente, la paleta azul marino/verde menta y `prefers-reduced-motion`.
- No afirmar acreditaciones, horas o requisitos específicos no confirmados.

---

### Task 1: Ruta y contrato de página dedicada

**Files:**
- Modify: `routes/public.js`
- Create: `views/pages/training-page.ejs`
- Create: `public/training-page.css`
- Create: `public/training-page.js`
- Modify: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: `getInternalPage('formacion')` y el partial `subpage-editorial-hero`.
- Produces: el selector principal `[data-training-page]` y los controles `[data-training-route-trigger]`.

- [ ] **Step 1: Write the failing test**

```js
test('training renders its dedicated applied-learning page', () => {
  const routes = fs.readFileSync(path.join(__dirname, '..', 'routes', 'public.js'), 'utf8');
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'training-page.ejs'), 'utf8');
  assert.match(routes, /page\.slug === 'formacion'/);
  assert.match(routes, /pages\/training-page/);
  assert.match(page, /APRENDER TIENE QUE MOVER EL TRABAJO/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test`
Expected: FAIL because the dedicated route and view do not exist.

- [ ] **Step 3: Write minimal implementation**

```js
if (page.slug === 'formacion') return res.render('pages/training-page', { page });
```

Create `training-page.ejs` with shared header/footer, hero and dedicated CSS/JS references.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm.cmd test`
Expected: PASS.

- [ ] **Step 5: Commit**

Do not commit because this workspace has no Git repository configured.

### Task 2: Rutas de aprendizaje y contenido de formación

**Files:**
- Modify: `views/pages/training-page.ejs`
- Modify: `public/training-page.css`
- Modify: `public/training-page.js`
- Modify: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: `[data-training-route-trigger]` with `aria-controls` targeting `.training-route-panel`.
- Produces: una experiencia con tres rutas y una sola ruta expandida a la vez.

- [ ] **Step 1: Write the failing test**

```js
assert.equal((page.match(/data-training-route-trigger/g) || []).length, 3);
assert.match(page, /Empresas y RH/);
assert.match(page, /Quiero certificarme/);
assert.match(page, /Soy coach en práctica/);
assert.match(script, /data-training-route-trigger/);
assert.match(css, /prefers-reduced-motion/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test`
Expected: FAIL because routes and interaction do not exist.

- [ ] **Step 3: Write minimal implementation**

```js
routeTriggers.forEach((trigger) => trigger.addEventListener('click', () => {
  const shouldOpen = trigger.getAttribute('aria-expanded') !== 'true';
  routeTriggers.forEach((item) => setRouteOpen(item, false));
  if (shouldOpen) setRouteOpen(trigger, true);
}));
```

Add the four-stage learning transfer rail, three expandable routes, competency mosaic, coach development quote and the “Arma tu plan” modules.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm.cmd test`
Expected: PASS.

- [ ] **Step 5: Commit**

Do not commit because this workspace has no Git repository configured.

### Task 3: Responsive polish and final CTA

**Files:**
- Modify: `public/training-page.css`
- Modify: `views/pages/training-page.ejs`
- Modify: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: CSS grid sections from Tasks 1 and 2.
- Produces: mobile stacking, scroll reveal and a CTA that persists the selected Formación service.

- [ ] **Step 1: Write the failing test**

```js
assert.match(page, /href="\/contacto\?service=formacion"/);
assert.match(css, /@media\(max-width:620px\)/);
assert.match(script, /IntersectionObserver/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test`
Expected: FAIL until the responsive and scroll behavior exist.

- [ ] **Step 3: Write minimal implementation**

Add the final CTA, mobile grids and an IntersectionObserver that adds `is-training-revealed` to `[data-training-reveal]`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm.cmd test`
Expected: PASS.

- [ ] **Step 5: Commit**

Do not commit because this workspace has no Git repository configured.
