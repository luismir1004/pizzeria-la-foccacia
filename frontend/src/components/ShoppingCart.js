/**
 * ShoppingCart
 * Carrito con cantidades, persistencia y checkout por WhatsApp.
 * Los cálculos usan priceRaw (número), nunca parseando strings.
 */
import { WHATSAPP_DIGITS } from '../config.js';
import { cartTotal, cartCount, addToItems } from '../lib/cartMath.js';

export class ShoppingCart {
    constructor() {
        this.cartBtn = document.getElementById('cart-btn');
        this.cartCount = document.getElementById('cart-count');
        this.cartDrawer = document.getElementById('cart-drawer');
        this.cartPanel = document.getElementById('cart-panel');
        this.cartBackdrop = document.getElementById('cart-backdrop');
        this.closeBtn = document.getElementById('close-cart');
        this.itemsContainer = document.getElementById('cart-items');
        this.totalLabel = document.getElementById('cart-total');
        this.checkoutBtn = document.getElementById('checkout-btn');

        this.items = this.load();
        this.init();
    }

    load() {
        try {
            const raw = JSON.parse(localStorage.getItem('cart')) || [];
            // Normaliza carritos antiguos (sin priceRaw/qty).
            return raw.map((it) => ({
                ...it,
                qty: it.qty ?? 1,
                priceRaw: it.priceRaw ?? (Number(String(it.price).replace(/[^\d.]/g, '')) || 0),
            }));
        } catch {
            return [];
        }
    }

    init() {
        if (!this.cartBtn) return;

        this.cartBtn.addEventListener('click', () => this.open());
        this.closeBtn?.addEventListener('click', () => this.close());
        this.cartBackdrop?.addEventListener('click', () => this.close());
        this.checkoutBtn?.addEventListener('click', () => this.checkout());

        document.addEventListener('add-to-cart', (e) => {
            this.addItem(e.detail);
            this.showToast(`${e.detail.title} añadido al pedido`);
        });

        // Delegación de +/- y borrar dentro del carrito.
        this.itemsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const index = Number(btn.dataset.index);
            const action = btn.dataset.action;
            if (action === 'inc') this.changeQty(index, 1);
            if (action === 'dec') this.changeQty(index, -1);
            if (action === 'del') this.removeItem(index);
        });

        this.updateUI();
    }

    /** Confirmación breve y accesible al agregar, con acceso directo al carrito. */
    showToast(msg) {
        let toast = document.getElementById('cart-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cart-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.className =
                'fixed z-[60] bottom-24 right-6 max-w-xs bg-primary text-white px-4 py-3 rounded-xl shadow-glow ' +
                'flex items-center gap-3 translate-y-3 opacity-0 transition-all duration-300 pointer-events-auto';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
            <span class="text-sm font-semibold flex-grow">${msg}</span>
            <button type="button" class="text-white/80 hover:text-white text-sm underline shrink-0" data-toast-open>Ver</button>`;
        toast.querySelector('[data-toast-open]')?.addEventListener('click', () => {
            this.hideToast();
            this.open();
        });

        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-3', 'opacity-0');
        });
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => this.hideToast(), 3200);
    }

    hideToast() {
        const toast = document.getElementById('cart-toast');
        if (toast) toast.classList.add('translate-y-3', 'opacity-0');
    }

    open() {
        this.cartDrawer.classList.remove('hidden');
        this.cartDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            this.cartBackdrop.classList.remove('opacity-0');
            this.cartPanel.classList.remove('translate-x-full');
        });
    }

    close() {
        this.cartBackdrop.classList.add('opacity-0');
        this.cartPanel.classList.add('translate-x-full');
        this.cartDrawer.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            this.cartDrawer.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    addItem(product) {
        this.items = addToItems(this.items, product);
        this.save();
        this.updateUI();
    }

    changeQty(index, delta) {
        const item = this.items[index];
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) this.items.splice(index, 1);
        this.save();
        this.updateUI();
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.save();
        this.updateUI();
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    get total() {
        return cartTotal(this.items);
    }

    get count() {
        return cartCount(this.items);
    }

    updateUI() {
        const count = this.count;
        this.cartCount.innerText = count;
        this.cartCount.classList.toggle('scale-0', count === 0);

        if (this.items.length === 0) {
            this.itemsContainer.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-4" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <p>Tu carrito está vacío</p>
                </div>`;
            this.totalLabel.innerText = '$0.00';
            return;
        }

        this.itemsContainer.innerHTML = this.items
            .map((item, index) => this.renderItem(item, index))
            .join('');
        this.totalLabel.innerText = `$${this.total.toFixed(2)}`;
    }

    renderItem(item, index) {
        const lineTotal = (item.priceRaw * item.qty).toFixed(2);
        const extras =
            item.extras && item.extras.length > 0
                ? `<p class="text-xs text-accent mt-0.5">+ ${item.extras.join(', ')}</p>`
                : '';
        return `
            <div class="flex gap-3 items-center bg-surface-muted p-3 rounded-lg">
                <img src="${item.img}" alt="${item.title}" class="w-16 h-16 object-cover rounded-md shrink-0" />
                <div class="flex-grow min-w-0">
                    <h4 class="font-bold text-primary text-sm truncate">${item.title}</h4>
                    <p class="text-xs text-text-muted">${item.size}</p>
                    ${extras}
                    <div class="flex items-center gap-2 mt-2">
                        <button data-action="dec" data-index="${index}" aria-label="Quitar uno"
                            class="w-6 h-6 rounded-full border border-black/15 dark:border-white/15 flex items-center justify-center text-text hover:border-primary transition">−</button>
                        <span class="text-sm font-bold w-5 text-center">${item.qty}</span>
                        <button data-action="inc" data-index="${index}" aria-label="Agregar uno"
                            class="w-6 h-6 rounded-full border border-black/15 dark:border-white/15 flex items-center justify-center text-text hover:border-primary transition">+</button>
                        <span class="ml-auto font-bold text-sm text-text">$${lineTotal}</span>
                    </div>
                </div>
                <button data-action="del" data-index="${index}" aria-label="Eliminar producto"
                    class="text-red-400 hover:text-red-600 p-1 self-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>`;
    }

    checkout() {
        if (this.items.length === 0) return;

        let message = '¡Hola! Me gustaría hacer el siguiente pedido:\n\n';
        this.items.forEach((item) => {
            message += `- ${item.qty}× ${item.title} (${item.size}): $${(item.priceRaw * item.qty).toFixed(2)}\n`;
            if (item.extras && item.extras.length > 0) {
                message += `  Extras: ${item.extras.join(', ')}\n`;
            }
        });
        message += `\n*Total: $${this.total.toFixed(2)}*`;

        window.open(`https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(message)}`, '_blank');
    }
}
