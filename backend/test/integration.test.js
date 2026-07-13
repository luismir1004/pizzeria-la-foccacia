/**
 * Tests de integración de la API. Requieren una base de datos migrada y sembrada.
 * Se omiten automáticamente si no hay DATABASE_URL (p. ej. en local sin Postgres).
 * En CI, el job "backend-integration" levanta Postgres, migra y siembra antes.
 */
const test = require('node:test');
const assert = require('node:assert');

const hasDb = !!process.env.DATABASE_URL;
const opts = { skip: hasDb ? false : 'sin DATABASE_URL' };

let server;
let base;

test.before(async () => {
  if (!hasDb) return;
  const { app } = require('../src/index.js');
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      base = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) await new Promise((r) => server.close(r));
});

test('GET /api/products devuelve el catálogo sembrado', opts, async () => {
  const res = await fetch(`${base}/api/products`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data));
  assert.ok(data.length >= 16);
  assert.strictEqual(typeof data[0].prices[0].price, 'number');
});

test('GET /api/categories devuelve 3 categorías', opts, async () => {
  const res = await fetch(`${base}/api/categories`);
  const data = await res.json();
  assert.strictEqual(data.length, 3);
});

test('POST /api/contact válido crea el mensaje (201)', opts, async () => {
  const res = await fetch(`${base}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: 'Test', email: 'test@mail.com', mensaje: 'Mensaje de integración válido.' }),
  });
  assert.strictEqual(res.status, 201);
});

test('POST /api/contact inválido responde 422', opts, async () => {
  const res = await fetch(`${base}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: '', email: 'x', mensaje: 'corto' }),
  });
  assert.strictEqual(res.status, 422);
});

test('POST /api/contact con honeypot finge éxito sin fallar', opts, async () => {
  const res = await fetch(`${base}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: 'Bot', email: 'bot@mail.com', mensaje: 'spam spam spam', website: 'http://spam' }),
  });
  assert.strictEqual(res.status, 201);
});
