# Hero ilustrado de Formación Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el visual central del hero de Formación por una ilustración propia y usar triángulos animados como fondo editorial.

**Architecture:** La vista de Formación seguirá usando el hero compartido, pero expondrá una variante de imagen para que el parcial elija el nuevo recurso solo para esa página. Los triángulos se estilizarán en CSS del hero compartido con una clase específica, protegiendo el resto de los heroes.

**Tech Stack:** Node.js, Express, EJS, CSS, Node test runner y PNG optimizado.

## Global Constraints

- No modificar los heroes de Inicio, Nosotros ni Coaching Organizacional.
- Mantener los enlaces, título y CTA existentes de Formación.
- La ilustración nueva debe llegar al repositorio como PNG con fondo transparente.
- La animación debe desactivarse con `prefers-reduced-motion`.

---

### Task 1: Proteger el contrato del hero de Formación

**Files:**
- Modify: `test/public-pages.integration.test.js`
- Modify: `views/pages/training-page.ejs`
- Modify: `views/partials/subpage-editorial-hero.ejs`

**Interfaces:**
- Consumes: el objeto `page` definido para la ruta `/formacion`.
- Produces: `heroImage` y `heroVariant` opcionales para el parcial editorial.

- [ ] **Step 1: Write the failing test**

```js
test('training hero uses its dedicated illustration and triangular scene', () => {
  const page = readFileSync('views/pages/training-page.ejs', 'utf8');
  const hero = readFileSync('views/partials/subpage-editorial-hero.ejs', 'utf8');
  const css = readFileSync('public/subpage-editorial-hero.css', 'utf8');
  assert.match(page, /heroImage:\s*'\/assets\/img\/formacion-hero-ilustrado\.png'/);
  assert.match(page, /heroVariant:\s*'training-triangles'/);
  assert.match(hero, /heroImage/);
  assert.match(css, /training-triangles/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --test-name-pattern="training hero uses its dedicated illustration"`

Expected: FAIL because the dedicated image and variant are absent.

- [ ] **Step 3: Write minimal implementation**

```ejs
<%- include('../partials/subpage-editorial-hero', {
  page,
  heroImage: '/assets/img/formacion-hero-ilustrado.png',
  heroVariant: 'training-triangles'
}) %>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm.cmd test -- --test-name-pattern="training hero uses its dedicated illustration"`

Expected: PASS.

### Task 2: Generar, integrar y animar la ilustración

**Files:**
- Create: `public/assets/img/formacion-hero-ilustrado.png`
- Modify: `public/subpage-editorial-hero.css`
- Test: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: `heroVariant === 'training-triangles'` en el contenedor del hero.
- Produces: escena visual de Formación con tres triángulos de fondo alineados al pie social.

- [ ] **Step 1: Add the CSS expectation to the failing test**

```js
assert.match(css, /@media\(prefers-reduced-motion: reduce\)[\s\S]*training-triangles/);
assert.match(css, /training-triangle-float/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --test-name-pattern="training hero uses its dedicated illustration"`

Expected: FAIL because the triangle motion is absent.

- [ ] **Step 3: Add the visual implementation**

```css
.editorial-hero.training-triangles .editorial-hero-orbit { border-radius: 0; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
@keyframes training-triangle-float { 50% { transform: translate3d(0,-12px,0) rotate(2deg); } }
```

Generate the PNG as a transparent-background 3D illustration, add it as `formacion-hero-ilustrado.png`, and use it only through the Training hero override.

- [ ] **Step 4: Run full verification**

Run: `npm.cmd test`

Expected: all tests PASS.
