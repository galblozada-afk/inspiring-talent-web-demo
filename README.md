# Inspiring Talent web demo

Sitio web y CMS de Inspiring Talent. El proyecto reúne la experiencia pública de la marca con un panel de administración para actualizar contenido sin editar código.

## Estructura

- cms/: aplicación Express, vistas EJS, estilos, assets y panel administrativo.
- cms/netlify/functions/: adaptador serverless para el demo en Netlify.
- netlify.toml: configuración de build, funciones y rutas.

## Uso local

```bash
cd cms
npm install
npm run seed
npm run seed:blog
npm start
```

Sitio: http://localhost:3000 · Panel: http://localhost:3000/admin/login

## Despliegue

El demo de Netlify usa Netlify Functions para ejecutar Express. Para producción se recomienda almacenamiento persistente.
