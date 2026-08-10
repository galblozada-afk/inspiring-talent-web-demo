# Formación Unificada — Diseño

## Objetivo

Convertir `/formacion` en una página editorial independiente que reúna la oferta histórica de Inspiring Talent para empresas, personas que buscan certificarse y coaches en práctica. Debe explicar cómo el aprendizaje se lleva al trabajo, no funcionar como un catálogo aislado.

## Audiencia y narrativa

La página mantiene el peso de tres audiencias: empresas/RH, personas que quieren certificarse y coaches que buscan mentoría o supervisión. La narrativa es: competencia relevante → práctica en contexto → aplicación observable → acompañamiento.

## Secciones

1. Hero editorial compartido de Formación con el mensaje “Competencias que se convierten en acción”.
2. Una franja oscura “Aprender tiene que mover el trabajo” con cuatro etapas visuales: contexto, práctica, aplicación y seguimiento.
3. Tres rutas expandibles: empresas, certificación y coaches en práctica. Solo una se abre a la vez; la primera queda abierta.
4. Mosaico de competencias para formación empresarial: liderazgo, comunicación, inteligencia emocional, negociación, coordinación, servicio y resiliencia.
5. Bloque de formación continua para coaches con cita de Airam, mentoría, supervisión y práctica reflexiva.
6. Constructor editorial “Arma tu plan” con tres piezas combinables: reto, personas y experiencia.
7. CTA final hacia `/contacto?service=formacion`.

## Interacción y accesibilidad

Las rutas usan botones nativos con `aria-expanded`, `aria-controls` y paneles `hidden`; una sola ruta queda abierta. Las secciones se revelan al entrar en viewport y los patrones animados se detienen bajo `prefers-reduced-motion`. No se publican acreditaciones, horas o requisitos específicos que no estén confirmados por Inspiring Talent.

## Archivos

- `routes/public.js`: el slug `formacion` renderiza la página dedicada.
- `views/pages/training-page.ejs`: estructura y contenido de la experiencia.
- `public/training-page.css`: identidad, responsive y movimiento.
- `public/training-page.js`: rutas expandibles y revelado al scroll.
- `test/public-pages.integration.test.js`: contrato de ruta, contenido y accesibilidad.

## Revisión

El diseño se limita a la página de Formación. Conserva header/footer compartidos, los enlaces de contacto y la imagen editorial de Airam; no modifica Coaching, Evaluación ni los datos del CMS.
