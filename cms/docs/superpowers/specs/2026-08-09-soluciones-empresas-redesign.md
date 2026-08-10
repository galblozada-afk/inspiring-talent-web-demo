# Rediseño: Soluciones para empresas

## Objetivo

Convertir `/soluciones-para-empresas` en una página de captación visual que ayude a responsables de talento, RH y liderazgo a entender cómo Inspiring Talent conecta formación, coaching organizacional y evaluación de talento con retos reales de negocio. La página debe llevar a una conversación de contacto, sin modificar las demás páginas del sitio.

## Dirección visual

- Mantener la identidad editorial del sitio: azul profundo, menta y tipografía de alto contraste.
- Crear un hero exclusivo con una ilustración 3D de equipo y tablero de desarrollo en PNG transparente.
- Usar tres figuras geométricas de fondo en azul corporativo claro: triángulo, cuadrado y círculo. Tendrán movimiento ambiental lento y se desactivarán cuando el visitante prefiera reducir movimiento.
- Conservar header, footer y CTA compartidos.

## Estructura de la página

1. **Hero: ruta integral de talento**
   - Mensaje: el talento se mueve de forma conectada, no por iniciativas aisladas.
   - Ilustración transparente nueva y CTA a `/contacto?service=soluciones-empresas`.

2. **Tres frentes para mover la organización**
   - Desarrollo de liderazgo: talleres, bootcamps, líder coach y coaching ejecutivo.
   - Equipos y cultura: coaching de equipos, cultura de coaching, comunicación y negociación.
   - Talento y cumplimiento: evaluación, planes de desarrollo y NOM-037.
   - Cada tarjeta conduce a una conversación de contacto y ofrece una elevación suave al hover/tap.

3. **Una solución, tres palancas**
   - Selector accesible de Formación, Coaching Organizacional y Evaluación de Talento.
   - Un panel activo explica el foco, experiencias y el resultado práctico, con enlaces a las páginas de servicio correspondientes.

4. **Evidencia que orienta, no promete**
   - Párrafos editoriales con citas enlazadas a investigaciones externas.
   - Radar gráfico de cinco capacidades: liderazgo, colaboración, claridad, desarrollo y desempeño. Será una representación de conversación, sin cifras que parezcan resultados propios.
   - Gráfica de recorrido de diagnóstico a seguimiento para explicar cómo se traduce una intervención en práctica.
   - Se mostrará contexto de Gallup: los managers explican 70% de la variación del engagement de equipos y su meta-análisis de desarrollo basado en fortalezas reúne 43 estudios, 1.2 millones de empleados y 49,495 unidades de negocio.

5. **Cierre comercial**
   - Invitación: “Hagamos espacio para el cambio que tu organización necesita”.
   - Acción única: agendar una consultoría en contacto.

## Interacción y accesibilidad

- Animaciones de entrada activadas al llegar cada bloque al viewport.
- Selector operable con teclado, foco visible, roles ARIA de tabs y paneles.
- Las gráficas tendrán texto alternativo y resumen visible; no dependerán solo del color.
- `prefers-reduced-motion` elimina desplazamientos y transiciones no esenciales.
- Diseño responsivo: hero y bloques pasan a una sola columna, y las tarjetas mantienen áreas táctiles amplias.

## Archivos previstos

- Reemplazar la plantilla específica de soluciones derivada de `service-page.ejs` por una vista propia.
- Añadir CSS y JavaScript exclusivos de la página, sin alterar estilos compartidos de las demás páginas.
- Añadir la ilustración final en `public/assets/img/` y actualizar el catálogo de páginas para usarla.
- Añadir pruebas de renderizado, rutas, controles accesibles y presencia de investigación citada.

## Criterio de éxito

- La página expresa claramente las tres familias de solución y su relación.
- La evidencia se presenta con atribución y sin promesas de desempeño para clientes.
- Todos los CTA relevantes llegan a contacto.
- La nueva imagen conserva transparencia real al integrarse sobre el hero.
- El resto del sitio sigue pasando su suite de pruebas.
