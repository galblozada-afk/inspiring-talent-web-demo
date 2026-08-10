# Hero editorial para subpáginas

## Objetivo

Dar a las páginas de servicios y a Nosotros una apertura visual compartida que conecte la marca con Airam Sánchez Santos, sin modificar la página principal ni el encabezado global.

## Diseño aprobado

- El hero se renderiza después del header global existente; no crea un segundo header.
- Una columna de contexto muestra el enfoque de la página y una llamada a contacto.
- La fotografía transparente de Airam ocupa el centro, sobre un círculo verde oficial de Inspiring Talent.
- El título de cada página se presenta en gran formato editorial.
- La franja inferior reutiliza LinkedIn, Facebook e Instagram del footer y muestra `CDMX, MX`.
- La animación es solo decorativa: entrada suave y órbita/pulso lento del círculo; se desactiva para usuarios que prefieren reducir movimiento.
- Contacto conserva su hero de formulario y la portada no cambia, para preservar la conversión y la composición ya aprobada.

## Límites técnicos

- EJS y CSS nativos; sin React, Tailwind, Framer Motion ni dependencias nuevas.
- Un partial reutilizable y una hoja de estilos aislada.
- La imagen se publica desde `public/assets/img/`.
