/**
 * SiteOverlays
 * Web Component que inyecta una sola vez el modal de producto, el botón
 * flotante del carrito y el drawer del carrito. Evita duplicar este markup
 * en index.html y menu.html (fuente única). Los IDs son los que consumen
 * ProductModal y ShoppingCart.
 */
class SiteOverlays extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <!-- Product Modal -->
        <div id="product-modal" class="fixed inset-0 z-50 hidden opacity-0 transition-opacity duration-300"
            role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-hidden="true">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" id="modal-backdrop"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-2xl bg-surface rounded-2xl shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300"
                id="modal-panel">
                <button id="close-modal" aria-label="Cerrar ventana de producto"
                    class="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition backdrop-blur-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <div class="grid md:grid-cols-2">
                    <div class="h-64 md:h-full bg-surface-muted relative">
                        <img id="modal-image" src="" alt="" class="w-full h-full object-cover" />
                        <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-6 md:hidden">
                            <h3 id="modal-title-mobile" class="font-title text-3xl font-bold text-white"></h3>
                        </div>
                    </div>
                    <div class="p-8 md:p-10 flex flex-col h-full bg-surface-muted">
                        <h3 id="modal-title" class="hidden md:block font-title text-4xl font-bold text-primary mb-2"></h3>
                        <p class="text-text-muted mb-6 italic">Ingredientes frescos y masa artesanal.</p>
                        <div class="space-y-3 mb-8 flex-grow" id="modal-prices"></div>
                        <div class="mt-auto">
                            <button class="btn-premium w-full flex items-center justify-center gap-2 group" id="modal-add-btn">
                                <span>Agregar al Pedido</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Floating Cart Button -->
        <button id="cart-btn" aria-label="Abrir carrito de compras"
            class="fixed bottom-6 right-6 z-40 bg-accent hover:bg-accent-hover text-white w-16 h-16 rounded-full shadow-glow flex items-center justify-center transition-transform hover:scale-110 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span id="cart-count" class="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center transform scale-0 transition-transform duration-300">0</span>
        </button>

        <!-- Cart Drawer -->
        <div id="cart-drawer" class="fixed inset-0 z-50 hidden" role="dialog" aria-modal="true" aria-label="Tu pedido" aria-hidden="true">
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300" id="cart-backdrop"></div>
            <div class="absolute top-0 right-0 h-full w-full max-w-md bg-surface shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col" id="cart-panel">
                <div class="p-5 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-primary text-white">
                    <h2 class="font-title text-2xl font-bold">Tu Pedido</h2>
                    <button id="close-cart" class="text-white/80 hover:text-white transition" aria-label="Cerrar carrito">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="flex-grow overflow-y-auto p-5 space-y-4" id="cart-items">
                    <div class="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-4" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        <p>Tu carrito está vacío</p>
                    </div>
                </div>
                <div class="p-5 border-t border-black/5 dark:border-white/5 bg-surface-muted">
                    <div class="flex justify-between items-center mb-4 text-xl font-bold text-primary">
                        <span>Total</span>
                        <span id="cart-total">$0.00</span>
                    </div>
                    <button id="checkout-btn" class="btn-premium w-full flex items-center justify-center gap-2">
                        <span>Pedir por WhatsApp</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </button>
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define('site-overlays', SiteOverlays);
