/**
 * Lógica pura del catálogo (sin imports de datos ni DOM), para poder testearla.
 */

/** Convierte rutas "./img/.." a absolutas "/img/..". */
export function normalizeImage(path) {
  return typeof path === 'string' ? path.replace(/^\.\//, '/') : path;
}

export function normalizeProduct(p) {
  return { ...p, image: normalizeImage(p.image) };
}

/** Filtra una lista de productos por categoría y/o destacado. */
export function filterProducts(list, { category, featured } = {}) {
  let out = list;
  if (category) out = out.filter((p) => p.category === category);
  if (featured) out = out.filter((p) => p.featured);
  return out.map(normalizeProduct);
}
