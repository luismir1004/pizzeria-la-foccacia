/**
 * ProductRenderer
 * Renderiza tarjetas de productos desde la capa de datos (API con fallback local).
 */
import { getProducts, getAllLocalProducts, getLocalProductById, getCategories } from '../services/api.js';

export class ProductRenderer {
  /**
   * @param {string} containerId  ID del contenedor destino
   * @param {object|string} [opts]  Opciones (o categoría, por retrocompatibilidad)
   * @param {string|null} [opts.category]  Filtra por categoría
   * @param {boolean} [opts.featured]      Solo destacados
   * @param {number}  [opts.skeletons=4]   Nº de esqueletos mientras carga
   */
  constructor(containerId, opts = {}) {
    // Retrocompatibilidad: antes el 2º argumento era la categoría (string).
    if (typeof opts === 'string') opts = { category: opts };

    this.container = document.getElementById(containerId);
    this.category = opts.category ?? null;
    this.featured = opts.featured ?? false;
    this.skeletons = opts.skeletons ?? 4;
  }

  async render() {
    if (!this.container) return;

    // 1. Esqueletos mientras llegan los datos
    const { ImageOptimizer } = await import('./ImageOptimizer.js');
    this.container.innerHTML = ImageOptimizer.createSkeletonCards(this.skeletons);

    // 2. Datos reales (API o fallback local)
    let products = [];
    try {
      products = await getProducts({ category: this.category, featured: this.featured });
    } catch (err) {
      console.error('[ProductRenderer] no se pudieron cargar los productos', err);
      this.container.innerHTML = `<p class="col-span-full text-center text-text-muted py-10">
        No pudimos cargar el menú. Intenta de nuevo más tarde.</p>`;
      return;
    }

    // 3. Contenido con transición suave
    const content = products.map((p) => this.createCard(p)).join('');
    this.container.style.opacity = '0';
    requestAnimationFrame(() => {
      this.container.innerHTML = content;
      this.container.classList.add('transition-opacity', 'duration-500');
      this.container.style.opacity = '1';
      new ImageOptimizer();
    });
  }

  createCard(product) {
    const pricesHtml = product.prices
      .map(
        (p, i) => `
      <div class="flex justify-between items-center text-sm ${
        i < product.prices.length - 1 ? 'border-b border-primary/10 pb-1' : ''
      }">
        <span class="text-text-muted">${p.size}</span>
        <span class="font-bold text-primary-dark dark:text-primary">$${Number(p.price).toFixed(2)}</span>
      </div>`
      )
      .join('');

    const webp = product.image;
    const fallback = webp.replace(/\.webp$/, '.png');

    const badge = product.featured
      ? `<span class="absolute top-3 left-3 z-10 bg-primary text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-soft">Popular</span>`
      : '';

    return `
      <div class="group bg-surface rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
           data-product-id="${product.id}"
           data-category="${product.category}"
           role="button" tabindex="0"
           aria-label="Ver ${product.name} y agregar al pedido">
        <div class="aspect-square overflow-hidden relative">
          ${badge}
          <picture>
            <source srcset="${webp}" type="image/webp" />
            <img class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                 src="${fallback}"
                 alt="${product.alt ?? product.name}"
                 loading="lazy" width="400" height="400" />
          </picture>
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span class="text-white text-sm font-semibold tracking-wide translate-y-2 group-hover:translate-y-0 transition-transform">Personalizar →</span>
          </div>
        </div>
        <div class="p-5">
          <h3 class="text-center text-2xl font-title font-bold text-primary mb-4">${product.name}</h3>
          <div class="space-y-2">
            ${pricesHtml}
          </div>
        </div>
      </div>`;
  }

  // --- Helpers estáticos (usados por el modal) ---
  static getProductById(productId) {
    return getLocalProductById(productId);
  }

  static getAllProducts() {
    return getAllLocalProducts();
  }

  static getCategories() {
    return getCategories();
  }
}
