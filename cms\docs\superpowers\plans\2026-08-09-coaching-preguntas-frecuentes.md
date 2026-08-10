# Preguntas frecuentes de Coaching Organizacional Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir un bloque accesible de preguntas frecuentes debajo del proceso de coaching organizacional.

**Architecture:** El HTML contendrá cinco botones de acordeón y sus paneles asociados. CSS define el tratamiento editorial y el comportamiento adaptable; JavaScript solo alterna los estados ARIA y asegura que una sola respuesta esté abierta.

**Tech Stack:** EJS, CSS y JavaScript nativo, Node test runner.

## Global Constraints

- No añadir dependencias.
- Conservar la identidad editorial azul marino, verde menta y tipografía existente.
- Mantener teclado, foco visible, `aria-expanded`, `aria-controls`, paneles `hidden` y `prefers-reduced-motion`.

---

### Task 1: Contrato de preguntas frecuentes

**Files:**
- Modify: `test/public-pages.integration.test.js`
- Modify: `views/pages/coaching-page.ejs`
- Modify: `public/coaching-page.css`
- Modify: `public/coaching-page.js`

**Interfaces:**
- Consumes: La página dedicada `views/pages/coaching-page.ejs` y su script diferido `public/coaching-page.js`.
- Produces: El selector `[data-coaching-faq-trigger]` y el panel identificado por su `aria-controls`.

- [ ] **Step 1: Write the failing test**

```js
test('coaching page answers key buyer questions with accessible accordion controls', () => {
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'coaching-page.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'coaching-page.css'), 'utf8');
  const script = fs.readFileSync(path.join(__dirname, '..', 'public', 'coaching-page.js'), 'utf8');
  assert.match(page, /Preguntas que abren una buena conversación/);
  assert.equal((page.match(/data-coaching-faq-trigger/g) || []).length, 5);
  assert.match(page, /aria-expanded="true"/);
  assert.match(script, /data-coaching-faq-trigger/);
  assert.match(css, /\.coaching-faq/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test`
Expected: FAIL because the FAQ markup, styles and interaction do not exist.

- [ ] **Step 3: Write minimal implementation**

```js
faqTriggers.forEach((trigger) => trigger.addEventListener('click', () => {
  const shouldOpen = trigger.getAttribute('aria-expanded') !== 'true';
  faqTriggers.forEach((item) => setFaqOpen(item, false));
  if (shouldOpen) setFaqOpen(trigger, true);
}));
```

Add five button/panel pairs immediately after `.coaching-process`, styled as an editorial accordion with one initially visible answer.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm.cmd test`
Expected: PASS.

- [ ] **Step 5: Commit**

Do not commit because this workspace has no Git repository configured.
