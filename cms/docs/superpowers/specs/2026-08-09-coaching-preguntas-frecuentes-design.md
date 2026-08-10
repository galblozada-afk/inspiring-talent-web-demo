# Preguntas frecuentes de Coaching Organizacional — Diseño

## Objetivo

Resolver las dudas más importantes antes de la llamada inicial, sin interrumpir el recorrido narrativo de la página de Coaching Organizacional.

## Ubicación y contenido

La sección se colocará inmediatamente después de `coaching-process` y antes de los públicos de entrada. Tendrá el título **Preguntas que abren una buena conversación** y cinco preguntas: diferencia con consultoría/capacitación; para quién es; cómo inicia y se mide; confidencialidad; duración del proceso.

Las respuestas usarán lenguaje claro, evitarán promesas de resultados y reflejarán principios de práctica profesional: objetivo acordado, confidencialidad, reflexión y trabajo conectado con el contexto. El contenido se apoya en la definición y principios públicos de ICF sobre coaching, confidencialidad y coaching de equipos.

## Diseño e interacción

El bloque utilizará fondo claro para separar visualmente el proceso oscuro de la sección siguiente. A la izquierda aparecerá el título editorial y una breve introducción; a la derecha, acordeones de ancho completo con una línea verde de estado. Solo una respuesta podrá permanecer abierta a la vez. La primera estará abierta inicialmente para mostrar de inmediato el valor de la sección.

Los controles serán botones nativos con `aria-expanded` y `aria-controls`. El panel correspondiente utilizará `hidden`; JavaScript actualizará los estados. La transición de altura y opacidad será breve y se desactivará cuando el visitante prefiera reducir movimiento. En móvil, el bloque se apila y conserva áreas táctiles amplias.

## Archivos y verificación

- `views/pages/coaching-page.ejs`: markup semántico, textos y atributos de accesibilidad.
- `public/coaching-page.css`: composición editorial, estados y versión móvil/reduced-motion.
- `public/coaching-page.js`: comportamiento de acordeón exclusivo.
- `test/public-pages.integration.test.js`: contrato de contenido, accesibilidad y comportamiento declarativo.

## Revisión

No hay placeholders ni dependencias nuevas. El alcance se limita a la nueva sección de preguntas y respuestas de la página de coaching.
