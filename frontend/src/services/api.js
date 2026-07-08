/**
 * Capa de acceso a datos del catálogo.
 *
 * Desacopla la UI del origen de los datos: si hay una API configurada
 * (SITE.apiUrl) intenta consumirla; si falla o no está configurada, cae
 * al catálogo estático incluido en el bundle (products.json).
 *
 * Así el sitio funciona tanto conectado al backend como de forma autónoma.
 */
import productsData from '../data/products.json';
import { SITE } from '../config.js';

const LOCAL = productsData;

/** Normaliza las rutas de imagen del JSON ("./img/..") a rutas absolutas ("/img/.."). */
function normalizeImage(path) {
  return typeof path === 'string' ? path.replace(/^\.\//, '/') : path;
}

function normalizeProduct(p) {
  return { ...p, image: normalizeImage(p.image) };
}

async function fetchJson(pathname) {
  const res = await fetch(`${SITE.apiUrl}${pathname}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Devuelve todos los productos, opcionalmente filtrados.
 * @param {{category?: string, featured?: boolean}} [opts]
 */
export async function getProducts(opts = {}) {
  const { category, featured } = opts;

  if (SITE.apiUrl) {
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (featured) params.set('featured', 'true');
      const qs = params.toString();
      const data = await fetchJson(`/api/products${qs ? `?${qs}` : ''}`);
      return data.map(normalizeProduct);
    } catch (err) {
      console.warn('[api] Falló la API, usando catálogo local:', err.message);
    }
  }

  let list = LOCAL.products;
  if (category) list = list.filter((p) => p.category === category);
  if (featured) list = list.filter((p) => p.featured);
  return list.map(normalizeProduct);
}

/** Devuelve las categorías del catálogo. */
export async function getCategories() {
  if (SITE.apiUrl) {
    try {
      return await fetchJson('/api/categories');
    } catch (err) {
      console.warn('[api] Falló la API, usando categorías locales:', err.message);
    }
  }
  return LOCAL.categories;
}

/** Búsqueda síncrona en el catálogo local (para el modal, que ya tiene los datos). */
export function getLocalProductById(id) {
  const p = LOCAL.products.find((x) => x.id === id);
  return p ? normalizeProduct(p) : undefined;
}

export function getAllLocalProducts() {
  return LOCAL.products.map(normalizeProduct);
}
