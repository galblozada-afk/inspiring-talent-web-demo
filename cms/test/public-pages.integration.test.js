const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

function stopServer(app) {
  if (app.exitCode !== null) return Promise.resolve();
  app.kill();
  return new Promise(resolve => app.once('exit', resolve));
}

test('serves every new page and seeded article over HTTP', async (t) => {
  const port = 3011;
  const app = spawn(process.execPath, ['server.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  t.after(() => stopServer(app));
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('El servidor no inició a tiempo.')), 4000);
    app.stdout.on('data', chunk => {
      if (chunk.toString().includes(`localhost:${port}`)) {
        clearTimeout(timer);
        resolve();
      }
    });
    app.stderr.on('data', chunk => {
      clearTimeout(timer);
      reject(new Error(chunk.toString()));
    });
  });

  const paths = [
    '/', '/blog', '/contacto', '/admin/login',
    '/coaching-organizacional', '/formacion', '/evaluacion-de-talento',
    '/soluciones-para-empresas', '/nosotros',
    '/blog/cultura-de-coaching', '/blog/liderazgo-en-tiempos-de-cambio',
    '/blog/nom-037-guia-practica-teletrabajo'
  ];

  for (const route of paths) {
    const response = await fetch(`http://127.0.0.1:${port}${route}`);
    assert.equal(response.status, 200, route);
  }

  const invalidSignup = await fetch(`http://127.0.0.1:${port}/newsletter`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'email=correo-invalido',
    redirect: 'manual'
  });
  assert.equal(invalidSignup.status, 302);
  assert.match(invalidSignup.headers.get('location'), /newsletter=invalid/);
});

test('contact page records consultation requests for the admin panel', () => {
  const contactPage = fs.readFileSync(path.join(__dirname, '..', 'views', 'contact.ejs'), 'utf8');
  const dbSource = fs.readFileSync(path.join(__dirname, '..', 'db.js'), 'utf8');
  const publicRoutes = fs.readFileSync(path.join(__dirname, '..', 'routes', 'public.js'), 'utf8');
  const adminRoutes = fs.readFileSync(path.join(__dirname, '..', 'routes', 'admin.js'), 'utf8');
  const adminNavigation = fs.readFileSync(path.join(__dirname, '..', 'views', 'partials', 'admin-top.ejs'), 'utf8');
  assert.match(contactPage, /<form[^>]+action="\/contacto"[^>]+method="post"/);
  assert.match(contactPage, /name="email"/);
  assert.match(contactPage, /name="service"/);
  assert.match(dbSource, /contactRequests:\s*\[\]/);
  assert.match(dbSource, /insertContactRequest/);
  assert.match(dbSource, /updateContactRequestStatus/);
  assert.match(publicRoutes, /router\.post\('\/contacto'/);
  assert.match(adminRoutes, /router\.get\('\/contacts'/);
  assert.match(adminNavigation, /href="\/admin\/contacts"/);
});

test('contact background circles use subtle accessible ambient motion', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'contact.css'), 'utf8');
  assert.match(css, /@keyframes contact-orbit/);
  assert.match(css, /\.contact-orb--one\{[^}]*animation:contact-orbit/);
  assert.match(css, /\.contact-orb--two\{[^}]*animation:contact-orbit/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)\{[\s\S]*\.contact-orb\{animation:none/);
});

