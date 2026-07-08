import test from 'node:test';
import assert from 'node:assert';
import { normalizeImage, normalizeProduct, filterProducts } from '../src/lib/catalog.js';

const SAMPLE = [
  { id: 'a', category: 'pizzas', featured: true, image: './img/menu/a.webp' },
  { id: 'b', category: 'pizzas', featured: false, image: './img/menu/b.webp' },
  { id: 'c', category: 'bebidas', featured: false, image: '/img/menu/c.webp' },
];

test('normalizeImage convierte ./ en / y respeta rutas ya absolutas', () => {
  assert.strictEqual(normalizeImage('./img/x.webp'), '/img/x.webp');
  assert.strictEqual(normalizeImage('/img/x.webp'), '/img/x.webp');
  assert.strictEqual(normalizeImage(undefined), undefined);
});

test('normalizeProduct normaliza la imagen sin mutar el resto', () => {
  const out = normalizeProduct({ id: 'a', image: './img/a.webp', name: 'A' });
  assert.strictEqual(out.image, '/img/a.webp');
  assert.strictEqual(out.name, 'A');
});

test('filterProducts sin opciones devuelve todo (con imágenes normalizadas)', () => {
  const out = filterProducts(SAMPLE);
  assert.strictEqual(out.length, 3);
  assert.strictEqual(out[0].image, '/img/menu/a.webp');
});

test('filterProducts por categoría', () => {
  assert.strictEqual(filterProducts(SAMPLE, { category: 'pizzas' }).length, 2);
  assert.strictEqual(filterProducts(SAMPLE, { category: 'bebidas' }).length, 1);
});

test('filterProducts por destacado', () => {
  const out = filterProducts(SAMPLE, { featured: true });
  assert.strictEqual(out.length, 1);
  assert.strictEqual(out[0].id, 'a');
});

test('filterProducts combina categoría y destacado', () => {
  assert.strictEqual(filterProducts(SAMPLE, { category: 'pizzas', featured: true }).length, 1);
  assert.strictEqual(filterProducts(SAMPLE, { category: 'bebidas', featured: true }).length, 0);
});
