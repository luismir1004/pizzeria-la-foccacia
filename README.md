# 🍕 Pizzería La Foccacia

**Sabor Artesanal & Experiencia Digital Premium**

Bienvenido al repositorio oficial de **La Foccacia**, una plataforma web moderna diseñada para una pizzería gourmet. Este proyecto destaca por su interfaz de usuario "High-End", animaciones fluidas y una experiencia de compra optimizada.

## ✨ Características Principales

### 🎨 Diseño UI/UX Premium
- **Estética "Toscana Gourmet"**: Paleta de colores elegante (Rojo Vino, Dorado, Cremas).
- **Glassmorphism Avanzado**: Elementos de navegación y modales con efectos de cristal esmerilado (`backdrop-blur`).
- **Navegación Intuitiva**: Menú de filtros tipo "Cápsula Flotante" con iconos SVG personalizados.
- **Tipografía**: Combinación de *Playfair Display* (Títulos) y *Lato* (Cuerpo) para máxima legibilidad y estilo.

### 🛠 Tecnología
- **Frontend**: HTML5, JavaScript (ES6+ Modules), Tailwind CSS v4.
- **Build Tool**: Vite para un rendimiento ultrarrápido.
- **PWA Ready**: Configurado como Progressive Web App (Iconos, Manifest, Service Workers).

## 🚀 Instalación y Desarrollo

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/luismir1004/pizzeria-la-foccacia.git
    cd pizzeria-la-foccacia/frontend
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Iniciar servidor de desarrollo**:
    ```bash
    npm run dev
    ```

4.  **Construir para producción**:
    ```bash
    npm run build
    ```

## 📂 Estructura del Proyecto

```
/frontend
  ├── /public          # Assets estáticos (Imágenes, Iconos)
  ├── /src
  │   ├── /components  # Componentes JS (Modal, Navbar, Renderer)
  │   ├── /data        # JSON de productos
  │   ├── main.js      # Punto de entrada
  │   └── index.css    # Estilos globales y Tailwind
  ├── index.html       # Página de Inicio
  └── menu.html        # Menú Interactivo
```

## 🌍 Despliegue en Vercel

Este proyecto está optimizado para **Vercel**.

1. Importa este repositorio en tu dashboard de Vercel.
2. Configura el **Root Directory** como `frontend`.
3. El **Framework Preset** se detectará automáticamente como *Vite*.
4. ¡Despliega!

---

© 2026 Pizzería La Foccacia - Desarrollado con pasión.