test('about page tells the client, Airam, and impact story with scroll-driven data visuals', () => {
  const about = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'about-page.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'about.css'), 'utf8');
  const publicRoutes = fs.readFileSync(path.join(__dirname, '..', 'routes', 'public.js'), 'utf8');
  assert.match(publicRoutes, /page\.slug === 'nosotros'/);
  assert.match(about, /class="about-pains"/);
  assert.match(about, /Airam Sánchez Santos/);
  assert.match(about, /2,800 horas/);
  assert.match(about, /class="about-impact"/);
  assert.match(about, /data-impact-progress/);
  assert.match(about, /data-impact-progress="94"/);
  assert.match(about, /data-impact-progress="90"/);
  assert.match(about, /IntersectionObserver/);
  assert.match(css, /@keyframes about-orbit/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test('service and about pages use an editorial Airam hero while home stays unchanged', () => {
  const service = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'service-page.ejs'), 'utf8');
  const about = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'about-page.ejs'), 'utf8');
  const home = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.ejs'), 'utf8');
  const hero = fs.readFileSync(path.join(__dirname, '..', 'views', 'partials', 'subpage-editorial-hero.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'subpage-editorial-hero.css'), 'utf8');
  const image = path.join(__dirname, '..', 'public', 'assets', 'img', 'airam-hero-nosotros.png');

  assert.match(service, /subpage-editorial-hero/);
  assert.match(about, /subpage-editorial-hero/);
  assert.match(hero, /airam-hero-nosotros-v2\.png/);
  assert.doesNotMatch(hero, /CDMX, MX/);
  assert.match(hero, /aria-label="LinkedIn"/);
  assert.match(hero, /aria-label="Facebook"/);
  assert.match(hero, /aria-label="Instagram"/);
  assert.match(css, /@keyframes subpage-editorial-orbit/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.ok(fs.existsSync(image));
  assert.ok(!home.includes('subpage-editorial-hero'));
});

test('service page content reveals progressively as visitors scroll', () => {
  const service = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'service-page.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'page-scroll.css'), 'utf8');
  const script = fs.readFileSync(path.join(__dirname, '..', 'public', 'page-scroll.js'), 'utf8');

  assert.match(service, /data-page-scroll/);
  assert.match(service, /page-scroll\.css/);
  assert.match(service, /page-scroll\.js/);
  assert.match(script, /IntersectionObserver/);
  assert.match(script, /is-page-scroll-visible/);
  assert.match(css, /\[data-page-scroll\]\.is-page-scroll-visible/);
  assert.match(css, /prefers-reduced-motion/);
});

test('organizational coaching uses its own square illustration hero with title on the left', () => {
  const hero = fs.readFileSync(path.join(__dirname, '..', 'views', 'partials', 'subpage-editorial-hero.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'subpage-editorial-coaching.css'), 'utf8');
  const image = path.join(__dirname, '..', 'public', 'assets', 'img', 'coaching-organizacional-hero-v2.png');

  assert.match(hero, /coaching-organizacional-hero-v2\.png/);
  assert.match(hero, /subpage-editorial-hero--coaching/);
  assert.match(css, /\.subpage-editorial-hero--coaching \.subpage-editorial-disc\{[^}]*border-radius:0/);
  assert.match(css, /\.subpage-editorial-hero--coaching \.subpage-editorial-title-block\{[^}]*grid-column:1/);
  assert.ok(fs.existsSync(image));
});

test('training renders its dedicated applied-learning page', () => {
  const routes = fs.readFileSync(path.join(__dirname, '..', 'routes', 'public.js'), 'utf8');
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'training-page.ejs'), 'utf8');
  assert.match(routes, /page\.slug === 'formacion'/);
  assert.match(routes, /pages\/training-page/);
  assert.match(page, /APRENDER TIENE QUE MOVER EL TRABAJO/);
});

test('evaluation of talent renders a dedicated, interactive and responsible assessment page', () => {
  const routes = fs.readFileSync(path.join(__dirname, '..', 'routes', 'public.js'), 'utf8');
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'evaluation-page.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'evaluation-page.css'), 'utf8');
  const polishCss = fs.readFileSync(path.join(__dirname, '..', 'public', 'evaluation-visual-polish.css'), 'utf8');
  const script = fs.readFileSync(path.join(__dirname, '..', 'public', 'evaluation-page.js'), 'utf8');

  assert.match(routes, /evaluacion-de-talento[\s\S]*evaluation-page/);
  assert.match(page, /DATOS QUE ABREN MEJORES DECISIONES/);
  for (const tool of ['DISC', 'Inteligencia emocional', 'Talent Alignment', 'AXES 360']) assert.match(page, new RegExp(tool, 'i'));
  assert.match(page, /Una evaluaci.n abre una conversaci.n/i);
  assert.match(page, /criterio humano/);
  assert.match(page, /Evaluar el talento no es poner una etiqueta/i);
  assert.match(page, /fortalezas, anticipar fricciones/i);
  assert.match(page, /El talento necesita desarrollo/i);
  assert.match(page, /Tyler Cowen/i);
  assert.doesNotMatch(page, /evaluation-process-rail/);
  assert.doesNotMatch(page, /Acordar la pregunta/i);
  assert.match(page, /data-evaluation-tool/);
  assert.match(page, /evaluation-hero-signal/);
  assert.doesNotMatch(page, /evaluation-tool-constellation/);
  assert.match(page, /evaluation-assessment-hero\.png/);
  assert.match(page, /evaluation-hero-meta/);
  assert.match(css, /evaluation-tool-card\.is-evaluation-tool-active/);
  assert.match(css, /evaluation-tool-card:hover/);
  assert.match(polishCss, /evaluation-hero-signal/);
  assert.doesNotMatch(polishCss, /evaluation-tool-constellation/);
  assert.match(polishCss, /is-evaluation-detail-switching/);
  assert.match(polishCss, /evaluation-hero-meta/);
  assert.match(polishCss, /\.evaluation-cta h2\{line-height:1\.3\}/);
  assert.match(polishCss, /\.evaluation-process h2\{line-height:1\.3\}/);
  assert.doesNotMatch(polishCss, /evaluation-hero-visual \.evaluation-visual-grid,[\s\S]*display:none/);
  assert.match(css, /@media\(prefers-reduced-motion: reduce\)/);
  assert.match(script, /data-evaluation-tool/);
  assert.doesNotMatch(script, /evaluationToolSignal/);
  assert.match(script, /is-evaluation-detail-switching/);
  assert.match(script, /IntersectionObserver/);
});

test('solutions for companies renders its dedicated visual consultation page', () => {
  const routes = fs.readFileSync(path.join(__dirname, '..', 'routes', 'public.js'), 'utf8');
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'solutions-page.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'solutions-page.css'), 'utf8');
  const polishCss = fs.readFileSync(path.join(__dirname, '..', 'public', 'solutions-page-polish.css'), 'utf8');
  const script = fs.readFileSync(path.join(__dirname, '..', 'public', 'solutions-page.js'), 'utf8');
  const image = fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'img', 'solutions-enterprise-hero.png'));
  assert.match(routes, /page\.slug === 'soluciones-para-empresas'/);
  assert.match(page, /class="solutions-hero"/);
  assert.match(page, /contacto\?service=soluciones-empresas/);
  assert.match(page, /solutions-shape--triangle/);
  assert.match(page, /solutions-shape--square/);
  assert.match(page, /solutions-shape--circle/);
  assert.match(page, /class="solutions-section-title"/);
  assert.match(page, /class="solutions-mix-title"/);
  assert.match(page, /class="solutions-evidence-title"/);
  assert.match(page, /role="tablist"/);
  assert.equal((page.match(/class="solutions-tab-aside"/g) || []).length, 3);
  assert.equal((page.match(/class="solutions-option-banner(?:\s|")/g) || []).length, 9);
  assert.match(page, /BOOTCAMPS Y TALLERES/);
  assert.match(page, /COACHING DE EQUIPOS/);
  assert.match(page, /NOM-037/);
  assert.match(page, /MENTORÍA Y SUPERVISIÓN/);
  assert.match(page, /PLANES DE DESARROLLO/);
  assert.match(page, /program-mentoria-supervision\.png/);
  assert.match(page, /program-plan-desarrollo\.png/);
  assert.match(page, /program-formacion\.jpg/);
  assert.match(page, /program-coaching\.jpg/);
  assert.match(page, /program-evaluacion\.jpg/);
  assert.match(page, /id="solutions-radar"/);
  assert.match(page, /viewBox="-55 -5 470 350"/);
  assert.equal((page.match(/data-solutions-journey-step/g) || []).length, 4);
  assert.match(page, /FORTALEZAS QUE YA ESTÁN/);
  assert.match(page, /ACUERDOS QUE MUEVEN RESULTADOS/);
  assert.match(page, /1\.2 millones de empleados/);
  assert.match(page, /href="https:\/\/www\.gallup\.com\/workplace\/712895/);
  assert.match(page, /href="https:\/\/www\.gallup\.com\/cliftonstrengths\/en\/269615/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.solutions-shape--triangle\{[^}]*animation:solutions-shape-drift/);
  assert.match(css, /\.solutions-hero-visual img\{[^}]*filter:drop-shadow/);
  assert.match(polishCss, /\.solutions-section-head\{[\s\S]*?gap:clamp\(36px,7vw,90px\)/);
  assert.match(polishCss, /\.solutions-mix-intro\{[\s\S]*?margin-bottom:32px/);
  assert.match(polishCss, /\.solutions-evidence-head\{[\s\S]*?margin-bottom:34px/);
  assert.match(polishCss, /\.solutions-pillar\{[\s\S]*?transition:transform \.55s/);
  assert.match(polishCss, /\.solutions-pillar:hover,\.solutions-pillar:focus-within\{/);
  assert.match(polishCss, /\.solutions-option-banner\{[\s\S]*?min-height:190px/);
  assert.match(polishCss, /\.solutions-hero-visual img\{animation:none\}/);
  assert.match(script, /IntersectionObserver/);
  assert.match(script, /ArrowRight/);
  assert.match(script, /aria-selected/);
  assert.match(script, /is-leaving/);
  assert.match(script, /transitionTimer/);
  assert.match(script, /setJourneyProgress/);
  assert.match(script, /--solutions-journey-progress/);
  assert.match(script, /is-solutions-visible/);
  assert.ok(image.readUInt32BE(16) >= 1024, 'la ilustración debe conservar resolución de hero');
  assert.equal(image[25], 6, 'la ilustración debe conservar canal alfa RGBA');
});

test('training connects all learning audiences with accessible routes and applied practice', () => {
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'training-page.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'training-page.css'), 'utf8');
  const script = fs.readFileSync(path.join(__dirname, '..', 'public', 'training-page.js'), 'utf8');
  assert.equal((page.match(/data-training-route-trigger/g) || []).length, 3);
  for (const audience of ['Empresas y RH', 'Quiero certificarme', 'Soy coach en práctica']) assert.match(page, new RegExp(audience));
  assert.match(page, /Mentoría/);
  assert.match(page, /Supervisión/);
  assert.match(page, /Arma tu plan/);
  assert.match(page, /href="\/contacto\?service=formacion"/);
  assert.match(page, /training-transfer-rail[\s\S]*training-transfer-node/);
  assert.match(page, /data-training-transfer-step/);
  assert.match(page, /training-route is-training-route-open[\s\S]*Quiero certificarme/);
  assert.match(page, /training-route--coaches/);
  assert.match(page, /aria-label="C.+mo se convierte el aprendizaje en pr.+ctica"/);
  assert.match(script, /data-training-route-trigger/);
  assert.match(script, /IntersectionObserver/);
  assert.match(script, /setRoadmapProgress/);
  assert.match(script, /pointermove/);
  assert.match(css, /training-transfer-rail:before/);
  assert.match(css, /training-transfer-node/);
  assert.match(css, /--training-roadmap-progress/);
  assert.match(css, /roadmap-progress,0\)\);transition:transform \.52s cubic-bezier\(\.22,1,\.36,1\)/);
  assert.match(css, /training-transfer-step:focus-visible/);
  assert.match(css, /training-route--coaches[\s\S]*line-height:1\.15/);
  assert.match(css, /training-coaches h2\{max-width:665px;line-height:1\.25/);
  assert.match(css, /training-coaches-points article:hover/);
  assert.match(css, /training-coaches-points article:active/);
  assert.match(css, /training-coaches-points h3\{[^}]*\/1\.25/);
  assert.match(css, /training-plan-grid article:hover/);
  assert.match(css, /training-plan-grid article:active/);
  assert.match(css, /training-plan-grid h3\{line-height:1\.25/);
  assert.match(css, /is-training-route-panel-open\{max-height:540px/);
  assert.match(css, /max-height \.48s cubic-bezier/);
  assert.match(script, /is-training-route-panel-open/);
  assert.match(css, /@media\(max-width:760px\)[\s\S]*training-transfer-rail/);
  assert.match(css, /@media\(prefers-reduced-motion: reduce\)/);
});

test('organizational coaching renders its dedicated connected-change page', () => {
  const routes = fs.readFileSync(path.join(__dirname, '..', 'routes', 'public.js'), 'utf8');
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'coaching-page.ejs'), 'utf8');
  assert.match(routes, /page\.slug === 'coaching-organizacional'/);
  assert.match(routes, /pages\/coaching-page/);
  assert.match(page, /data-coaching-route/);
});

test('organizational coaching joins all four practices and all audience entry points', () => {
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'coaching-page.ejs'), 'utf8');
  for (const label of ['Coaching ejecutivo y de liderazgo', 'Coaching sistémico de equipos', 'Líder coach', 'Cultura de coaching']) assert.ok(page.includes(label));
  for (const label of ['Empresas y RH', 'Líderes', 'Equipos y coaches internos']) assert.ok(page.includes(label));
  assert.match(page, /service=coaching-organizacional/);
  assert.match(page, /Comprender el contexto/);
  assert.match(page, /Dar seguimiento/);
  const audiences = page.match(/<div class="coaching-wrap coaching-audience-grid"[\s\S]*?<\/div>\s*<\/section>/)[0];
  assert.doesNotMatch(audiences, /<span>0[1-3]<\/span>/);
});

test('coaching process prioritizes readable spacing without ordinal labels', () => {
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'coaching-page.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'coaching-page.css'), 'utf8');
  const process = page.match(/<section class="coaching-process"[\s\S]*?<\/section>/)[0];

  assert.doesNotMatch(process, /<span>0[1-4]<\/span>/);
  assert.match(css, /\.coaching-process h2\{[^}]*line-height:1\.20/);
  assert.match(css, /\.coaching-process-list li\{[^}]*grid-template-columns:1fr/);
});

test('coaching final invitation gives its accented editorial title enough line spacing', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'coaching-page.css'), 'utf8');
  assert.match(css, /\.coaching-final-cta h2\{[^}]*line-height:1\.30/);
});

test('organizational coaching uses accessible route cards and scroll-aware motion', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'coaching-page.css'), 'utf8');
  const script = fs.readFileSync(path.join(__dirname, '..', 'public', 'coaching-page.js'), 'utf8');
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'coaching-page.ejs'), 'utf8');
  assert.match(page, /aria-expanded="false"/);
  assert.match(page, /data-coaching-route-card/);
  assert.match(script, /IntersectionObserver/);
  assert.match(script, /is-coaching-open/);
  assert.match(css, /@media\s*\(prefers-reduced-motion: reduce\)/);
});

