# Biblioteca de Coaching Organizacional Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir las cuatro tarjetas de la ruta conectada en cuatro libros interactivos independientes, con información expandible y accesible.

**Architecture:** Se conserva la estructura EJS y el contenido existente, pero cada `article` adopta una portada de libro y un panel de ficha editorial. CSS crea el volumen 3D sin dependencias y JavaScript reutiliza los atributos `aria-expanded` y `aria-controls` para alternar el libro activo.

**Tech Stack:** EJS, CSS nativo, JavaScript nativo y `node:test`.

## Global Constraints

- No instalar React, Tailwind, shadcn ni `react-pageflip`: el proyecto usa Express/EJS/CSS/JavaScript nativo.
- Reutilizar el contenido y los atributos accesibles de las cuatro tarjetas actuales.
- Adaptar únicamente `views/pages/coaching-page.ejs`, `public/coaching-page.css`, `public/coaching-page.js` y la prueba de integración correspondiente.
- Conservar la ruta, header, footer, hero, secciones posteriores y CTA existentes.
- Los libros funcionan con clic, Enter y Espacio; bajo `prefers-reduced-motion: reduce` no deben aplicar transiciones.
- El proyecto no tiene repositorio Git disponible; verificar con pruebas en lugar de crear commits.

---

### Task 1: Marcar las cuatro tarjetas como libros editoriales

**Files:**
- Modify: `views/pages/coaching-page.ejs`
- Modify: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: cuatro `article.coaching-route-card` y sus botones `[data-coaching-route-card]`.
- Produces: clase `coaching-book`, elementos `.coaching-book-cover`, `.coaching-book-spine` y `.coaching-book-sheet` para cada práctica.

- [ ] **Step 1: Escribir la prueba que falla**

```js
test('organizational coaching presents four independent editorial books', () => {
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'coaching-page.ejs'), 'utf8');
  assert.equal((page.match(/class="coaching-book/g) || []).length, 4);
  assert.match(page, /coaching-book-cover/);
  assert.match(page, /coaching-book-spine/);
  assert.match(page, /coaching-book-sheet/);
});
```

- [ ] **Step 2: Ejecutar la prueba para confirmar que falla**

Run: `npm.cmd test -- --test-name-pattern="four independent editorial books"`

Expected: FAIL porque las tarjetas aún no incluyen la anatomía visual de un libro.

- [ ] **Step 3: Implementar la estructura mínima**

Para cada uno de los cuatro `article`, agregar `coaching-book` a la clase y envolver el disparador y panel con:

```html
<span class="coaching-book-spine" aria-hidden="true"></span>
<button class="coaching-book-cover" data-coaching-route-card>…</button>
<div class="coaching-book-sheet" data-coaching-panel>…</div>
```

Conservar los nombres, contenido y atributos ARIA actuales.

- [ ] **Step 4: Ejecutar la prueba para confirmar que pasa**

Run: `npm.cmd test -- --test-name-pattern="four independent editorial books"`

Expected: PASS.

### Task 2: Diseñar los libros y su disposición responsive

**Files:**
- Modify: `public/coaching-page.css`
- Modify: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: `.coaching-book`, `.coaching-book-cover`, `.coaching-book-spine`, `.coaching-book-sheet`, `.is-coaching-open`.
- Produces: portadas con lomo, sombra, profundidad y una ficha visible para el libro activo.

- [ ] **Step 1: Escribir la prueba que falla**

```js
test('coaching books use a native 3D cover treatment with reduced-motion support', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'coaching-page.css'), 'utf8');
  assert.match(css, /\.coaching-book-cover\{/);
  assert.match(css, /transform-style:preserve-3d/);
  assert.match(css, /\.coaching-book-spine\{/);
  assert.match(css, /\.coaching-book\.is-coaching-open/);
  assert.match(css, /@media\s*\(prefers-reduced-motion: reduce\)/);
});
```

- [ ] **Step 2: Ejecutar la prueba para confirmar que falla**

Run: `npm.cmd test -- --test-name-pattern="native 3D cover treatment"`

Expected: FAIL porque aún no hay estilos de libros.

- [ ] **Step 3: Implementar estilos aislados**

Crear cuatro variantes de portada con variables por libro. La cubierta tiene sombra, rotación leve, lomo visual y transición de apertura. `is-coaching-open` abre la ficha y reduce la rotación. En pantalla pequeña, `coaching-route-grid` usa una columna y la ficha ocupa todo el ancho.

- [ ] **Step 4: Ejecutar la prueba para confirmar que pasa**

Run: `npm.cmd test -- --test-name-pattern="native 3D cover treatment"`

Expected: PASS.

### Task 3: Ajustar la interacción y verificar regresiones

**Files:**
- Modify: `public/coaching-page.js`
- Modify: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: botones `[data-coaching-route-card]` y paneles referidos por `aria-controls`.
- Produces: un único libro activo con `is-coaching-open`, panel visible y `aria-expanded` sincronizado.

- [ ] **Step 1: Escribir la prueba que falla**

```js
test('coaching book interaction keeps one accessible active book at a time', () => {
  const script = fs.readFileSync(path.join(__dirname, '..', 'public', 'coaching-page.js'), 'utf8');
  assert.match(script, /closest\('\.coaching-book'\)/);
  assert.match(script, /classList\.toggle\('is-coaching-open'/);
  assert.match(script, /setAttribute\('aria-expanded'/);
});
```

- [ ] **Step 2: Ejecutar la prueba para confirmar que falla**

Run: `npm.cmd test -- --test-name-pattern="one accessible active book"`

Expected: FAIL porque el script actual busca la clase de tarjeta anterior.

- [ ] **Step 3: Implementar la compatibilidad con libros**

Actualizar `setOpen` para obtener el contenedor con `trigger.closest('.coaching-book')`, mantener el cierre de los demás libros y conservar el comportamiento de clic con botones nativos.

- [ ] **Step 4: Ejecutar la suite completa**

Run: `npm.cmd test`

Expected: PASS para todas las pruebas existentes y las tres nuevas.
