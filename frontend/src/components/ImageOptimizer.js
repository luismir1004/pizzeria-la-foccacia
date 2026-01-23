/**
 * ImageOptimizer
 * Mejora la carga de imágenes con lazy loading avanzado y efecto blur-up.
 */
export class ImageOptimizer {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
        this.init();
    }

    init() {
        if (!this.images.length) return;

        // Use Intersection Observer for better performance
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            obs.unobserve(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '50px 0px', // Start loading 50px before visible
                    threshold: 0.01,
                }
            );

            this.images.forEach(img => {
                // Add placeholder class to parent
                img.parentElement?.classList.add('img-placeholder');
                observer.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.images.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        // When image loads, add loaded class for fade-in
        if (img.complete) {
            img.classList.add('loaded');
            img.parentElement?.classList.remove('img-placeholder');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
                img.parentElement?.classList.remove('img-placeholder');
            });

            img.addEventListener('error', () => {
                console.warn(`Failed to load image: ${img.src}`);
                img.parentElement?.classList.remove('img-placeholder');
            });
        }
    }

    /**
     * Creates a skeleton card HTML for loading states.
     * @param {number} count - Number of skeleton cards to create
     * @returns {string} HTML string
     */
    static createSkeletonCards(count = 4) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
        <div class="skeleton-card">
          <div class="skeleton-image"></div>
          <div class="p-5 space-y-3">
            <div class="skeleton-text skeleton-text-lg w-2/3 mx-auto"></div>
            <div class="skeleton-text w-full"></div>
            <div class="skeleton-text w-full"></div>
            <div class="skeleton-text w-3/4"></div>
          </div>
        </div>
      `;
        }
        return html;
    }
}
