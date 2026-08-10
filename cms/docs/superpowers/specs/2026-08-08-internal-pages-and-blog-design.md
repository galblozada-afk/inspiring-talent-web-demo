# Páginas internas y blog de InspiringTalent — diseño

## Objetivo

Completar la nueva web con cinco páginas de captación y tres artículos de blog, sin cambiar el contenido, la estructura ni el comportamiento actuales del home.

## Alcance aprobado

- Rutas públicas: `/coaching-organizacional`, `/formacion`, `/evaluacion-de-talento`, `/soluciones-para-empresas` y `/nosotros`.
- Un layout nuevo y reutilizable para las páginas internas, alineado al home: navy profundo, acento menta, tipografías Anton/Inter/Montserrat, bloques amplios, tarjetas con borde fino y CTA a WhatsApp.
- Contenido editorial basado en la web anterior, reescrito para claridad y conversión, sin afirmar certificaciones, fechas, precios o resultados que no estén confirmados.
- Tres artículos publicados en el CMS: cultura de coaching, liderazgo ante el cambio y guía práctica de NOM-037.

## Experiencia y contenido

Cada página incluirá: navegación compacta con regreso al inicio, hero con eyebrow/título/introducción/CTA, una sección de retos, módulos de servicio, metodología o proceso, un CTA final y footer consistente.

- Coaching: coaching ejecutivo y de liderazgo, cultura de coaching, coaching de equipos y líder coach.
- Formación: bootcamps, programas de formación y desarrollo continuo para coaches.
- Evaluación: DISC, Team DISC, inteligencia emocional, diagnóstico de estrés y alineación de talento; se presentarán como herramientas de evaluación, no como diagnósticos clínicos.
- Soluciones para empresas: propuesta de plan a la medida, agrupada por talleres, formación, coaching, evaluación y NOM-037.
- Nosotros: propósito, valores (aprendizaje, creatividad y compromiso) y forma de trabajo; no se inventarán biografías de personas ni acreditaciones.

## Arquitectura

`routes/public.js` centralizará un catálogo de contenido estático para las cinco rutas y renderizará `views/pages/service-page.ejs`. La vista recibirá `page`, con los campos de SEO y las secciones a mostrar. `public/pages.css` contendrá exclusivamente los estilos de las internas, apoyándose en los tokens ya definidos en `site.css`.

Los artículos se insertarán mediante un script idempotente que usa las funciones actuales de `db.js`. Cada entrada tendrá slug estable, extracto, HTML semántico, estado `published` y fecha de publicación. No se modificará ni eliminará contenido existente del blog.

## Control de calidad

- Las cinco rutas deben devolver 200 y contener un único `h1`.
- Las rutas existentes `/`, `/blog`, `/admin/login` y una entrada de blog deben seguir respondiendo correctamente.
- El script de artículos debe poder ejecutarse dos veces sin duplicados.
- La navegación y los CTA deben funcionar a 360 px y escritorio; las animaciones respetarán `prefers-reduced-motion`.
- No se tocarán `views/index.ejs`, `public/site.css`, rutas admin ni los datos existentes del home.
