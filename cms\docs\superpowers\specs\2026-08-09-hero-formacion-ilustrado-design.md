# Hero ilustrado para Formación

## Objetivo

Sustituir exclusivamente la imagen central del hero de Formación por una ilustración 3D de una sesión de aprendizaje, visualmente coherente con Inspiring Talent y preparada para el layout editorial ya existente.

## Diseño aprobado

- La escena tendrá una facilitadora o facilitador y un equipo en sesión, con una tablet visible que muestre el símbolo de Inspiring Talent sin texto generado.
- La paleta prioriza azul marino, verde menta y teal, con acentos cálidos discretos para conservar profundidad humana.
- Se generará sobre fondo cromático uniforme para convertirla en PNG transparente y superponerla sobre el hero.
- El hero de Formación usará triángulos de contorno en vez del círculo de fondo. Los triángulos se ubican alrededor de la ilustración y su base se alinea visualmente con el eje de los iconos sociales.
- Los triángulos tendrán movimiento ambiental ligero y respetarán `prefers-reduced-motion`.

## Alcance y verificación

- No se modifican los heroes de Inicio, Nosotros ni Coaching Organizacional.
- Se preservan título, CTA y enlaces actuales del hero de Formación.
- La imagen tendrá texto alternativo útil y carga diferida cuando corresponda.
- Las pruebas existentes deberán comprobar que Formación referencia el nuevo recurso y que el CSS contiene la composición triangular con alternativa de movimiento reducido.
