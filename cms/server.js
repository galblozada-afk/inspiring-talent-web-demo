require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const helmet = require('helmet');

require('./db'); // crea data/db.json si no existe

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';
const appRoot = __dirname.includes('netlify/functions') ? path.resolve(__dirname, '..', '..') : __dirname;

app.set('view engine', 'ejs');
app.set('views', path.join(appRoot, 'views'));

// Necesario en Render/Railway/Heroku y similares: el proxy termina el HTTPS
// y reenvía por HTTP interno, así que Express debe confiar en el header
// X-Forwarded-Proto para saber que la conexión original sí es segura.
if (isProd) app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: false // el sitio carga CDNs externos (gsap, fontawesome); ajusta esto si lo endureces luego
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const isServerless = process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT || __dirname.includes('netlify/functions') || process.cwd() === '/var/task';
const uploadRoot = isServerless ? path.join('/tmp', 'inspiring-talent-uploads') : path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });
app.use('/uploads', express.static(uploadRoot));
app.use(express.static(path.join(appRoot, 'public')));

const sessionDir = isServerless ? path.join('/tmp', 'inspiring-talent-sessions') : path.join(__dirname, 'data', 'sessions');
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });
app.use(session({
  store: new FileStore({ path: sessionDir, logFn: () => {} }),
  secret: process.env.SESSION_SECRET || 'change-this-secret-please',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProd, // en producción detrás de HTTPS, poner NODE_ENV=production
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 8 // 8 horas
  }
}));

app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/public'));

app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Netlify Functions importa la aplicación sin levantar un servidor persistente.
// En local/Render/Railway seguimos arrancando Express normalmente.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`InspiringTalent CMS corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
