# Coaching Organizacional Unificado Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir una página propia y visual de Coaching Organizacional que conecte liderazgo, equipos, líder coach y cultura de coaching.

**Architecture:** La ruta existente conservará el mismo slug, pero el router renderizará una vista especializada solo para Coaching Organizacional. La vista usa la cabecera, hero y footer compartidos; sus estilos y comportamiento de expansión viven en archivos propios para no afectar las otras páginas de servicio.

**Tech Stack:** Node.js, Express, EJS, CSS nativo, JavaScript del navegador y `node:test`.

## Global Constraints

- No modificar header, footer, formulario de contacto, panel administrativo ni páginas ajenas a Coaching Organizacional.
- Usar únicamente lenguaje de acompañamiento y práctica; no publicar porcentajes ni resultados garantizados sin evidencia del cliente.
- Todos los CTA llevan a `/contacto`; los accesos por audiencia incluyen un parámetro `service` para facilitar la selección.
- Las tarjetas deben funcionar con clic, teclado y pantalla táctil.
- Las animaciones se activan al entrar en viewport y respetan `prefers-reduced-motion: reduce`.
- El proyecto no tiene repositorio Git disponible; verificar con pruebas en lugar de crear commits.

---

### Task 1: Definir la ruta especializada y su contrato de contenido

**Files:**
- Modify: `routes/public.js:91-96`
- Create: `views/pages/coaching-page.ejs`
- Test: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: `getInternalPage(slug)` que devuelve el objeto `page` existente.
- Produces: `res.render('pages/coaching-page', { page })` cuando `page.slug === 'coaching-organizacional'`.

- [ ] **Step 1: Escribir la prueba que falla**

```js
test('organizational coaching renders its dedicated connected-change page', () => {
  const routes = fs.readFileSync(path.join(__dirname, '..', 'routes', 'public.js'), 'utf8');
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'coaching-page.ejs'), 'utf8');
  assert.match(routes, /page\.slug === 'coaching-organizacional'/);
  assert.match(routes, /pages\/coaching-page/);
  assert.match(page, /data-coaching-route/);
});
```

- [ ] **Step 2: Ejecutar la prueba para confirmar que falla**

Run: `npm.cmd test -- --test-name-pattern="organizational coaching renders"`

Expected: FAIL porque no existe `views/pages/coaching-page.ejs` ni el router la renderiza.

- [ ] **Step 3: Implementar el enrutamiento mínimo**

```js
if (page.slug === 'nosotros') return res.render('pages/about-page', { page });
if (page.slug === 'coaching-organizacional') return res.render('pages/coaching-page', { page });
return res.render('pages/service-page', { page });
```

Crear `coaching-page.ejs` con documento HTML, los includes `site-header`, `subpage-editorial-hero` y `site-footer`, más `<main data-coaching-route>`.

- [ ] **Step 4: Ejecutar la prueba para confirmar que pasa**

Run: `npm.cmd test -- --test-name-pattern="organizational coaching renders"`

Expected: PASS.

### Task 2: Construir la narrativa y las rutas de entrada

**Files:**
- Modify: `views/pages/coaching-page.ejs`
- Modify: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: `page` con título, intro y CTA; `site-header`, `subpage-editorial-hero` y `site-footer`.
- Produces: bloques semánticos `.coaching-challenges`, `.coaching-route`, `.coaching-process`, `.coaching-audiences` y `.coaching-final-cta`.

- [ ] **Step 1: Escribir la prueba que falla**

```js
test('organizational coaching joins all four practices and all audience entry points', () => {
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'coaching-page.ejs'), 'utf8');
  for (const label of ['Coaching ejecutivo y de liderazgo', 'Coaching sistémico de equipos', 'Líder coach', 'Cultura de coaching']) assert.ok(page.includes(label));
  for (const label of ['Empresas y RH', 'Líderes', 'Equipos y coaches internos']) assert.ok(page.includes(label));
  assert.match(page, /service=coaching-organizacional/);
  assert.match(page, /Comprender el contexto/);
  assert.match(page, /Dar seguimiento/);
});
```

- [ ] **Step 2: Ejecutar la prueba para confirmar que falla**

Run: `npm.cmd test -- --test-name-pattern="joins all four practices"`

