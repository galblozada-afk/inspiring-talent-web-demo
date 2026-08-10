require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../db');

// ---------- 1. Admin user ----------
if (db.countAdmins() === 0) {
  const email = process.env.ADMIN_EMAIL || 'admin@inspiringtalent.mx';
  let password = process.env.ADMIN_PASSWORD;
  let generated = false;
  if (!password) {
    password = crypto.randomBytes(9).toString('base64url');
    generated = true;
  }
  const hash = bcrypt.hashSync(password, 12);
  db.insertAdmin(email, hash);
  console.log('\n=== Usuario admin creado ===');
  console.log('Email:   ', email);
  if (generated) {
    console.log('Password:', password, '  (generada automáticamente, cámbiala con: npm run set-admin-password)');
  } else {
    console.log('Password: (la definida en ADMIN_PASSWORD del .env)');
  }
  console.log('============================\n');
} else {
  console.log('Usuario admin ya existe, no se creó ninguno nuevo.');
}

// ---------- 2. Hero media (videos originales) ----------
if (db.listHeroMedia().length === 0) {
  db.insertHeroMedia('video', '/assets/video/hero-1.mp4');
  db.insertHeroMedia('video', '/assets/video/hero-2.mp4');
  db.insertHeroMedia('video', '/assets/video/hero-3.mp4');
  console.log('Hero: videos por defecto insertados.');
}

// ---------- 3. Hero text ----------
if (db.getSetting('hero_text') === undefined) {
  db.setSetting('hero_text', {
    eyebrow: 'Consultoría en desarrollo de talento',
    headline_prefix: 'Hacer que las cosas sucedan hace la diferencia',
    cycle_words: ['en liderazgo', 'en equipos', 'en cultura', 'en desempeño', 'en resiliencia'],
    lede: 'Somos un equipo de profesionales con experiencia comprobada en el comportamiento humano. Apoyamos a personas y empresas a lograr eficiencia y productividad por medio del aprendizaje.'
  });
  console.log('Hero: texto por defecto insertado.');
}

// ---------- 4. Topbar ----------
if (db.getSetting('topbar_text') === undefined) {
  db.setSetting('topbar_text', '<b>+20 años</b>&nbsp; de experiencia en consultoría de talento &nbsp;·&nbsp; Programa de cumplimiento <b>NOM-037</b> ya disponible');
}

// ---------- 5. Servicios (3 tabs originales) ----------
if (db.listServiceTabs().length === 0) {
  db.insertServiceTab({
    tab_key: 'formacion',
    sort_order: 0,
    number_label: '01',
    tab_label: 'Formación',
    heading: 'Desarrollo de competencias profesionales, indispensables para el futuro',
    description: 'Bootcamps de habilidades blandas con sesiones teóricas y prácticas, más acompañamiento personalizado a través de coaching 1:1 y mentoría. Contenido adaptado a los objetivos de cada empresa.',
    body_html: `<div class="subgroup-title">a. Bootcamps</div>
<ul class="taglist">
  <li>Comunicación asertiva</li>
  <li>Liderazgo</li>
  <li>Flexibilidad (adaptabilidad)</li>
  <li>Toma de decisiones y negociación</li>
  <li>Manejo de conflicto</li>
  <li>Resolución de problemas</li>
  <li>Colaboración y trabajo en equipo</li>
  <li>Gestión del tiempo</li>
  <li>Resiliencia</li>
  <li>Inteligencia emocional</li>
</ul>
<div class="subgroup-title">b. Programas de formación</div>
<ul class="taglist">
  <li>Líder Coach</li>
  <li>Certificación en Coaching de Equipos</li>
  <li>Certificación Internacional en Coaching Organizacional</li>
  <li>Mentor Coach</li>
</ul>`,
    media_image: '/assets/img/program-formacion.jpg',
    media_badge_image: '/assets/img/program-certificacion.jpg'
  });

  db.insertServiceTab({
    tab_key: 'coaching',
    sort_order: 1,
    number_label: '02',
    tab_label: 'Coaching Organizacional',
    heading: 'Experiencias transformadoras para liderar el cambio',
    description: 'Adaptarse e innovar es esencial para sobrevivir, y los líderes requieren aprender más rápido y mejor. Desarrollamos servicios que mejoran la productividad individual y la de los equipos de trabajo.',
    body_html: `<ul class="taglist">
  <li>Coaching Ejecutivo</li>
  <li>Coaching de Equipos</li>
  <li>Coaching Organizacional</li>
  <li>Creación de Cultura de Coaching</li>
  <li>Programas de mentoría y supervisión</li>
</ul>`,
    media_image: '/assets/img/program-coaching.jpg',
    media_badge_image: null
  });

  db.insertServiceTab({
    tab_key: 'evaluacion',
    sort_order: 2,
    number_label: '03',
    tab_label: 'Evaluación de Talento',
    heading: 'Un modelo integral de evaluación de talento',
    description: 'Datos y estadísticas basadas en competencias, comportamientos y fuerzas impulsoras para facilitar la identificación de fortalezas y áreas de desarrollo.',
    body_html: `<div class="tools-grid">
  <div class="tool-card"><h5>DISC</h5><p>Estilo de comunicación y comportamiento, individual y de equipo (TEAM DISC).</p></div>
  <div class="tool-card"><h5>Inteligencia Emocional</h5><p>TriMetrix EQ: comportamientos, fuerzas impulsoras y diagnóstico de estrés.</p></div>
  <div class="tool-card"><h5>Talent Alignment</h5><p>Modelo integral que combina competencias de ventas y desempeño.</p></div>
  <div class="tool-card"><h5>AXES 360</h5><p>Evaluación 360° con retroalimentación de colaboradores, jefes y pares.</p></div>
</div>`,
    media_image: '/assets/img/program-evaluacion.jpg',
    media_badge_image: null
  });

  console.log('Servicios: 3 tabs originales insertadas.');
}

// ---------- 6. NOM-037 ----------
if (db.getSetting('nom037') === undefined) {
  db.setSetting('nom037', {
    eyebrow: '04 · Programa para empresas',
    heading: 'Implementación y cumplimiento de la NOM-037',
    paragraph1: 'La NOM-037-STPS-2023 aplica a todo centro de trabajo, público o privado, con personas trabajadoras que laboren más del 40% de su jornada bajo la modalidad de Teletrabajo.',
    paragraph2: 'Nuestro programa te da las herramientas necesarias para cumplir con la normativa y garantizar un entorno laboral saludable.',
    cta_label: 'Conoce el programa',
    cta_href: '#contacto',
    image: '/assets/img/service-nom037.png'
  });
  console.log('NOM-037: contenido por defecto insertado.');
}

console.log('\nSeed completado.\n');
