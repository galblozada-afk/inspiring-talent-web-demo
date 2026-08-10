const test = require('node:test');
const assert = require('node:assert/strict');

const { posts, seedPosts } = require('../scripts/seed-blog-posts');

test('defines the three approved articles with publishable content', () => {
  assert.deepEqual(posts.map(post => post.slug), [
    'cultura-de-coaching',
    'liderazgo-en-tiempos-de-cambio',
    'nom-037-guia-practica-teletrabajo'
  ]);
  for (const post of posts) {
    assert.equal(post.status, 'published');
    assert.ok(post.content_html.includes('<h2>'));
    assert.ok(post.content_html.includes('<ul>'));
  }
});

test('seeds only posts that do not already exist', () => {
  const created = [];
  const memoryDb = {
    slugExists: slug => slug === 'cultura-de-coaching',
    insertBlogPost: post => created.push(post)
  };

  const result = seedPosts(memoryDb);

  assert.equal(result.created, 2);
  assert.equal(result.skipped, 1);
  assert.deepEqual(created.map(post => post.slug), [
    'liderazgo-en-tiempos-de-cambio',
    'nom-037-guia-practica-teletrabajo'
  ]);
});
