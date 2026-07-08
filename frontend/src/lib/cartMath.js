/**
 * Lógica pura del carrito (sin DOM), reutilizable y testeable.
 */

/** Firma única para agrupar líneas idénticas (mismo producto, tamaño y extras). */
export function itemSignature(item) {
  const extras = [...(item.extras || [])].sort().join(',');
  return `${item.id || item.title}__${item.size}__${extras}`;
}

/** Suma total del carrito usando priceRaw × qty. */
export function cartTotal(items) {
  return items.reduce((sum, it) => sum + Number(it.priceRaw) * Number(it.qty), 0);
}

/** Número total de unidades (suma de cantidades). */
export function cartCount(items) {
  return items.reduce((sum, it) => sum + Number(it.qty), 0);
}

/** Agrega un producto agrupando por firma; devuelve un nuevo array. */
export function addToItems(items, product) {
  const sig = itemSignature(product);
  const idx = items.findIndex((it) => itemSignature(it) === sig);
  if (idx >= 0) {
    const next = items.slice();
    next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
    return next;
  }
  return [...items, { ...product, qty: 1 }];
}
