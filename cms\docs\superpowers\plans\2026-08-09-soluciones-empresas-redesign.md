# Soluciones para empresas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/soluciones-para-empresas` as a dedicated, visual and evidence-led lead-generation page with a transparent custom hero illustration.

**Architecture:** Add a dedicated EJS page selected by the existing public route, keeping metadata in `content/internal-pages.js`. Place the page-specific layout, interactions and animation in isolated CSS/JS files. Use inline SVG for the radar and journey charts so they remain accessible, responsive and dependency-free.

**Tech Stack:** Node.js, Express, EJS, vanilla JavaScript, CSS, Node test runner, PNG hero asset.

## Global Constraints

- Preserve shared header, footer, navigation and all routes outside `/soluciones-para-empresas`.
- All commercial CTAs must go to `/contacto?service=soluciones-empresas`.
- Cite external research with descriptive outbound links and do not present external outcomes as client results.
- Use only the page palette: deep navy, white, mint and corporate light blue for geometric background figures.
- The hero PNG must include an alpha channel and be stored under `public/assets/img/`.
- Interactive tabs must support keyboard operation, focus states and `prefers-reduced-motion`.

---

### Task 1: Route dedicated page and publishable content

**Files:**
- Modify: `content/internal-pages.js`
- Modify: `routes/public.js`
- Test: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: `getInternalPage(pageSlug)` from `content/internal-pages.js`.
- Produces: `GET /soluciones-para-empresas` renders `pages/solutions-page` with `page` metadata.

- [ ] **Step 1: Write the failing test**

```js
test('solutions for companies renders its dedicated visual consultation page', () => {
  const routes = fs.readFileSync(path.join(__dirname, '..', 'routes', 'public.js'), 'utf8');
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'solutions-page.ejs'), 'utf8');
  assert.match(routes, /page\.slug === 'soluciones-para-empresas'/);
  assert.match(page, /solutions-hero/);
  assert.match(page, /contacto\?service=soluciones-empresas/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --test-name-pattern="solutions for companies renders"`

Expected: FAIL because `views/pages/solutions-page.ejs` does not exist.

- [ ] **Step 3: Add dedicated route branch and hero copy**

```js
if (page.slug === 'soluciones-para-empresas') return res.render('pages/solutions-page', { page });
```

Update the solution page record title to `El talento se mueve en conjunto`, set the hero image to `/assets/img/solutions-enterprise-hero.png`, and retain the three approved solution families: liderazgo, equipos y cultura, talento y cumplimiento.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm.cmd test -- --test-name-pattern="solutions for companies renders"`

Expected: PASS.

### Task 2: Create the transparent enterprise hero visual

**Files:**
- Create: `public/assets/img/solutions-enterprise-hero.png`
- Test: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: hero image path declared in the solutions page metadata.
- Produces: opaque subject with transparent background at least 1024 pixels wide.

- [ ] **Step 1: Write the failing test**

```js
const image = fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'img', 'solutions-enterprise-hero.png'));
assert.ok(image.readUInt32BE(16) >= 1024);
assert.equal(image.toString('ascii', 1, 4), 'PNG');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --test-name-pattern="solutions for companies renders"`

Expected: FAIL because the hero asset is absent.

- [ ] **Step 3: Generate, key and validate the image**

Generate a polished 3D illustration of a diverse corporate team around a floating planning board that joins leadership, learning and talent insights. Generate over flat #ff00ff, remove the chroma key with the supplied imagegen helper, verify alpha corners, and save the final PNG to the stated path.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm.cmd test -- --test-name-pattern="solutions for companies renders"`

Expected: PASS.

### Task 3: Build the dedicated visual solutions page

**Files:**
- Create: `views/pages/solutions-page.ejs`
- Create: `public/solutions-page.css`
- Test: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: `page` route metadata, shared `site-header` and `site-footer` partials, transparent hero asset.
- Produces: semantic hero, three solution cards, interactive service tabs, evidence section with SVG graphics, and closing CTA.

- [ ] **Step 1: Write the failing test**

