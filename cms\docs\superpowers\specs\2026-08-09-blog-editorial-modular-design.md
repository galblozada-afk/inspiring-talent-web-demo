# Blog editorial modular

## Objetivo

Convertir el blog de Inspiring Talent en una experiencia editorial que permita descubrir contenido por tema y formato, y que dé al equipo administrativo una publicación visual sin depender de herramientas externas.

## Alcance aprobado

### Badges obligatorios y administrables

- El administrador podrá crear, editar y eliminar badges.
- Cada badge tendrá: nombre, tipo (`Tema` o `Formato`) y color de acento.
- Formatos iniciales sugeridos: `Video`, `Guía` y `Caso práctico`.
- Cada entrada deberá conservar, al menos, un badge antes de poder publicarse.
- Un artículo podrá tener varios badges de ambos tipos.

### Editor de artículos

- Se mantiene portada, título, extracto, contenido y estado de publicación.
- Se agrega un campo de URL de YouTube. Solo se aceptarán URLs de YouTube válidas y se guardará el identificador del video normalizado.
- Se agrega una galería de imágenes con carga desde el dispositivo actual. Cada elemento llevará orden, texto alternativo y acción para eliminarlo.
- Las cargas se limitarán a JPG, PNG y WebP y seguirán las convenciones actuales de la carpeta de subidas.

### Blog público

- Una zona editorial de filtros mostrará los badges disponibles y un buscador por título/extracto.
- Las tarjetas publicadas mostrarán los badges asociados y un indicador de video cuando corresponda.
- La búsqueda y los filtros podrán combinarse y anunciarán de forma legible el número de resultados.
- En el detalle del artículo se mostrará el video, si existe, y la galería, si existen imágenes.

### Galería accesible

- Controles anterior, siguiente e indicadores para abrir una imagen concreta.
- Compatible con teclado, tap y deslizamiento táctil.
- Sin reproducción automática.
- El texto alternativo se mostrará como descripción de la imagen activa.
- Se respetará `prefers-reduced-motion`.

## Arquitectura

- Se ampliará el almacenamiento JSON existente con colecciones para badges, relaciones entrada-badge y elementos de galería.
- Las rutas públicas entregarán artículos con sus badges, video y galería.
- Las rutas del panel incluirán administración de badges y formularios de artículo ampliados.
- Las imágenes de galería se gestionarán como carga múltiple y se guardarán bajo las subidas de blog.
- La plantilla y el JavaScript del blog leerán datos ya preparados por el servidor, sin exponer lógica administrativa al visitante.

## Validaciones y compatibilidad

- Una publicación con cero badges se rechazará y explicará el motivo en el panel.
- Las URLs no compatibles de YouTube se rechazarán; se aceptarán los enlaces de video habituales y sus variantes cortas.
- Una entrada existente, sin nuevos datos, seguirá visualizándose sin error.
- Eliminar un badge que esté en uso requerirá primero quitarlo de las entradas asociadas o elegir una opción explícita para desvincularlo.
- Las entradas en borrador no se mostrarán en la búsqueda pública.

## Diseño visual

- Dirección editorial coherente con Inspiring Talent: azul profundo, verde menta y tipografía de alto contraste.
- Los badges funcionarán como chips sobrios: útiles para orientar, sin competir con el título.
- La galería será un panel visual de una imagen a la vez con controles visibles y transiciones suaves, no un carrusel que distraiga.
- En móvil, filtros, buscador y galería conservarán controles táctiles amplios.

## Pruebas de aceptación

1. El panel permite crear badges de tema y formato.
2. No se publica una entrada sin badges.
3. Los badges se guardan y aparecen tanto en la tarjeta como en el artículo.
4. El filtrado y búsqueda actualizan los resultados sin recargar la página.
5. Una URL válida de YouTube renderiza un reproductor con dimensiones seguras; una inválida se rechaza.
6. Se pueden subir varias imágenes, reordenarlas y eliminarlas.
7. La galería puede usarse con teclado, tap y botones; no inicia movimiento por sí sola.
8. Las entradas existentes y todas las rutas actuales siguen funcionando.
