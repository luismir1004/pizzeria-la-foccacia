/**
 * Convierte los Decimal de Prisma a número para que el JSON sea consumible
 * directamente por el frontend (evita strings en los precios).
 * Módulo puro (sin dependencias) para poder testearlo sin base de datos.
 */
function serializeProduct(product) {
  return {
    ...product,
    prices: (product.prices ?? []).map((p) => ({ size: p.size, price: Number(p.price) })),
    extras: (product.extras ?? []).map((e) => ({ name: e.name, price: Number(e.price) })),
  };
}

module.exports = { serializeProduct };
