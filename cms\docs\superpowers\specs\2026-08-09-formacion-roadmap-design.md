# Roadmap de aprendizaje aplicado

## Objetivo

Convertir la sección "Aprender tiene que mover el trabajo" de Formación en una ruta visual que haga evidente cómo cada experiencia avanza desde el reto real hasta el seguimiento.

## Experiencia visual

- Se mantienen los cuatro pasos y su contenido actual.
- En escritorio, los pasos se presentan sobre un carril horizontal continuo con un nodo circular por etapa.
- Los nodos y el tramo de línea correspondiente se revelan en secuencia cuando la sección entra en pantalla.
- Las tarjetas alternan ligeramente su posición vertical para que el recorrido se lea como una progresión, no como cuatro columnas idénticas.
- La paleta se mantiene en azul marino, blanco y verde Inspiring; no se agregan imágenes ni colores ajenos a la identidad.
- En móvil, el carril se convierte en una ruta vertical, conservando el orden lógico y el contraste.

## Movimiento y accesibilidad

- La animación se activa con el mismo atributo de revelado al scroll que ya usa la página de Formación.
- Se usa CSS para la progresión; no se añade JavaScript pesado.
- `prefers-reduced-motion` deja visible toda la ruta, sin desplazamientos ni transiciones.
- La lista ordenada y los títulos continúan siendo semánticos y legibles por tecnologías de asistencia.

## Validación

- La prueba de la página de Formación verificará el carril, los cuatro hitos, los estilos responsivos y la protección de movimiento reducido.
- Se ejecutará la suite completa de pruebas tras el cambio.