test('organizational coaching presents four independent editorial books', () => {
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'coaching-page.ejs'), 'utf8');
  assert.equal((page.match(/class="coaching-book\s/g) || []).length, 4);
  assert.equal((page.match(/aria-expanded="false"/g) || []).length >= 4, true);
  assert.equal((page.match(/data-coaching-panel hidden/g) || []).length, 4);
  assert.doesNotMatch(page, /coaching-book--executivo is-coaching-open/);
  assert.match(page, /coaching-book-cover/);
  assert.match(page, /coaching-book-spine/);
  assert.match(page, /coaching-book-sheet/);
});

test('coaching page answers key buyer questions with accessible accordion controls', () => {
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'coaching-page.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'coaching-page.css'), 'utf8');
  const script = fs.readFileSync(path.join(__dirname, '..', 'public', 'coaching-page.js'), 'utf8');

  assert.match(page, /PREGUNTAS QUE ABREN UNA BUENA/);
  assert.equal((page.match(/data-coaching-faq-trigger/g) || []).length, 5);
  assert.match(page, /aria-expanded="true"/);
  const faq = page.match(/<section class="coaching-faq"[\s\S]*?<\/section>/)[0];
  assert.doesNotMatch(faq, /Hablemos de tu contexto/);
  assert.match(script, /data-coaching-faq-trigger/);
  assert.match(css, /\.coaching-faq:after\{[^}]*border-radius:50%/);
  assert.match(css, /coaching-faq-orbit/);
});

test('coaching books use a native 3D cover treatment with reduced-motion support', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'coaching-page.css'), 'utf8');
  assert.match(css, /\.coaching-book-cover\{/);
  assert.match(css, /transform-style:preserve-3d/);
  assert.match(css, /\.coaching-book-spine\{/);
  assert.match(css, /\.coaching-book\.is-coaching-open/);
  assert.match(css, /@media\s*\(prefers-reduced-motion: reduce\)/);
});

