const test = require('node:test');
const assert = require('node:assert');
const { serializeProduct } = require('../src/serialize.js');

test('serializeProduct convierte los Decimal de precios y extras a número', () => {
  const raw = {
    id: 'pizza-pepperoni',
    name: 'Pepperoni',
    prices: [
      { size: 'Pequeña', price: '123.00' },
      { size: 'Grande', price: '223.00' },
    ],
    extras: [{ name: 'Queso Extra', price: '25.00' }],
  };

  const out = serializeProduct(raw);

  assert.strictEqual(out.prices[0].price, 123);
  assert.strictEqual(typeof out.prices[0].price, 'number');
  assert.strictEqual(out.prices[1].price, 223);
  assert.strictEqual(out.extras[0].price, 25);
  assert.strictEqual(out.prices[0].size, 'Pequeña');
});

test('serializeProduct conserva el resto de campos del producto', () => {
  const raw = { id: 'x', name: 'X', featured: true, prices: [], extras: [] };
  const out = serializeProduct(raw);
  assert.strictEqual(out.id, 'x');
  assert.strictEqual(out.featured, true);
  assert.deepStrictEqual(out.prices, []);
});
