# Hero de Formación editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar contexto y CTA bajo el título del hero de Formación sin mover la ilustración ni sus triángulos animados.

**Architecture:** La vista pasará una variante de composición al parcial editorial, que reutilizará el mismo contenido existente en una tarjeta contextual. El CSS de Formación definirá la retícula y el comportamiento responsive sin cambiar los estilos de los otros heroes.

**Tech Stack:** Express, EJS, CSS y Node test runner.

## Global Constraints

- Conservar la posición, la imagen y la animación de los triángulos de Formación.
- Mantener el contenido y enlace del CTA existente.
- No alterar heroes de Inicio, Nosotros o Coaching.
- En móvil conservar el flujo vertical y accesible.

---

### Task 1: Agrupar el contenido del hero de Formación

**Files:**
- Modify: `views/pages/training-page.ejs`
- Modify: `views/partials/subpage-editorial-hero.ejs`
- Modify: `public/training-hero.css`
- Test: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: `heroVariant: 'training-triangles'` y el objeto `page`.
- Produces: un bloque `.training-hero-context-card` debajo del título con el rótulo, descripción y CTA.

- [ ] **Step 1: Write the failing test**

```js
assert.match(hero, /training-hero-context-card/);
assert.match(css, /training-triangles \.training-hero-context-card/);
assert.match(css, /@media\(max-width:620px\)[\s\S]*training-hero-context-card/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --test-name-pattern="training hero uses its dedicated illustration"`

Expected: FAIL because the context card does not exist.

- [ ] **Step 3: Implement the editorial card and layout**

```ejs
<div class="training-hero-context-card">
  <span class="subpage-editorial-kicker"><%= page.eyebrow %></span>
  <p><%= page.intro %></p>
  <a class="subpage-editorial-cta" href="/contacto">Agenda una consultoría <span aria-hidden="true">→</span></a>
</div>
```

For the training variant, move the card to the title column beneath the title and make the original left copy visually unavailable only after its content has been moved.

- [ ] **Step 4: Run verification**

Run: `npm.cmd test`

Expected: all tests PASS.