Expected: FAIL porque la vista aún no tiene el contenido integrado.

- [ ] **Step 3: Implementar la estructura semántica**

Crear seis bloques en `coaching-page.ejs`:

```html
<section class="coaching-challenges" data-coaching-reveal>…</section>
<section class="coaching-route" aria-labelledby="coaching-route-title">…</section>
<section class="coaching-process" data-coaching-reveal>…</section>
<section class="coaching-audiences" aria-labelledby="coaching-audiences-title">…</section>
<section class="coaching-final-cta" data-coaching-reveal>…</section>
```

Las cuatro estaciones usan botones `type="button"`, `aria-expanded`, `aria-controls` y paneles con el foco, la audiencia y prácticas de cada servicio. Los tres accesos de audiencia enlazan a `/contacto?service=coaching-organizacional`.

- [ ] **Step 4: Ejecutar la prueba para confirmar que pasa**

Run: `npm.cmd test -- --test-name-pattern="joins all four practices"`

Expected: PASS.

### Task 3: Añadir diseño, interacción progresiva y accesibilidad de movimiento

**Files:**
- Create: `public/coaching-page.css`
- Create: `public/coaching-page.js`
- Modify: `views/pages/coaching-page.ejs`
- Modify: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: `[data-coaching-route-card]`, `[data-coaching-panel]` y `[data-coaching-reveal]` de la vista.
- Produces: clase `is-coaching-open` para una estación activa y `is-coaching-revealed` para elementos que entran al viewport.

- [ ] **Step 1: Escribir la prueba que falla**

```js
test('organizational coaching uses accessible route cards and scroll-aware motion', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'coaching-page.css'), 'utf8');
  const script = fs.readFileSync(path.join(__dirname, '..', 'public', 'coaching-page.js'), 'utf8');
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'coaching-page.ejs'), 'utf8');
  assert.match(page, /aria-expanded="false"/);
  assert.match(page, /data-coaching-route-card/);
  assert.match(script, /IntersectionObserver/);
  assert.match(script, /is-coaching-open/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
```

- [ ] **Step 2: Ejecutar la prueba para confirmar que falla**

Run: `npm.cmd test -- --test-name-pattern="accessible route cards"`

Expected: FAIL porque los archivos de página aún no existen.

- [ ] **Step 3: Implementar CSS y JavaScript aislados**

Enlazar ambos archivos en el `<head>` y antes de `</body>`. En CSS usar una ruta horizontal conectada en escritorio y pila vertical en móvil, tarjetas con contraste suficiente y transición breve. En JavaScript:

```js
const cards = document.querySelectorAll('[data-coaching-route-card]');
cards.forEach(card => card.addEventListener('click', () => toggleCard(card)));
cards.forEach(card => card.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleCard(card); }
}));
```

`toggleCard` actualiza `is-coaching-open`, `aria-expanded` y el atributo `hidden` del panel. Un `IntersectionObserver` revela `[data-coaching-reveal]` una sola vez. Con movimiento reducido, los elementos se muestran sin animación.

- [ ] **Step 4: Ejecutar la prueba para confirmar que pasa**

Run: `npm.cmd test -- --test-name-pattern="accessible route cards"`

Expected: PASS.

### Task 4: Verificar la página completa y evitar regresiones

**Files:**
- Test: `test/public-pages.integration.test.js`

**Interfaces:**
- Consumes: ruta `/coaching-organizacional`, recursos de la vista y servidor Express.
- Produces: evidencia de respuesta HTTP 200 y suite de regresión verde.

- [ ] **Step 1: Ejecutar la suite completa**

Run: `npm.cmd test`

Expected: PASS para todas las pruebas existentes y las tres nuevas.

- [ ] **Step 2: Verificar manualmente los puntos críticos**

Abrir `/coaching-organizacional` y comprobar: hero propio, cuatro tarjetas navegables, el primer panel abierto, los tres accesos a contacto, diseño móvil y ausencia de movimiento cuando el sistema solicita reducir movimiento.

- [ ] **Step 3: Registrar resultado de verificación**

Anotar en el resumen de entrega que no hubo cambios fuera de la ruta de Coaching Organizacional y sus recursos dedicados.
