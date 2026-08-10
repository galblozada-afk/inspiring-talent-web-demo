# Biblioteca de Coaching Organizacional

## Objetivo

Sustituir la cuadrícula de tarjetas de la sección "Una ruta conectada" por cuatro libros independientes que representen los niveles de acompañamiento de Inspiring Talent: liderazgo ejecutivo, equipos sistémicos, líder coach y cultura de coaching.

## Experiencia

- Cada libro aparece como una portada editorial con lomo y profundidad, usando azul marino, verde oficial, blanco y acentos derivados de la identidad visual existente.
- Al seleccionar un libro, este pasa a ser el libro activo y abre su ficha de contenido: para quién es, foco y práctica.
- El contenido de los otros libros se cierra al abrir uno nuevo; seleccionar el libro activo lo cierra.
- Los botones mantienen `aria-expanded` y `aria-controls`; se activan con clic, Enter y Espacio por ser botones nativos.
- En móvil, los libros se muestran como una pila legible y la ficha se abre debajo de la portada seleccionada.
- Las transiciones son breves y se desactivan bajo `prefers-reduced-motion: reduce`.

## Alcance técnico

- No instalar React, Tailwind, shadcn ni `react-pageflip`: el proyecto usa Express/EJS/CSS/JavaScript nativo.
- Reutilizar el contenido y los atributos accesibles de las cuatro tarjetas actuales.
- Adaptar únicamente `views/pages/coaching-page.ejs`, `public/coaching-page.css`, `public/coaching-page.js` y la prueba de integración correspondiente.
- Conservar la ruta, header, footer, hero, secciones posteriores y CTA existentes.

## Verificación

- La prueba debe confirmar las cuatro portadas y las etiquetas de contenido.
- La prueba debe confirmar la clase de libro activo, los atributos accesibles y el modo de movimiento reducido.
- Ejecutar `npm.cmd test` al finalizar.