```js
assert.match(page, /class="solutions-hero"/);
assert.match(page, /solutions-shape--triangle/);
assert.match(page, /solutions-shape--square/);
assert.match(page, /solutions-shape--circle/);
assert.match(page, /role="tablist"/);
assert.match(page, /id="solutions-radar"/);
assert.match(page, /Gallup/);
assert.match(page, /1\.2 millones de empleados/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --test-name-pattern="solutions for companies renders"`

Expected: FAIL because the hero, geometry, controls and evidence content are absent.

- [ ] **Step 3: Implement semantic page composition**

Create sections in this order:

```html
<main class="solutions-page" id="contenido">
  <section class="solutions-hero">...</section>
  <section class="solutions-pillars">...</section>
  <section class="solutions-mix">...</section>
  <section class="solutions-evidence">...</section>
  <section class="solutions-cta">...</section>
</main>
```

Include the three approved cards and a three-tab control whose panels explain Formation, Coaching and Evaluation. Link the research statements to Gallup sources with `target="_blank" rel="noopener"`. Include a labelled inline SVG radar and a labelled progress journey SVG, plus visible explanatory text.

- [ ] **Step 4: Add the isolated responsive visual system**

Define page-local tokens, asymmetric hero grid, figure shapes in light corporate blue, card hover/focus treatment, chart styling and responsive one-column breakpoint. Add animations guarded by:

```css
@media (prefers-reduced-motion: reduce){
  .solutions-page *, .solutions-page *::before, .solutions-page *::after{animation:none!important;transition:none!important}
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm.cmd test -- --test-name-pattern="solutions for companies renders"`

Expected: PASS.

### Task 4: Add accessible tab, scroll-reveal and chart progress behavior

**Files:**
- Create: `public/solutions-page.js`
- Modify: `views/pages/solutions-page.ejs`
- Test: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: `[data-solutions-tab]`, `[data-solutions-panel]` and `[data-solutions-reveal]` nodes.
- Produces: keyboard-operable tab panels and one-time scroll-based visual reveals.

- [ ] **Step 1: Write the failing test**

```js
const script = fs.readFileSync(path.join(__dirname, '..', 'public', 'solutions-page.js'), 'utf8');
assert.match(script, /IntersectionObserver/);
assert.match(script, /ArrowRight/);
assert.match(script, /aria-selected/);
assert.match(script, /is-solutions-visible/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --test-name-pattern="solutions for companies renders"`

Expected: FAIL because the interaction file is absent.

- [ ] **Step 3: Implement native interaction**

Use click and `ArrowRight`/`ArrowLeft`/`Home`/`End` handlers to select one tab, update `aria-selected`, `tabindex`, `hidden`, and `is-active`. Use an `IntersectionObserver` to add `is-solutions-visible` one time to reveal and chart nodes. Do not add a dependency.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm.cmd test -- --test-name-pattern="solutions for companies renders"`

Expected: PASS.

### Task 5: Full regression verification

**Files:**
- Test: `test/internal-pages.test.js`
- Test: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: all public templates and site route tests.
- Produces: verified dedicated solutions page without regressions.

- [ ] **Step 1: Run the full suite**

Run: `npm.cmd test`

Expected: all tests pass with zero failures.

- [ ] **Step 2: Inspect the hero asset alpha and page markup**

Run: `node -e "const fs=require('fs');const b=fs.readFileSync('public/assets/img/solutions-enterprise-hero.png');if(b.readUInt32BE(16)<1024)throw Error('hero demasiado pequeño')"`

Expected: command exits with code 0 and the hero remains a project-local PNG asset.

## Self-review

- Spec coverage: Tasks 1-2 cover routing and transparent visual; Task 3 covers cards, selector, research, radar, journey and CTA; Task 4 covers motion and accessibility; Task 5 validates no regressions.
- Placeholder scan: no TODOs or incomplete tasks remain.
- Type consistency: page metadata flows as `page`; all dynamic DOM selectors are defined in Tasks 3-4.