test('coaching book interaction keeps one accessible active book at a time', () => {
  const script = fs.readFileSync(path.join(__dirname, '..', 'public', 'coaching-page.js'), 'utf8');
  assert.match(script, /closest\('\.coaching-book'\)/);
  assert.match(script, /classList\.toggle\('is-coaching-open'/);
  assert.match(script, /setAttribute\('aria-expanded'/);
});

test('the about hero uses the high-resolution Airam portrait without a redundant top label', () => {
  const hero = fs.readFileSync(path.join(__dirname, '..', 'views', 'partials', 'subpage-editorial-hero.ejs'), 'utf8');
  const highResolutionPortrait = path.join(__dirname, '..', 'public', 'assets', 'img', 'airam-hero-nosotros-v2.png');

  assert.match(hero, /airam-hero-nosotros-v2\.png/);
  assert.match(hero, /page\.slug !== 'nosotros'/);
  assert.ok(fs.existsSync(highResolutionPortrait));
});

test('Airam credentials animate on scroll with readable spacing and contrast', () => {
  const about = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'about-page.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'about-airam-proof.css'), 'utf8');
  const nameCss = fs.readFileSync(path.join(__dirname, '..', 'public', 'about-airam-name.css'), 'utf8');

  assert.match(about, /data-airam-proof/);
  assert.match(about, /data-airam-count="2800"/);
  assert.match(about, /data-airam-count="20"/);
  assert.match(about, /animateAiramProof/);
  assert.match(about, /split\(' '\)\.map\(\(word/);
  assert.match(css, /\.about-airam \.eyebrow\{color:#0c9f72/);
  assert.match(css, /\.about-airam-proof\{[\s\S]*grid-template-columns:126px minmax\(0,1fr\) minmax\(0,1fr\)[\s\S]*column-gap:38px/);
  assert.match(css, /\.airam-proof-value-char/);
  assert.match(nameCss, /\.airam-proof-value-word\{[^}]*white-space:nowrap/);
  assert.match(css, /\.about-airam-proof \.airam-proof-value-char\{font:inherit/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test('Airam section shows her ICF badges, spacious metrics, and professional LinkedIn link', () => {
  const about = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'about-page.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'about-airam-proof.css'), 'utf8');
  const assets = path.join(__dirname, '..', 'public', 'assets', 'img', 'airam-credentials');

  assert.match(about, /about-airam-certifications/);
  assert.match(about, /mcc-badge\.png/);
  assert.match(about, /team-coaching-badge\.png/);
  assert.match(about, /https:\/\/www\.linkedin\.com\/in\/airam-sanchez-santos-02\//);
  assert.match(css, /\.about-airam-linkedin/);
  assert.match(css, /grid-template-columns:126px minmax\(0,1fr\) minmax\(0,1fr\);column-gap:38px/);
  for (const file of ['mcc-badge.png', 'team-coaching-badge.png']) assert.ok(fs.existsSync(path.join(assets, file)), `${file} debe existir`);
});

test('the kinetic menu links visitors to the new service pages', async (t) => {
  const port = 3012;
  const app = spawn(process.execPath, ['server.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  t.after(() => stopServer(app));
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('El servidor no inició a tiempo.')), 4000);
    app.stdout.on('data', chunk => {
      if (chunk.toString().includes(`localhost:${port}`)) {
        clearTimeout(timer);
        resolve();
      }
    });
    app.stderr.on('data', chunk => {
      clearTimeout(timer);
      reject(new Error(chunk.toString()));
    });
  });

  const html = await (await fetch(`http://127.0.0.1:${port}/`)).text();
  for (const href of [
    '/coaching-organizacional',
    '/formacion',
    '/evaluacion-de-talento',
    '/soluciones-para-empresas',
    '/nosotros'
  ]) {
    assert.ok(html.includes(`href="${href}"`), `El menú debe incluir ${href}`);
  }
});

test('kinetic menus expose a direct virtual academy action on home and internal pages', () => {
  const home = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.ejs'), 'utf8');
  const header = fs.readFileSync(path.join(__dirname, '..', 'views', 'partials', 'site-header.ejs'), 'utf8');
  for (const template of [home, header]) {
    assert.match(template, /class="kinetic-academy-link"/);
    assert.match(template, /href="https:\/\/login\.inspiringtalent\.mx\/"/);
    assert.match(template, /Academia Virtual/);
  }
});

test('every public page uses the shared site header and footer', async (t) => {
  const port = 3013;
  const app = spawn(process.execPath, ['server.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  t.after(() => stopServer(app));
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('El servidor no inició a tiempo.')), 4000);
    app.stdout.on('data', chunk => {
      if (chunk.toString().includes(`localhost:${port}`)) {
        clearTimeout(timer);
        resolve();
      }
    });
    app.stderr.on('data', chunk => {
      clearTimeout(timer);
      reject(new Error(chunk.toString()));
    });
  });

  for (const route of ['/', '/coaching-organizacional', '/blog', '/blog/cultura-de-coaching', '/blog/articulo-inexistente']) {
    const response = await fetch(`http://127.0.0.1:${port}${route}`);
    const html = await response.text();
    assert.ok(html.includes('id="siteHeader"'), `${route} debe tener el header compartido`);
    assert.ok(html.includes('class="site-footer"'), `${route} debe tener el footer compartido`);
  }
});

test('the about section uses the looping motion graphic and animated value chips', async (t) => {
  const port = 3014;
  const app = spawn(process.execPath, ['server.js'], { cwd: path.join(__dirname, '..'), env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
  t.after(() => stopServer(app));
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('El servidor no inició a tiempo.')), 4000);
    app.stdout.on('data', chunk => { if (chunk.toString().includes(`localhost:${port}`)) { clearTimeout(timer); resolve(); } });
    app.stderr.on('data', chunk => { clearTimeout(timer); reject(new Error(chunk.toString())); });
  });
  const html = await (await fetch(`http://127.0.0.1:${port}/`)).text();
  assert.ok(html.includes('/assets/video/motion-nosotros.mp4'));
  assert.ok(html.includes('autoplay muted loop playsinline'));
  assert.ok(html.includes('value-chip value-chip--animated'));
});

test('the home offers challenge-based routes from the landing page', async (t) => {
  const port = 3015;
  const app = spawn(process.execPath, ['server.js'], { cwd: path.join(__dirname, '..'), env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
  t.after(() => stopServer(app));
  await new Promise((resolve, reject) => { const timer = setTimeout(() => reject(new Error('El servidor no inició a tiempo.')), 4000); app.stdout.on('data', chunk => { if (chunk.toString().includes(`localhost:${port}`)) { clearTimeout(timer); resolve(); } }); app.stderr.on('data', chunk => { clearTimeout(timer); reject(new Error(chunk.toString())); }); });
  const html = await (await fetch(`http://127.0.0.1:${port}/`)).text();
  assert.ok(html.includes('class="challenge-grid"'));
  for (const href of ['/coaching-organizacional', '/formacion', '/evaluacion-de-talento', '/soluciones-para-empresas']) assert.ok(html.includes(`href="${href}"`));
});

test('home connects why choose us to methodology with the Wayne Dyer quote bridge', () => {
  const home = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'site.css'), 'utf8');
  const quoteIndex = home.indexOf('Cuando cambiamos la forma de mirar las cosas');
  assert.ok(quoteIndex > home.indexOf('POR QUÉ ELEGIRNOS'));
  assert.ok(quoteIndex < home.indexOf('METODOLOGÍA'));
  assert.match(home, /<blockquote>“Cuando cambiamos la forma de mirar las cosas,/);
  assert.match(home, /Wayne Dyer/);
  assert.match(home, /class="quote-bridge-inner" data-reveal/);
  assert.match(css, /\.quote-bridge\s*\{[^}]*background:\s*var\(--navy-950\)/);
  assert.match(css, /\.quote-bridge blockquote\s*\{[\s\S]*font-style:\s*italic/);
});

test('CMS provides visual upcoming events above the about section and admin management for them', () => {
  const home = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'site.css'), 'utf8');
  const dbSource = fs.readFileSync(path.join(__dirname, '..', 'db.js'), 'utf8');
  const adminRoutes = fs.readFileSync(path.join(__dirname, '..', 'routes', 'admin.js'), 'utf8');
  const adminNavigation = fs.readFileSync(path.join(__dirname, '..', 'views', 'partials', 'admin-top.ejs'), 'utf8');
  assert.ok(home.indexOf('event-spotlight') < home.indexOf('POR QUÉ ELEGIRNOS'));
  assert.match(home, /events\.length/);
  assert.match(dbSource, /events:\s*\[\]/);
  assert.match(dbSource, /listUpcomingEvents/);
  assert.match(adminRoutes, /router\.get\('\/events'/);
  assert.match(adminRoutes, /uploadEvents\.single\('image'\)/);
  assert.match(adminNavigation, /href="\/admin\/events"/);
  assert.match(css, /@media \(max-width:980px\)[\s\S]*\.event-feature\s*\{[^}]*grid-template-columns:\s*1fr/);
});

test('upcoming events rotate every five seconds while preserving visitor control', () => {
  const home = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'site.css'), 'utf8');
  assert.match(home, /class="event-carousel"/);
  assert.match(home, /class="event-carousel-toggle"/);
  assert.match(home, /class="event-carousel-next"/);
  assert.match(home, /class="event-carousel-prev"/);
  assert.match(home, /eventCarouselTimer\s*=\s*setInterval[\s\S]*5000/);
  assert.match(home, /eventCarousel\.addEventListener\('mouseenter'/);
  assert.match(home, /eventCarousel\.addEventListener\('focusin'/);
  assert.match(home, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.event-carousel-slide\.is-active/);
});

test('service tabs expose accessible panel states for animated switching', async (t) => {
  const port = 3016;
  const app = spawn(process.execPath, ['server.js'], { cwd: path.join(__dirname, '..'), env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
  t.after(() => stopServer(app));
  await new Promise((resolve, reject) => { const timer = setTimeout(() => reject(new Error('El servidor no inici\u00f3 a tiempo.')), 4000); app.stdout.on('data', chunk => { if (chunk.toString().includes(`localhost:${port}`)) { clearTimeout(timer); resolve(); } }); app.stderr.on('data', chunk => { clearTimeout(timer); reject(new Error(chunk.toString())); }); });
  const html = await (await fetch(`http://127.0.0.1:${port}/`)).text();
  assert.ok(html.includes('role="tablist"'));
  assert.ok(html.includes('aria-controls="panel-formacion"'));
  assert.ok(html.includes('role="tabpanel"'));
  assert.ok(html.includes('svc-panel--animated'));
});

test('the experience metrics declare their animated numeric targets', async (t) => {
  const port = 3017;
  const app = spawn(process.execPath, ['server.js'], { cwd: path.join(__dirname, '..'), env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
  t.after(() => stopServer(app));
  await new Promise((resolve, reject) => { const timer = setTimeout(() => reject(new Error('El servidor no inici\u00f3 a tiempo.')), 4000); app.stdout.on('data', chunk => { if (chunk.toString().includes(`localhost:${port}`)) { clearTimeout(timer); resolve(); } }); app.stderr.on('data', chunk => { clearTimeout(timer); reject(new Error(chunk.toString())); }); });
  const html = await (await fetch(`http://127.0.0.1:${port}/`)).text();
  assert.ok(html.includes('class="stat-number" data-count-to="20"'));
  assert.ok(html.includes('class="stat-number" data-count-to="15"'));
  assert.ok(html.includes('class="stat-number" data-count-to="11"'));
  assert.ok(html.includes('class="stat-lettermark"'));
});

test('the MX US lettermark is isolated from the small metric description style', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'site.css'), 'utf8');
  assert.match(css, /\.stat > span\s*\{/);
  assert.match(css, /\.stat-lettermark span\s*\{/);
});

test('section titles are prepared for a one-time scroll reveal', () => {
  const home = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'site.css'), 'utf8');
  assert.match(home, /const scrollTitles = document\.querySelectorAll\('\.section-head h2'\)/);
  assert.match(css, /\.scroll-title-word\s*\{/);
  assert.match(css, /\.scroll-title\.is-title-in \.scroll-title-word/);
});

test('evaluation tools use supplied logos and accessible flip-card behavior', () => {
  const home = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'site.css'), 'utf8');
  const assets = path.join(__dirname, '..', 'public', 'assets', 'img', 'assessment-tools');
  assert.match(home, /const toolLogos = \{/);
  assert.match(home, /tool-card-inner/);
  assert.match(css, /\.tool-card\.is-flipped \.tool-card-inner/);
  for (const file of ['disc.png', 'eq.png', 'talent-alignment.png', 'axes-360.png']) assert.ok(fs.existsSync(path.join(assets, file)), `${file} debe existir`);
});

test('every evaluation tool normalizes its title before selecting a flip-card logo', () => {
  const home = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'site.css'), 'utf8');
  assert.match(home, /toolLogos\[title\.toUpperCase\(\)\]/);
  assert.match(css, /\.tool-card-face--back p\s*\{[\s\S]*font-size: 12px/);
});

test('assessment logos preserve readable DISC and EQ marks and size AXES for its wide format', () => {
  const home = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'site.css'), 'utf8');
  assert.match(home, /tool-card-logo--\$\{title\.toLowerCase\(\)\.replace/);
  assert.match(css, /\.tool-card-logo--disc,\s*\.tool-card-logo--inteligencia-emocional/);
  assert.match(css, /\.tool-card-logo--axes-360\s*\{[\s\S]*width: 100px/);
});

test('testimonials use the supplied portraits and render the active story immediately', () => {
  const home = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.ejs'), 'utf8');
  const portraits = path.join(__dirname, '..', 'public', 'assets', 'img', 'testimonials');
  for (const file of ['rita-maria-culebro-hq.png', 'andrea-mercedes-duperon-hq.png', 'delia-trapero-turrent-hq.png', 'jorge-ignacio-rivera-hq.png']) {
    assert.ok(home.includes(`/assets/img/testimonials/${file}`), `${file} debe usarse en el carrusel`);
    assert.ok(fs.existsSync(path.join(portraits, file)), `${file} debe existir`);
  }
  assert.match(home, /layoutImages\(\);\s*renderContent\(\);\s*restartAutoplay\(\);/);
});

test('testimonials use high-resolution portrait restorations in the carousel', () => {
  const home = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.ejs'), 'utf8');
  const portraits = path.join(__dirname, '..', 'public', 'assets', 'img', 'testimonials');
  for (const file of ['rita-maria-culebro-hq.png', 'andrea-mercedes-duperon-hq.png', 'delia-trapero-turrent-hq.png', 'jorge-ignacio-rivera-hq.png']) {
    assert.ok(home.includes(`/assets/img/testimonials/${file}`), `${file} debe usarse en el carrusel`);
    assert.ok(fs.existsSync(path.join(portraits, file)), `${file} debe existir`);
  }
});

test('final contact CTA keeps a single consultation action and gives accented title text room', () => {
  const home = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'site.css'), 'utf8');
  const cta = home.match(/<section class="cta-final"[\s\S]*?<\/section>/)[0];
  assert.ok(cta.includes('Agenda una consultoría'));
  assert.ok(!cta.includes('Llamar ahora'));
  assert.ok(!cta.includes('contact-line'));
  assert.ok(!cta.includes('tel:+525544957404'));
  assert.match(css, /\.cta-final h2\s*\{[\s\S]*line-height: 1\.16/);
});

test('shared footer promotes the virtual academy and newsletter on every public page', () => {
  const footer = fs.readFileSync(path.join(__dirname, '..', 'views', 'partials', 'site-footer.ejs'), 'utf8');
  const home = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'site.css'), 'utf8');
  assert.ok(footer.includes('https://login.inspiringtalent.mx/'));
  assert.ok(footer.includes('Academia Virtual'));
  assert.ok(footer.includes('footer-newsletter'));
  assert.ok(footer.includes('aria-label="Instagram"'));
  assert.ok(home.includes("include('partials/site-footer')"));
  assert.match(css, /\.footer-top\s*\{/);
});

test('footer places the virtual academy card under the company and contact links', () => {
  const footer = fs.readFileSync(path.join(__dirname, '..', 'views', 'partials', 'site-footer.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'site.css'), 'utf8');
  assert.match(footer, /class="footer-academy-card"/);
  assert.ok(!footer.includes('footer-sidecards'));
  assert.match(footer, /Ingresar a la Academia/);
  assert.match(css, /\.footer-academy-card\s*\{[\s\S]*grid-column:\s*2\s*\/\s*-1/);
});

test('newsletter card stays at the top of the footer while academy remains under the navigation links', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'site.css'), 'utf8');
  assert.match(css, /\.footer-newsletter\s*\{[\s\S]*align-self:\s*start/);
  assert.doesNotMatch(css, /\.footer-newsletter\s*\{[\s\S]*margin-top:\s*157px/);
});

test('shared footer preserves the admin key and credits Ángulo 360', () => {
  const footer = fs.readFileSync(path.join(__dirname, '..', 'views', 'partials', 'site-footer.ejs'), 'utf8');
  assert.ok(footer.includes('aria-label="Acceso administrador"'));
  assert.ok(footer.includes('footer-admin-key'));
  assert.ok(footer.includes('https://angulo360.info/'));
  assert.ok(footer.includes('Soberanía Digital'));
});

test('footer newsletter gives visitors an email signup and a separate invitation to the blog', () => {
  const footer = fs.readFileSync(path.join(__dirname, '..', 'views', 'partials', 'site-footer.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'site.css'), 'utf8');
  assert.match(footer, /<form class="footer-newsletter-form" action="\/newsletter" method="post">/);
  assert.match(footer, /type="email"/);
  assert.match(footer, /name="email"/);
  assert.match(footer, /footer-blog-invite/);
  assert.match(footer, /href="\/blog"/);
  assert.match(css, /\.footer-newsletter-form\s*\{/);
  assert.match(css, /\.footer-blog-invite\s*\{/);
});

test('shared footer keeps the approved 2021 copyright year', () => {
  const footer = fs.readFileSync(path.join(__dirname, '..', 'views', 'partials', 'site-footer.ejs'), 'utf8');
  assert.ok(footer.includes('INSPIRING TALENT © 2021'));
  assert.ok(!footer.includes('new Date().getFullYear()'));
});

test('training hero uses its dedicated illustration and triangular scene', () => {
  const page = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'training-page.ejs'), 'utf8');
  const hero = fs.readFileSync(path.join(__dirname, '..', 'views', 'partials', 'subpage-editorial-hero.ejs'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'training-hero.css'), 'utf8');
  assert.match(page, /heroImage:\s*'\/assets\/img\/formacion-hero-ilustrado\.png'/);
  assert.match(page, /heroVariant:\s*'training-triangles'/);
  assert.match(hero, /heroImage/);
  assert.doesNotMatch(hero, /training-hero-tablet-mark/);
  assert.match(hero, /page\.slug !== 'formacion'/);
  assert.match(hero, /training-hero-context-card/);
  assert.match(hero, /training-hero-side-note/);
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'public', 'assets', 'img', 'formacion-hero-ilustrado.png')));
  assert.match(css, /training-triangles/);
  assert.match(css, /training-triangle-float/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*training-triangles/);
  assert.match(css, /training-triangles \.subpage-editorial-title-block h1\{line-height:1\.30/);
  assert.match(css, /training-triangles \.subpage-editorial-title-block\{position:relative;left:120px;/);
  assert.match(css, /training-triangles \.subpage-editorial-portrait\{position:relative;left:72px;/);
  assert.match(css, /training-triangles \.subpage-editorial-copy\{position:relative;left:110px\}/);
  assert.match(css, /training-triangles \.training-hero-context-card/);
  assert.match(css, /training-triangles \.training-hero-side-note/);
  assert.match(css, /training-hero-side-note-title\{[^}]*\/1\.20/);
  assert.match(css, /@media\(max-width:620px\)[\s\S]*training-hero-context-card/);
  assert.doesNotMatch(css, /training-hero-tablet-mark/);
  const image = fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'img', 'formacion-hero-ilustrado.png'));
  assert.ok(image.readUInt32BE(16) >= 1024, 'la ilustración de formación debe conservar resolución de hero');
  assert.doesNotMatch(css, /training-triangles \.subpage-editorial-meta:before/);
});

test('every site entry point declares the Inspiring Talent favicon', () => {
  const root = path.join(__dirname, '..');
  const templates = [
    'views/index.ejs',
    'views/contact.ejs',
    'views/blog/index.ejs',
    'views/blog/not-found.ejs',
    'views/blog/post.ejs',
    'views/pages/about-page.ejs',
    'views/pages/coaching-page.ejs',
    'views/pages/evaluation-page.ejs',
    'views/pages/service-page.ejs',
    'views/pages/solutions-page.ejs',
    'views/pages/training-page.ejs',
    'views/partials/admin-top.ejs',
    'views/admin/login.ejs'
  ];

  templates.forEach(template => {
    const document = fs.readFileSync(path.join(root, template), 'utf8');
    assert.match(document, /href="\/assets\/img\/favicon-inspiring\.png"/);
  });
  assert.ok(fs.existsSync(path.join(root, 'public', 'assets', 'img', 'favicon-inspiring.png')));
});

test('editorial blog supports modular badges, YouTube, and uploaded galleries', () => {
  const root = path.join(__dirname, '..');
  const database = fs.readFileSync(path.join(root, 'db.js'), 'utf8');
  const adminRoutes = fs.readFileSync(path.join(root, 'routes', 'admin.js'), 'utf8');
  const form = fs.readFileSync(path.join(root, 'views', 'admin', 'blog-form.ejs'), 'utf8');
  const index = fs.readFileSync(path.join(root, 'views', 'blog', 'index.ejs'), 'utf8');
  const article = fs.readFileSync(path.join(root, 'views', 'blog', 'post.ejs'), 'utf8');
  const script = fs.readFileSync(path.join(root, 'public', 'blog.js'), 'utf8');

  assert.match(database, /blogBadges/);
  assert.match(database, /blogPostBadges/);
  assert.match(database, /blogGallery/);
  assert.match(database, /listBlogBadges/);
  assert.match(database, /setBlogPostEditorial/);
  assert.match(database, /youtube_id/);
  assert.match(adminRoutes, /\/blog\/badges/);
  assert.match(adminRoutes, /normalizeYouTubeId/);
  assert.match(adminRoutes, /gallery_images/);
  assert.match(form, /name="badge_ids"/);
  assert.match(form, /name="youtube_url"/);
  assert.match(form, /name="gallery_images"/);
  assert.match(index, /data-blog-filter/);
  assert.match(index, /data-blog-search/);
  assert.match(article, /blog-video-frame/);
  assert.match(article, /data-blog-gallery/);
  assert.match(index, /aria-live/);
  assert.match(script, /prefers-reduced-motion/);
});
