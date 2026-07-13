const test = require('node:test');
const assert = require('node:assert');
const { rateLimit, corsOptions } = require('../src/security');

function fakeRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; },
  };
}

test('rateLimit permite hasta max y bloquea el siguiente', () => {
  const mw = rateLimit({ windowMs: 1000, max: 3 });
  const req = { ip: '1.2.3.4' };
  let passed = 0;
  for (let i = 0; i < 3; i++) mw(req, fakeRes(), () => passed++);
  assert.strictEqual(passed, 3);

  const res = fakeRes();
  let blockedNext = false;
  mw(req, res, () => { blockedNext = true; });
  assert.strictEqual(blockedNext, false);
  assert.strictEqual(res.statusCode, 429);
  assert.ok(res.headers['Retry-After']);
});

test('rateLimit aísla por IP', () => {
  const mw = rateLimit({ windowMs: 1000, max: 1 });
  let a = 0, b = 0;
  mw({ ip: 'a' }, fakeRes(), () => a++);
  mw({ ip: 'b' }, fakeRes(), () => b++);
  assert.strictEqual(a, 1);
  assert.strictEqual(b, 1);
});

test('corsOptions permite origen en whitelist y rechaza fuera', () => {
  process.env.ALLOWED_ORIGINS = 'https://ok.com, https://dos.com';
  const { origin } = corsOptions();
  origin('https://ok.com', (err, allow) => { assert.ifError(err); assert.strictEqual(allow, true); });
  origin('https://malo.com', (err) => { assert.ok(err instanceof Error); });
  origin(undefined, (err, allow) => { assert.ifError(err); assert.strictEqual(allow, true); }); // same-origin/curl
  delete process.env.ALLOWED_ORIGINS;
});
