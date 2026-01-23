/**
 * MenuFilter
 * Maneja el filtrado dinámico de secciones en la página del menú.
 */
export class MenuFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.sections = {
            pizzas: document.getElementById('pizzas'),
            hamburguesas: document.getElementById('hamburguesas'),
            bebidas: document.getElementById('bebidas')
        };

        this.init();
    }

    init() {
        if (!this.filterBtns.length) return;

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.applyFilter(filter);
                this.updateActiveBtn(btn);
            });
        });
    }

    applyFilter(filter) {
        Object.entries(this.sections).forEach(([key, section]) => {
            if (!section) return;

            // Reset animation classes
            section.classList.remove('animate-fade-in', 'hidden');

            if (filter === 'all' || key === filter) {
                // Show
                section.style.display = 'block';
                // Small delay to allow display block to apply before animation
                requestAnimationFrame(() => {
                    section.classList.add('animate-fade-in');
                    section.style.opacity = '1';
                });
            } else {
                // Hide
                section.style.display = 'none';
                section.style.opacity = '0';
            }
        });
    }

    updateActiveBtn(activeBtn) {
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active', 'bg-primary/5', 'text-white', 'bg-primary');
            btn.classList.add('text-primary', 'bg-transparent');
        });

        // Add active styles
        activeBtn.classList.remove('bg-transparent', 'text-primary');
        activeBtn.classList.add('active', 'bg-primary', 'text-white');
    }
}
