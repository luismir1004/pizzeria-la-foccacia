/**
 * ProductRenderer
 * Renderiza tarjetas de productos dinámicamente desde el JSON centralizado.
 */
import productsData from '../data/products.json';

export class ProductRenderer {
  constructor(containerId, category = null) {
    this.container = document.getElementById(containerId);
    this.category = category;
    this.products = category
      ? productsData.products.filter(p => p.category === category)
      : productsData.products;
  }

  /**
   * Renderiza todas las tarjetas de productos en el contenedor.
   */
  /**
   * Renderiza todas las tarjetas de productos en el contenedor.
   */
  async render() {
    if (!this.container) return;

    // 1. Show Skeletons
    const { ImageOptimizer } = await import('./ImageOptimizer.js');
    this.container.innerHTML = ImageOptimizer.createSkeletonCards(4);

    // 2. Simulate Network Delay (for "app-like" feel) & Wait for main thread
    await new Promise(resolve => setTimeout(resolve, 600));

    // 3. Render Real Content
    const content = this.products.map(product => this.createCard(product)).join('');

    // Fade out skeletons / Fade in content
    this.container.style.opacity = '0';

    requestAnimationFrame(() => {
      this.container.innerHTML = content;
      this.container.classList.add('transition-opacity', 'duration-500');
      this.container.style.opacity = '1';

      // Re-init lazy loading for new images
      new ImageOptimizer();
    });
  }

  /**
   * Crea el HTML de una tarjeta de producto.
   * @param {Object} product - Producto del JSON
   * @returns {string} HTML de la tarjeta
   */
  createCard(product) {
    const pricesHtml = product.prices.map((p, i) => `
      <div class="flex justify-between items-center text-sm ${i < product.prices.length - 1 ? 'border-b border-primary/10 pb-1' : ''}">
        <span class="text-gray-600">${p.size}</span>
        <span class="font-bold text-primary">$${p.price.toFixed(2)}</span>
      </div>
    `).join('');

    return `
      <div class="group bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
           data-product-id="${product.id}"
           data-category="${product.category}">
        <div class="aspect-square overflow-hidden relative">
           <img class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
               src="${product.image.replace('./', '/')}"
               alt="${product.alt}"
               loading="lazy" />
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div class="p-5">
          <h3 class="text-center text-2xl font-title font-bold text-primary mb-4">${product.name}</h3>
          <div class="space-y-2">
            ${pricesHtml}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Filtra productos por categoría y re-renderiza.
   * @param {string} category - ID de categoría o 'all'
   */
  filterByCategory(category) {
    if (category === 'all') {
      this.products = productsData.products;
    } else {
      this.products = productsData.products.filter(p => p.category === category);
    }
    this.render();
  }

  /**
   * Obtiene un producto por su ID.
   * @param {string} productId
   * @returns {Object|undefined}
   */
  static getProductById(productId) {
    return productsData.products.find(p => p.id === productId);
  }

  /**
   * Devuelve todos los productos.
   * @returns {Array}
   */
  static getAllProducts() {
    return productsData.products;
  }

  /**
   * Devuelve las categorías disponibles.
   * @returns {Array}
   */
  static getCategories() {
    return productsData.categories;
  }
}
