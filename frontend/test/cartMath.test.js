import test from 'node:test';
import assert from 'node:assert';
import {
  itemSignature,
  cartTotal,
  cartCount,
  addToItems,
} from '../src/lib/cartMath.js';

test('cartTotal suma priceRaw × qty (sin parsear strings)', () => {
  const items = [
    { priceRaw: 123, qty: 2 },
    { priceRaw: 45.5, qty: 1 },
  ];
  assert.strictEqual(cartTotal(items), 291.5);
});

test('cartCount suma las cantidades, no las líneas', () => {
  const items = [
    { qty: 3 },
    { qty: 2 },
  ];
  assert.strictEqual(cartCount(items), 5);
});

test('itemSignature agrupa por id, tamaño y extras (orden indiferente)', () => {
  const a = { id: 'pizza-1', size: 'Grande', extras: ['Queso', 'Tocino'] };
  const b = { id: 'pizza-1', size: 'Grande', extras: ['Tocino', 'Queso'] };
  const c = { id: 'pizza-1', size: 'Mediana', extras: [] };
  assert.strictEqual(itemSignature(a), itemSignature(b));
  assert.notStrictEqual(itemSignature(a), itemSignature(c));
});

test('addToItems incrementa la cantidad de una línea idéntica', () => {
  let items = [];
  const product = { id: 'pizza-1', size: 'Grande', extras: [], priceRaw: 200 };
  items = addToItems(items, product);
  items = addToItems(items, product);
  assert.strictEqual(items.length, 1);
  assert.strictEqual(items[0].qty, 2);
  assert.strictEqual(cartTotal(items), 400);
});

test('addToItems crea líneas separadas si difieren los extras', () => {
  let items = [];
  items = addToItems(items, { id: 'p', size: 'M', extras: [], priceRaw: 100 });
  items = addToItems(items, { id: 'p', size: 'M', extras: ['Queso'], priceRaw: 125 });
  assert.strictEqual(items.length, 2);
  assert.strictEqual(cartCount(items), 2);
});
