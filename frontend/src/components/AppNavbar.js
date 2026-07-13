class AppNavbar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu-overlay" class="mobile-menu-overlay"></div>
        
        <!-- Mobile Menu Drawer -->
        <nav id="mobile-menu" class="mobile-menu">
            <div class="flex justify-between items-center mb-8">
                <h3 class="font-title text-2xl text-primary font-semibold">La Foccacia</h3>
                <button id="close-menu" class="text-primary text-2xl">&times;</button>
            </div>
            <ul class="flex flex-col gap-6">
                <li><a href="index.html" class="mobile-menu-link text-lg text-primary hover:text-primary-dark uppercase font-semibold">Inicio</a></li>
                <li><a href="menu.html" class="mobile-menu-link text-lg text-primary hover:text-primary-dark uppercase font-semibold">Menú</a></li>
                <li><a href="index.html#sucursales" class="mobile-menu-link text-lg text-primary hover:text-primary-dark uppercase font-semibold">Sucursales</a></li>
                <li><a href="index.html#acerca-de" class="mobile-menu-link text-lg text-primary hover:text-primary-dark uppercase font-semibold">Acerca de</a></li>
                <li><a href="contacto.html" class="mobile-menu-link text-lg text-primary hover:text-primary-dark uppercase font-semibold">Contacto</a></li>
            </ul>
            <div class="mt-8 pt-8 border-t border-gray-200">
                <div class="flex items-center gap-3">
                    <span class="text-sm text-gray-600">Tema:</span>
                    <button id="theme-toggle-mobile" class="theme-toggle" aria-label="Cambiar tema"></button>
                </div>
            </div>
        </nav>

        <!-- Desktop Navigation Container -->
        <div class="desktop-nav-container fixed top-0 w-full z-50 transition-all duration-300 py-6">
            <div class="w-11/12 mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-7">
                <a href="index.html" class="font-title text-4xl font-semibold hover:opacity-80 transition drop-shadow-md">La Foccacia</a>
                
                <!-- Desktop Navigation -->
                <nav class="hidden lg:flex items-center gap-8 text-nowrap text-center font-semibold uppercase text-xs tracking-widest">
                    <a href="index.html" class="hover:text-accent transition duration-300">Inicio</a>
                    <a href="menu.html" class="hover:text-accent transition duration-300">Menú</a>
                    <a href="index.html#sucursales" class="hover:text-accent transition duration-300">Sucursales</a>
                    <a href="index.html#acerca-de" class="hover:text-accent transition duration-300">Acerca de</a>
                    <a href="contacto.html" class="hover:text-accent transition duration-300">Contacto</a>
                    <button id="theme-toggle" class="theme-toggle p-2 rounded-full hover:bg-white/10 transition" aria-label="Cambiar tema"></button>
                </nav>
                
                <!-- Mobile Hamburger -->
                <button id="hamburger" class="hamburger lg:hidden text-inherit p-2" aria-label="Abrir menú">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
        `;

        // Inicializar lógica asíncronamente
        // Inicializar lógica asíncronamente
        setTimeout(() => {
            this.initMobileMenu();
            this.initDarkMode();
            this.highlightActiveLink();
            this.initScrollEffect();
        }, 0);
    }

    initScrollEffect() {
        const navContainer = this.querySelector('.desktop-nav-container');
        if (!navContainer) return;

        const handleScroll = () => {
            if (window.scrollY > 20) {
                // Frosted Chocolate Glass Effect
                navContainer.classList.add('bg-primary/85', 'backdrop-blur-xl', 'shadow-soft', 'py-3', 'border-b', 'border-white/10');
                navContainer.classList.remove('py-6');
            } else {
                navContainer.classList.remove('bg-primary/85', 'backdrop-blur-xl', 'shadow-soft', 'py-3', 'border-b', 'border-white/10');
                navContainer.classList.add('py-6');
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Trigger once on init
        handleScroll();
    }

    initMobileMenu() {
        const hamburger = this.querySelector('#hamburger');
        const mobileMenu = this.querySelector('#mobile-menu');
        const mobileMenuOverlay = this.querySelector('#mobile-menu-overlay');
        const closeBtn = this.querySelector('#close-menu');
        const mobileMenuLinks = this.querySelectorAll('.mobile-menu-link');

        if (!hamburger || !mobileMenu) return;

        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileMenuOverlay?.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        };

        const closeMenu = () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileMenuOverlay?.classList.remove('active');
            document.body.style.overflow = '';
        };

        hamburger.addEventListener('click', toggleMenu);
        closeBtn?.addEventListener('click', closeMenu);
        mobileMenuOverlay?.addEventListener('click', closeMenu);
        mobileMenuLinks.forEach(link => link.addEventListener('click', closeMenu));

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    initDarkMode() {
        const themeToggle = this.querySelector('#theme-toggle');
        const themeToggleMobile = this.querySelector('#theme-toggle-mobile');
        const html = document.documentElement;

        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            html.classList.add('dark');
        }

        const toggles = [themeToggle, themeToggleMobile].filter(Boolean);
        const syncA11y = () => {
            const dark = html.classList.contains('dark');
            toggles.forEach((t) => {
                t.setAttribute('aria-pressed', String(dark));
                t.setAttribute('aria-label', dark ? 'Activar modo claro' : 'Activar modo oscuro');
            });
        };

        const toggleTheme = () => {
            html.classList.toggle('dark');
            localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
            syncA11y();
        };

        toggles.forEach((t) => t.addEventListener('click', toggleTheme));
        syncA11y();
    }

    highlightActiveLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const desktopLinks = this.querySelectorAll('nav a');

        desktopLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('#')[0];
            if ((currentPath === '' || currentPath === 'index.html') && (linkPath === 'index.html')) {
                // Active
            } else if (currentPath === linkPath) {
                link.classList.add('text-accent', 'underline');
                link.classList.remove('hover:text-accent');
            }
        });
    }
}

customElements.define('app-navbar', AppNavbar);
