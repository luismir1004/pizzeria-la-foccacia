/**
 * ShoppingCart
 * Maneja la lógica del carrito de compras, persistencia y checkout.
 */
export class ShoppingCart {
    constructor() {
        // UI Elements
        this.cartBtn = document.getElementById('cart-btn');
        this.cartCount = document.getElementById('cart-count');
        this.cartDrawer = document.getElementById('cart-drawer');
        this.cartPanel = document.getElementById('cart-panel');
        this.cartBackdrop = document.getElementById('cart-backdrop');
        this.closeBtn = document.getElementById('close-cart');
        this.itemsContainer = document.getElementById('cart-items');
        this.totalLabel = document.getElementById('cart-total');
        this.checkoutBtn = document.getElementById('checkout-btn');

        // State
        this.items = JSON.parse(localStorage.getItem('cart')) || [];

        this.init();
    }

    init() {
        if (!this.cartBtn) return;

        // Events
        this.cartBtn.addEventListener('click', () => this.open());
        this.closeBtn?.addEventListener('click', () => this.close());
        this.cartBackdrop?.addEventListener('click', () => this.close());
        this.checkoutBtn?.addEventListener('click', () => this.checkout());

        // Listen for "add-to-cart" events from other components
        document.addEventListener('add-to-cart', (e) => {
            this.addItem(e.detail);
            this.open();
        });

        // Delete events delegation
        this.itemsContainer.addEventListener('click', (e) => {
            if (e.target.closest('.delete-item')) {
                const index = e.target.closest('.delete-item').dataset.index;
                this.removeItem(index);
            }
        });

        // Initial Render
        this.updateUI();
    }

    open() {
        this.cartDrawer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            this.cartBackdrop.classList.remove('opacity-0');
            this.cartPanel.classList.remove('translate-x-full');
        });
    }

    close() {
        this.cartBackdrop.classList.add('opacity-0');
        this.cartPanel.classList.add('translate-x-full');

        setTimeout(() => {
            this.cartDrawer.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    addItem(product) {
        // Check if same product exists? For simplification, we just push
        // Or we could group by name + size
        this.items.push(product);
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

    updateUI() {
        // Update Count
        this.cartCount.innerText = this.items.length;
        if (this.items.length > 0) {
            this.cartCount.classList.remove('scale-0');
        } else {
            this.cartCount.classList.add('scale-0');
        }

        // Update List
        if (this.items.length === 0) {
            this.itemsContainer.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-4"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <p>Tu carrito está vacío</p>
                </div>
            `;
            this.totalLabel.innerText = '$0.00';
            return;
        }

        this.itemsContainer.innerHTML = '';
        let total = 0;

        this.items.forEach((item, index) => {
            // Parse price string like "$123.00" -> 123.00
            const priceVal = parseFloat(item.price.replace('$', ''));
            total += priceVal;

            const el = document.createElement('div');
            el.className = 'flex gap-4 items-center bg-gray-50 dark:bg-white/5 p-3 rounded-lg';
            el.innerHTML = `
                <img src="${item.img}" class="w-16 h-16 object-cover rounded-md" />
                <div class="flex-grow">
                    <h4 class="font-bold text-primary text-sm">${item.title}</h4>
                    <p class="text-xs text-gray-500">${item.size}</p>
                    ${item.extras && item.extras.length > 0
                    ? `<p class="text-xs text-accent mt-0.5">+ ${item.extras.join(', ')}</p>`
                    : ''}
                    <p class="font-bold text-sm text-gray-800 dark:text-white mt-1">${item.price}</p>
                </div>
                <button class="delete-item text-red-400 hover:text-red-600 p-2" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
            this.itemsContainer.appendChild(el);
        });

        this.totalLabel.innerText = `$${total.toFixed(2)}`;
    }

    checkout() {
        if (this.items.length === 0) return;

        let message = "¡Hola! Me gustaría hacer el siguiente pedido:\n\n";
        this.items.forEach(item => {
            message += `- ${item.title} (${item.size}): ${item.price}\n`;
            if (item.extras && item.extras.length > 0) {
                message += `  *Extras:* ${item.extras.join(', ')}\n`;
            }
        });
        message += `\n*Total: ${this.totalLabel.innerText}*`;

        const encodedMessage = encodeURIComponent(message);
        // Replace with real phone number
        window.open(`https://wa.me/1234567890?text=${encodedMessage}`, '_blank');
    }
}
