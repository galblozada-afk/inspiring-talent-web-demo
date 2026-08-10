# Roadmap de aprendizaje aplicado Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar el proceso de aprendizaje aplicado como un roadmap visual, animado y accesible en la página de Formación.

**Architecture:** La sección existente conserva su lista ordenada y sus cuatro contenidos. El EJS añade un nodo semántico a cada etapa; `training-page.css` dibuja el carril, las tarjetas alternadas y la adaptación vertical para móvil. El atributo existente `data-training-reveal` coordina la entrada visual sin dependencias nuevas.

**Tech Stack:** Express, EJS, CSS, Node.js test runner.

## Global Constraints

- Mantener los cuatro pasos y su texto actual.
- Usar únicamente azul marino, blanco y verde de Inspiring Talent.
- Activar la progresión visual al entrar en pantalla y desactivarla con `prefers-reduced-motion`.
- No incorporar dependencias ni JavaScript nuevo para el roadmap.

---

### Task 1: Convertir la lista de transferencia en hitos de roadmap

**Files:**
- Modify: `views/pages/training-page.ejs:31-36`
- Test: `test/public-pages.integration.test.js:156-172`

**Interfaces:**
- Consumes: La lista `.training-transfer-rail` y el atributo `data-training-reveal` existentes.
- Produces: Cada `li` contiene `<i class="training-transfer-node" aria-hidden="true"></i>` para representar el hito visual.

- [ ] **Step 1: Write the failing test**

```js
assert.match(page, /training-transfer-rail[\s\S]*training-transfer-node/);
assert.match(page, /aria-label="Cómo se convierte el aprendizaje en práctica"/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --test-name-pattern="training connects all learning audiences"`

Expected: FAIL because `training-transfer-node` does not exist.

- [ ] **Step 3: Write minimal implementation**

```ejs
<li><i class="training-transfer-node" aria-hidden="true"></i><span>Contexto</span>...</li>
```

Apply the same node to all four existing list items without changing their copy.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm.cmd test -- --test-name-pattern="training connects all learning audiences"`

Expected: PASS.

### Task 2: Diseñar el carril y su progresión adaptable

**Files:**
- Modify: `public/training-page.css`
- Test: `test/public-pages.integration.test.js:156-172`

**Interfaces:**
- Consumes: `.training-transfer-rail`, `.training-transfer-node` y `.training-transfer[data-training-reveal]`.
- Produces: Un carril horizontal con segmentos verdes, nodos, tarjetas alternadas, transición de revelado y alternativa vertical para pantallas de hasta 760px.

- [ ] **Step 1: Extend the failing test**

```js
assert.match(css, /training-transfer-rail:before/);
assert.match(css, /training-transfer-node/);
assert.match(css, /@media\(max-width:760px\)[\s\S]*training-transfer-rail/);
assert.match(css, /prefers-reduced-motion: reduce[\s\S]*training-transfer/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --test-name-pattern="training connects all learning audiences"`

Expected: FAIL because the roadmap styles do not exist.

- [ ] **Step 3: Write minimal implementation**

```css
.training-transfer-rail:before{content:"";position:absolute;inset:28px 8% auto;height:2px;background:rgba(255,255,255,.28)}
.training-transfer-node{position:absolute;top:21px;width:16px;height:16px;border:4px solid var(--editorial-mint);border-radius:50%;background:var(--editorial-navy)}
.training-transfer.is-visible .training-transfer-rail:after{transform:scaleX(1)}
@media(max-width:760px){.training-transfer-rail{grid-template-columns:1fr}.training-transfer-rail:before{inset:18px auto 18px 7px;width:2px;height:auto}}
@media (prefers-reduced-motion: reduce){.training-transfer *, .training-transfer *:before, .training-transfer *:after{animation:none!important;transition:none!important}}
```

Position the alternating cards with `translateY` only on desktop; reset it on mobile.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm.cmd test -- --test-name-pattern="training connects all learning audiences"`

Expected: PASS.

### Task 3: Validar la entrega completa

**Files:**
- Test: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: El markup y CSS del roadmap terminados.
- Produces: Verificación de que la página de Formación, las demás rutas y sus elementos compartidos siguen funcionando.

- [ ] **Step 1: Run full validation**

Run: `npm.cmd test`

Expected: PASS with all tests green.

