/**
 * Pizzería La Foccacia - Main JavaScript
 * Funcionalidades: Componentes Web, Animaciones al scroll
 */

import { registerSW } from 'virtual:pwa-register';
import './index.css';
import './components/AppNavbar.js';
import './components/AppFooter.js';
import { MenuFilter } from './components/MenuFilter.js';
import { ProductModal } from './components/ProductModal.js';
import { ShoppingCart } from './components/ShoppingCart.js';
import { ImageOptimizer } from './components/ImageOptimizer.js';

// PWA Service Worker Registration
registerSW({
    onNeedRefresh() {
        if (confirm('Nueva versión disponible. ¿Recargar?')) {
            window.location.reload();
        }
    },
    onOfflineReady() {
        console.log('App lista para usar offline');
    },
});

// ==================== ANIMACIONES AL SCROLL ====================

// ==================== ANIMACIONES AL SCROLL ====================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.dataset.animate;
                const delay = entry.target.dataset.delay || 0;

                setTimeout(() => {
                    entry.target.classList.add(`animate-${animation}`);
                    entry.target.style.opacity = '1';
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ==================== SCROLL SUAVE PARA ANCLAS ====================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== HEADER SCROLL EFFECT ====================

function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ==================== INICIALIZACIÓN ====================

document.addEventListener('DOMContentLoaded', () => {


    initScrollAnimations();
    initSmoothScroll();
    initHeaderScroll();

    // Init Features
    new MenuFilter();
    new ProductModal();
    new ShoppingCart();
    new ImageOptimizer();

    // Initialize Product Renderers for Menu Page
    ['pizzas', 'hamburguesas', 'bebidas'].forEach(category => {
        const gridId = `${category}-grid`;
        if (document.getElementById(gridId)) {
            import('./components/ProductRenderer.js').then(({ ProductRenderer }) => {
                new ProductRenderer(gridId, category).render();
            });
        }
    });

    console.log('🍕 Pizzería La Foccacia - JS Loaded');
});
