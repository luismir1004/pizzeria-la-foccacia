/**
 * MenuFilter
 * Filtrado por categoría (con scroll a la sección) y búsqueda por nombre/ingrediente.
 */
import { getAllLocalProducts } from '../services/api.js';

const norm = (s) =>
  (s || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export class MenuFilter {
  constructor() {
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.sections = {
      pizzas: document.getElementById('pizzas'),
      hamburguesas: document.getElementById('hamburguesas'),
      bebidas: document.getElementById('bebidas'),
    };
    this.searchInput = document.getElementById('menu-search');
    this.emptyMsg = document.getElementById('search-empty');

    // Índice de búsqueda por id de producto (nombre + ingredientes + categoría)
    this.index = new Map();
    for (const p of getAllLocalProducts()) {
      this.index.set(p.id, norm(`${p.name} ${(p.ingredients || []).join(' ')} ${p.category}`));
    }

    this.init();
  }

  init() {
    if (!this.filterBtns.length && !this.searchInput) return;

    this.filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        if (this.searchInput) this.searchInput.value = '';
        this.clearSearch();
        this.applyFilter(filter);
        this.updateActiveBtn(btn);
        this.scrollToSection(filter);
      });
    });

    this.searchInput?.addEventListener('input', (e) => this.applySearch(e.target.value));
  }

  applyFilter(filter) {
    Object.entries(this.sections).forEach(([key, section]) => {
      if (!section) return;
      section.classList.remove('animate-fade-in');
      const show = filter === 'all' || key === filter;
      section.style.display = show ? 'block' : 'none';
      if (show) {
        requestAnimationFrame(() => {
          section.classList.add('animate-fade-in');
          section.style.opacity = '1';
        });
      }
    });
  }

  scrollToSection(filter) {
    const target = filter === 'all' ? document.getElementById('contenido') : this.sections[filter];
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  updateActiveBtn(activeBtn) {
    this.filterBtns.forEach((btn) => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  // --- Búsqueda ---
  applySearch(query) {
    const q = norm(query).trim();
    if (!q) {
      this.clearSearch();
      const active = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
      this.applyFilter(active);
      return;
    }

    let totalVisible = 0;
    Object.values(this.sections).forEach((section) => {
      if (!section) return;
      let visibleInSection = 0;
      section.querySelectorAll('[data-product-id]').forEach((card) => {
        const hay = this.index.get(card.dataset.productId) || norm(card.textContent);
        const match = hay.includes(q);
        card.style.display = match ? '' : 'none';
        if (match) visibleInSection++;
      });
      section.style.display = visibleInSection ? 'block' : 'none';
      totalVisible += visibleInSection;
    });

    this.emptyMsg?.classList.toggle('hidden', totalVisible > 0);
  }

  clearSearch() {
    this.emptyMsg?.classList.add('hidden');
    Object.values(this.sections).forEach((section) => {
      section?.querySelectorAll('[data-product-id]').forEach((card) => {
        card.style.display = '';
      });
    });
  }
}
