# InspiringTalent — sitio + panel de administración

Sitio de InspiringTalent con un panel de administración real (backend en Node.js,
no un login simulado en el navegador) para editar:

- **Hero**: videos/imágenes de fondo, eyebrow, título, palabras que rotan y párrafo
- **Topbar**: texto y una lista de hipervínculos que tú controlas
- **Servicios**: las 3 pestañas (Formación, Coaching, Evaluación de Talento)
- **NOM-037**: título, párrafos, botón e imagen
- **Blog**: crear, editar, publicar/despublicar y borrar entradas (con `/blog` y `/blog/:slug` públicos)

El acceso al panel está en el ícono de llave 🔑 al final del footer del sitio → `/admin/login`.

---

## 1. Por qué necesita un servidor (y no basta con hosting estático)

Un login que solo vive en JavaScript del navegador se puede saltar leyendo el código
fuente — no es seguridad real. Aquí el login, las contraseñas (hasheadas con bcrypt)
y el contenido editable viven en un archivo `data/db.json` en el servidor, protegidos
por sesiones con cookies `httpOnly`. Por eso este proyecto necesita correr Node.js
en algún lado (no sirve subir solo los archivos a un hosting 100% estático).

La base de datos es un archivo JSON simple (no SQLite, no un motor externo) leído y
escrito directamente con Node — **cero dependencias nativas que compilar**. Esto es
intencional: evita el típico error de Windows/`node-gyp`/Visual Studio al hacer
`npm install` con paquetes como `better-sqlite3`. `npm install` aquí solo copia
JavaScript, nunca compila nada.

---

## 2. Instalación local

Requisitos: Node.js 18 o superior.

```bash
npm install
cp .env.example .env
```

Edita `.env`:
- `SESSION_SECRET`: genera uno único con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`: credenciales del admin (o déjalas vacías y se genera una contraseña temporal la primera vez)
- Para probar en tu máquina (sin HTTPS), deja `NODE_ENV=development`. En producción real, usa `NODE_ENV=production` (ver sección 4).

Carga el contenido inicial (el mismo que ya tenía el sitio, para no perder nada) y crea el usuario admin:

```bash
npm run seed
```

Si no pusiste `ADMIN_PASSWORD` en `.env`, la contraseña generada se imprime **una sola vez** en la consola — guárdala.

Arranca el servidor:

```bash
npm start
```

Abre:
- Sitio público: http://localhost:3000
- Blog: http://localhost:3000/blog
- Panel admin: http://localhost:3000/admin/login

## 3. Cambiar la contraseña del admin

```bash
npm run set-admin-password admin@inspiringtalent.mx "UnaPasswordLargaYSegura123"
```

## 4. Desplegarlo (producción)

Este proyecto es un servidor Node.js normal, así que corre en cualquier lugar que
soporte Node: **Render, Railway, un VPS (DigitalOcean/Hetzner/etc.), Fly.io**, etc.
No funciona en hosting 100% estático (GitHub Pages, Netlify estático) porque
necesita ejecutar código en el servidor.

Pasos generales (Render/Railway son los más simples si no tienes servidor propio):

1. Sube este proyecto a un repositorio de GitHub (usa el `.gitignore` incluido, que
   ya excluye `.env`, `node_modules` y la base de datos).
2. Crea un servicio "Web Service" apuntando al repo.
   - Build command: `npm install`
   - Start command: `npm start`
3. Configura las variables de entorno (`SESSION_SECRET`, `ADMIN_EMAIL`,
   `ADMIN_PASSWORD`, `NODE_ENV=production`) en el panel del proveedor — no subas `.env`.
4. **Importante — disco persistente**: la base de datos (`data/db.json`), las
   sesiones (`data/sessions/`) y los archivos subidos (`public/uploads/`) se
   guardan en disco. La mayoría de estos proveedores usan almacenamiento
   efímero por defecto (se borra en cada deploy), así que necesitas agregar un
   **volumen/disco persistente** montado en la carpeta del proyecto (Render:
   "Persistent Disk"; Railway: "Volumes") y apuntarlo a `data/` y
   `public/uploads/`. Si no lo haces, cada deploy nuevo reiniciaría todo el
   contenido editado.
5. Corre `npm run seed` una vez (Render/Railway permiten correr comandos "one-off" /
   shell en el servicio) para crear el usuario admin y el contenido inicial.
6. Con `NODE_ENV=production` las cookies de sesión solo viajan por HTTPS — estos
   proveedores ya dan HTTPS automático, así que no necesitas hacer nada extra
   (el `trust proxy` ya está configurado en `server.js`).

Si en vez de eso usas un VPS propio, puedes correr esto detrás de Nginx (como
proxy inverso con tu certificado HTTPS) y mantener el proceso vivo con `pm2`
(`pm2 start server.js --name inspiringtalent`).

## 5. Estructura del proyecto

```
server.js               → arranque de Express
db.js                    → base de datos en JSON puro (data/db.json) + funciones de acceso
routes/admin.js          → todas las rutas del panel (protegidas por sesión)
routes/public.js         → home + blog públicos
middleware/auth.js        → protege /admin/*
views/index.ejs           → home (el index.html original, ahora con datos dinámicos)
views/blog/               → listado y detalle del blog público
views/admin/               → todas las pantallas del panel
public/site.css            → CSS del sitio original (extraído del <style> del index.html)
public/blog.css             → estilos propios del blog, mismos colores/tipografías de marca
public/admin.css             → estilos propios del panel de administración
public/uploads/               → archivos subidos desde el panel (videos, imágenes, portadas de blog)
data/db.json                    → toda la base de datos (se crea sola al arrancar / con el seed)
data/sessions/                    → sesiones de login activas (archivo por sesión)
scripts/seed.js                     → carga contenido inicial + crea el admin
scripts/set-admin-password.js        → cambia la contraseña por terminal
```

## 6. Notas para el editor de "Contenido adicional" de Servicios y del Blog

Los campos de "Contenido adicional" (en Servicios) y "Contenido" (en Blog) aceptan
HTML directo — no es un editor visual (WYSIWYG). Si quien administra el sitio no
está familiarizado con HTML, lo más seguro es que solo edite los textos simples
(títulos, párrafos, extractos) y evite tocar esos campos, o que se le dé una
capacitación rápida de las etiquetas básicas (`<p>`, `<b>`, `<ul><li>`, `<a href="">`, `<img src="">`).

## 7. Páginas internas y artículos iniciales

Además del home, el sitio incluye estas páginas públicas:

- `/coaching-organizacional`
- `/formacion`
- `/evaluacion-de-talento`
- `/soluciones-para-empresas`
- `/nosotros`

Para crear los tres artículos editoriales iniciales del blog, ejecuta:

```bash
npm run seed:blog
```

El comando solo inserta los artículos que aún no existen, por lo que es seguro ejecutarlo más de una vez.
