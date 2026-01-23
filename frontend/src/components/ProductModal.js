/**
 * ProductModal
 * Maneja la lógica de "Vista Rápida" de productos.
 */
import { ProductRenderer } from './ProductRenderer.js';

export class ProductModal {
    constructor() {
        this.modal = document.getElementById('product-modal');
        this.modalPanel = document.getElementById('modal-panel');
        this.backdrop = document.getElementById('modal-backdrop');
        this.closeBtn = document.getElementById('close-modal');

        // Elements to populate
        this.image = document.getElementById('modal-image');
        this.title = document.getElementById('modal-title');
        this.titleMobile = document.getElementById('modal-title-mobile');
        this.pricesContainer = document.getElementById('modal-prices');

        this.addBtn = document.getElementById('modal-add-btn');
        this.selectedPrice = null;
        this.currentProduct = null;

        this.init();
    }

    init() {
        if (!this.modal) return;

        // Add to Cart
        this.addBtn?.addEventListener('click', () => {
            if (!this.selectedPrice || !this.currentProduct) {
                alert('Por favor selecciona un tamaño');
                return;
            }

            // Calculate Total Price
            let finalPrice = this.selectedPrice.price;
            let extrasList = [];

            this.selectedExtras.forEach(extra => {
                finalPrice += extra.price;
                extrasList.push(extra.name);
            });

            const event = new CustomEvent('add-to-cart', {
                detail: {
                    title: this.currentProduct.name,
                    img: this.currentProduct.image,
                    size: this.selectedPrice.size,
                    extras: extrasList,
                    priceRaw: finalPrice, // sending raw number for cart calculations if needed, but keeping string for display consistency
                    price: `$${finalPrice.toFixed(2)}`
                }
            });
            document.dispatchEvent(event);
            this.close();
        });

        // Use event delegation for product cards
        document.addEventListener('click', e => {
            const card = e.target.closest('[data-product-id]');
            if (card) {
                const productId = card.dataset.productId;
                const product = ProductRenderer.getProductById(productId);
                if (product) {
                    this.open(product);
                }
            }
        });

        // Close events
        this.closeBtn?.addEventListener('click', () => this.close());
        this.backdrop?.addEventListener('click', () => this.close());
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') this.close();
        });
    }

    open(product) {
        // Store current product
        this.currentProduct = product;
        this.selectedExtras = new Set(); // Reset extras

        // Populate Data
        this.image.src = product.image;
        this.title.innerText = product.name;
        this.titleMobile.innerText = product.name;

        // Populate Preparation aka "Cómo se hace"
        const descEl = this.modalPanel.querySelector('p.italic');
        if (descEl) {
            descEl.innerText = product.preparation || "Ingredientes frescos y calidad artesanal.";
        }

        // Clear & Populate Prices
        this.pricesContainer.innerHTML = '';
        this.selectedPrice = null;

        // 1. Prices Section
        const pricesTitle = document.createElement('h4');
        pricesTitle.className = "font-bold text-black mb-2";
        pricesTitle.innerText = "1. Elige tu tamaño:";
        this.pricesContainer.appendChild(pricesTitle);

        product.prices.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'price-option flex justify-between items-center p-3 mb-2 bg-white rounded-lg border border-gray-300 cursor-pointer hover:border-red-600 transition group';
            row.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="radio-indicator w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                        <div class="w-2 h-2 rounded-full bg-red-600 opacity-0 transition-opacity"></div>
                    </div>
                    <span class="font-medium text-black">${item.size}</span>
                </div>
                <span class="font-bold text-red-600 text-lg">$${item.price.toFixed(2)}</span>
            `;

            row.addEventListener('click', e => {
                e.stopPropagation();
                // Reset all
                this.pricesContainer.querySelectorAll('.price-option').forEach(el => {
                    el.classList.remove('border-red-600', 'bg-red-50');
                    const indicator = el.querySelector('.radio-indicator');
                    const dot = indicator.querySelector('div');
                    indicator.classList.remove('border-red-600');
                    dot.classList.add('opacity-0');
                });

                // Select current
                row.classList.add('border-red-600', 'bg-red-50');
                const indicator = row.querySelector('.radio-indicator');
                const dot = indicator.querySelector('div');
                indicator.classList.add('border-red-600');
                dot.classList.remove('opacity-0');

                this.selectedPrice = item;
                this.updateTotal();
            });

            if (index === 0) row.click();
            this.pricesContainer.appendChild(row);
        });

        // 2. Extras Section (if available)
        if (product.extras && product.extras.length > 0) {
            const extrasTitle = document.createElement('h4');
            extrasTitle.className = "font-bold text-black mt-4 mb-2";
            extrasTitle.innerText = "2. Personaliza tu orden (Extras):";
            this.pricesContainer.appendChild(extrasTitle);

            const extrasGrid = document.createElement('div');
            extrasGrid.className = "grid grid-cols-1 gap-2";

            product.extras.forEach(extra => {
                const row = document.createElement('div');
                row.className = 'extra-option flex justify-between items-center p-2 bg-white rounded-lg border border-gray-300 cursor-pointer hover:border-yellow-500 transition select-none';
                row.innerHTML = `
                   <div class="flex items-center gap-3">
                        <div class="checkbox-indicator w-5 h-5 rounded border border-gray-400 flex items-center justify-center text-white transition-colors bg-white">
                            <svg class="w-3 h-3 opacity-0 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" stroke="#fff"><path d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span class="text-sm font-medium text-black">${extra.name}</span>
                    </div>
                    <span class="text-sm font-bold text-yellow-600">+$${extra.price}</span>
                `;

                row.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const checkbox = row.querySelector('.checkbox-indicator');
                    const checkIcon = row.querySelector('svg');

                    if (!checkbox) return;

                    if (this.selectedExtras.has(extra)) {
                        this.selectedExtras.delete(extra);
                        // Deselect style
                        row.classList.remove('border-yellow-500', 'bg-yellow-50');
                        checkbox.classList.remove('bg-yellow-500', 'border-yellow-500');
                        checkIcon.classList.add('opacity-0');
                    } else {
                        this.selectedExtras.add(extra);
                        // Select style
                        row.classList.add('border-yellow-500', 'bg-yellow-50');
                        checkbox.classList.add('bg-yellow-500', 'border-yellow-500');
                        checkIcon.classList.remove('opacity-0');
                    }
                    this.updateTotal();
                });

                extrasGrid.appendChild(row);
            });
            this.pricesContainer.appendChild(extrasGrid);
        }

        // Show Logic
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Animate In
        requestAnimationFrame(() => {
            this.modal.classList.remove('opacity-0');
            this.modalPanel.classList.remove('scale-95');
            this.modalPanel.classList.add('scale-100');
        });
    }

    updateTotal() {
        // Logic to update a total price indicator if we had one in the modal
        // For now, it just ensures state is clean
    }

    close() {
        // Animate Out
        this.modal.classList.add('opacity-0');
        this.modalPanel.classList.remove('scale-100');
        this.modalPanel.classList.add('scale-95');

        setTimeout(() => {
            this.modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }
}
