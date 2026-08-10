const test = require('node:test');
const assert = require('node:assert/strict');

const { getInternalPage, internalPages } = require('../content/internal-pages');

test('exposes the five approved public pages with complete page metadata', () => {
  const expectedSlugs = [
    'coaching-organizacional',
    'formacion',
    'evaluacion-de-talento',
    'soluciones-para-empresas',
    'nosotros'
  ];

  assert.deepEqual(Object.keys(internalPages).sort(), expectedSlugs.sort());

  for (const slug of expectedSlugs) {
    const page = getInternalPage(slug);
    assert.equal(page.slug, slug);
    assert.ok(page.title.length > 10);
    assert.ok(page.intro.length > 30);
    assert.ok(page.sections.length >= 2);
  }
});

test('returns null for a route that is not an internal page', () => {
  assert.equal(getInternalPage('ruta-inexistente'), null);
});

test('presents a deeper evaluation offer and a talent journey', () => {
  const evaluation = getInternalPage('evaluacion-de-talento');
  const solutions = getInternalPage('soluciones-para-empresas');
  assert.ok(evaluation.sections.length >= 5);
  assert.equal(solutions.journey.length, 5);
});
