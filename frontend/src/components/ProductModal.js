/**
 * ProductModal
 * "Vista rápida" de un producto: elegir tamaño, extras y agregar al pedido.
 * Accesible: role=dialog, focus trap y restauración del foco al cerrar.
 */
import { getLocalProductById } from '../services/api.js';

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export class ProductModal {
    constructor() {
        this.modal = document.getElementById('product-modal');
        this.modalPanel = document.getElementById('modal-panel');
        this.backdrop = document.getElementById('modal-backdrop');
        this.closeBtn = document.getElementById('close-modal');

        this.image = document.getElementById('modal-image');
        this.title = document.getElementById('modal-title');
        this.titleMobile = document.getElementById('modal-title-mobile');
        this.pricesContainer = document.getElementById('modal-prices');

        this.addBtn = document.getElementById('modal-add-btn');
        this.selectedPrice = null;
        this.selectedExtras = new Set();
        this.currentProduct = null;
        this.lastFocused = null;

        this.init();
    }

    init() {
        if (!this.modal) return;

        this.addBtn?.addEventListener('click', () => this.addToCart());

        // Delegación: cualquier tarjeta con data-product-id abre el modal.
        document.addEventListener('click', (e) => {
            const card = e.target.closest('[data-product-id]');
            if (card) {
                const product = getLocalProductById(card.dataset.productId);
                if (product) this.open(product, card);
            }
        });

        this.closeBtn?.addEventListener('click', () => this.close());
        this.backdrop?.addEventListener('click', () => this.close());

        this.modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
            if (e.key === 'Tab') this.trapFocus(e);
        });
    }

    addToCart() {
        if (!this.selectedPrice || !this.currentProduct) {
            this.pricesContainer.querySelector('.price-option')?.focus();
            return;
        }

        let finalPrice = this.selectedPrice.price;
        const extrasList = [];
        this.selectedExtras.forEach((extra) => {
            finalPrice += extra.price;
            extrasList.push(extra.name);
        });

        document.dispatchEvent(
            new CustomEvent('add-to-cart', {
                detail: {
                    id: this.currentProduct.id,
                    title: this.currentProduct.name,
                    img: this.currentProduct.image,
                    size: this.selectedPrice.size,
                    extras: extrasList,
                    priceRaw: finalPrice,
                    price: `$${finalPrice.toFixed(2)}`,
                },
            })
        );
        this.close();
    }

    open(product, triggerEl) {
        this.currentProduct = product;
        this.selectedExtras = new Set();
        this.selectedPrice = null;
        this.lastFocused = triggerEl || document.activeElement;

        // Datos
        this.image.src = product.image;
        this.image.alt = product.alt || product.name;
        this.title.innerText = product.name;
        this.titleMobile.innerText = product.name;

        const descEl = this.modalPanel.querySelector('p.italic');
        if (descEl) {
            descEl.innerText = product.preparation || 'Ingredientes frescos y calidad artesanal.';
        }

        this.renderPrices(product);
        this.renderExtras(product);

        // Mostrar
        this.modal.classList.remove('hidden');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            this.modal.classList.remove('opacity-0');
            this.modalPanel.classList.remove('scale-95');
            this.modalPanel.classList.add('scale-100');
            this.closeBtn?.focus();
        });
    }

    renderPrices(product) {
        this.pricesContainer.innerHTML = '';

        const title = document.createElement('h4');
        title.className = 'font-bold text-text mb-2';
        title.innerText = '1. Elige tu tamaño:';
        this.pricesContainer.appendChild(title);

        product.prices.forEach((item, index) => {
            const row = document.createElement('button');
            row.type = 'button';
            row.className =
                'price-option w-full flex justify-between items-center p-3 mb-2 bg-surface rounded-lg border border-black/10 dark:border-white/10 cursor-pointer hover:border-primary transition text-left';
            row.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="radio-indicator w-4 h-4 rounded-full border-2 border-black/30 dark:border-white/30 flex items-center justify-center">
                        <div class="w-2 h-2 rounded-full bg-primary opacity-0 transition-opacity"></div>
                    </div>
                    <span class="font-medium text-text">${item.size}</span>
                </div>
                <span class="font-bold text-primary text-lg">$${item.price.toFixed(2)}</span>
            `;

            row.addEventListener('click', () => this.selectPrice(row, item));
            this.pricesContainer.appendChild(row);
            if (index === 0) this.selectPrice(row, item);
        });
    }

    selectPrice(row, item) {
        this.pricesContainer.querySelectorAll('.price-option').forEach((el) => {
            el.classList.remove('border-primary', 'bg-primary/5');
            el.querySelector('.radio-indicator').classList.remove('border-primary');
            el.querySelector('.radio-indicator > div').classList.add('opacity-0');
        });
        row.classList.add('border-primary', 'bg-primary/5');
        row.querySelector('.radio-indicator').classList.add('border-primary');
        row.querySelector('.radio-indicator > div').classList.remove('opacity-0');
        this.selectedPrice = item;
    }

    renderExtras(product) {
        if (!product.extras || product.extras.length === 0) return;

        const title = document.createElement('h4');
        title.className = 'font-bold text-text mt-4 mb-2';
        title.innerText = '2. Personaliza tu orden (Extras):';
        this.pricesContainer.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 gap-2';

        product.extras.forEach((extra) => {
            const row = document.createElement('button');
            row.type = 'button';
            row.className =
                'extra-option w-full flex justify-between items-center p-2 bg-surface rounded-lg border border-black/10 dark:border-white/10 cursor-pointer hover:border-accent transition select-none text-left';
            row.setAttribute('aria-pressed', 'false');
            row.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="checkbox-indicator w-5 h-5 rounded border border-black/30 dark:border-white/30 flex items-center justify-center text-white transition-colors">
                        <svg class="w-3 h-3 opacity-0 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="#fff" stroke-width="3" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span class="text-sm font-medium text-text">${extra.name}</span>
                </div>
                <span class="text-sm font-bold text-accent">+$${extra.price}</span>
            `;

            row.addEventListener('click', () => {
                const checkbox = row.querySelector('.checkbox-indicator');
                const icon = row.querySelector('svg');
                if (this.selectedExtras.has(extra)) {
                    this.selectedExtras.delete(extra);
                    row.classList.remove('border-accent', 'bg-accent-soft');
                    checkbox.classList.remove('bg-accent', 'border-accent');
                    icon.classList.add('opacity-0');
                    row.setAttribute('aria-pressed', 'false');
                } else {
                    this.selectedExtras.add(extra);
                    row.classList.add('border-accent', 'bg-accent-soft');
                    checkbox.classList.add('bg-accent', 'border-accent');
                    icon.classList.remove('opacity-0');
                    row.setAttribute('aria-pressed', 'true');
                }
            });

            grid.appendChild(row);
        });

        this.pricesContainer.appendChild(grid);
    }

    trapFocus(e) {
        const nodes = [...this.modal.querySelectorAll(FOCUSABLE)].filter(
            (n) => n.offsetParent !== null
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    close() {
        this.modal.classList.add('opacity-0');
        this.modalPanel.classList.remove('scale-100');
        this.modalPanel.classList.add('scale-95');
        this.modal.setAttribute('aria-hidden', 'true');

        setTimeout(() => {
            this.modal.classList.add('hidden');
            document.body.style.overflow = '';
            this.lastFocused?.focus?.();
        }, 300);
    }
}
