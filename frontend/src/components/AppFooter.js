import { SITE } from '../config.js';

class AppFooter extends HTMLElement {
    connectedCallback() {
        const year = new Date().getFullYear();
        const fb = SITE.social?.facebook;
        const ig = SITE.social?.instagram;

        const social = [
            fb && `<a href="${fb}" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>`,
            ig && `<a href="${ig}" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>`,
        ].filter(Boolean).join('\n');

        this.innerHTML = `
        <footer class="bg-primary pt-16 pb-8 text-white mt-auto">
            <div class="w-11/12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                <div>
                    <h3 class="font-title text-3xl mb-4">La Foccacia</h3>
                    <p class="opacity-80">Pizzas artesanales hechas con amor y los mejores ingredientes desde 1995.</p>
                    <p class="opacity-80 mt-3 text-sm">
                        <a href="tel:${SITE.phone.replace(/[^\d+]/g, '')}" class="hover:text-accent transition">${SITE.phone}</a><br>
                        <a href="mailto:${SITE.email}" class="hover:text-accent transition">${SITE.email}</a>
                    </p>
                </div>
                <div>
                    <h4 class="font-bold text-xl mb-4">Enlaces Rápidos</h4>
                    <ul class="space-y-2 opacity-80">
                        <li><a href="menu.html" class="hover:text-accent transition">Menú Completo</a></li>
                        <li><a href="index.html#sucursales" class="hover:text-accent transition">Nuestras Sucursales</a></li>
                        <li><a href="contacto.html" class="hover:text-accent transition">Contacto</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold text-xl mb-4">Síguenos</h4>
                    <div class="flex gap-4">
                        ${social}
                    </div>
                </div>
            </div>
            <div class="text-center pt-8 border-t border-white/10 text-sm opacity-60">
                <p>© ${year} Pizzería La Foccacia — Todos los derechos reservados.</p>
            </div>
        </footer>
        `;
    }
}

customElements.define('app-footer', AppFooter);
