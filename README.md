# 🍕 Pizzería La Foccacia

**Sabor Artesanal & Experiencia Digital Premium**

Plataforma web para una pizzería gourmet: un frontend orientado a datos (PWA)
y una API REST que comparten una única fuente de verdad del catálogo.

## ✨ Características

### 🎨 Frontend
- Estética "Toscana Gourmet" (Rosso & Oro) con tokens de diseño y **modo oscuro** completo.
- **Orientado a datos**: las tarjetas de producto se generan desde el catálogo
  (API con *fallback* automático al JSON local), sin HTML escrito a mano.
- Carrito con **cantidades**, persistencia y checkout por WhatsApp.
- Modal accesible (`role="dialog"`, *focus trap*, restauración de foco).
- Imágenes `webp`+`png` con `<picture>` y *lazy loading* que no rompe sin JavaScript.
- PWA (service worker, manifest) y SEO (Open Graph absoluto, Schema.org).

### 🛠 Stack
- **Frontend**: HTML5, JavaScript ES6, Tailwind CSS v4, Vite, vite-plugin-pwa.
- **Backend**: Node.js, Express 5, Prisma 7, PostgreSQL.
- **Calidad**: ESLint 9 (flat config), Prettier, tests con `node:test`, CI en GitHub Actions.

## 📂 Estructura

```
/frontend
  ├── src/
  │   ├── components/   # Navbar, Footer, Modal, Cart, Renderer, ImageOptimizer
  │   ├── services/     # api.js  (API con fallback a JSON local)
  │   ├── lib/          # cartMath.js  (lógica pura del carrito, testeable)
  │   ├── data/         # products.json  ← fuente única de verdad del catálogo
  │   ├── config.js     # datos de negocio (WhatsApp, sucursales, API URL)
  │   └── main.js
  ├── test/             # tests de cartMath
  ├── index.html · menu.html · contacto.html
/backend
  ├── src/              # servidor Express + serialize.js
  ├── prisma/           # schema.prisma + seed.js
  └── test/             # tests de serialización
/.github/workflows      # CI (lint · test · build)
```

## 🚀 Desarrollo

### Frontend
```bash
cd frontend
npm install
npm run dev        # servidor de desarrollo
npm run lint       # eslint
npm test           # node:test
npm run build      # build de producción
```

Configura opcionalmente `VITE_API_URL` (ver `frontend/.env.example`). Si queda
vacío, el sitio funciona de forma autónoma con el catálogo local.

### Backend
Ver [`backend/README.md`](backend/README.md). Resumen:
```bash
cd backend
cp .env.example .env         # define DATABASE_URL y contraseñas
docker-compose up -d         # PostgreSQL + pgAdmin
npm install && npm run generate && npm run migrate:dev && npm run seed
npm run dev
```

## 🌍 Despliegue

- **Frontend → Vercel**: Root Directory `frontend`, preset Vite autodetectado
  (`vercel.json` en la raíz). Define `VITE_API_URL` si conectas el backend.
- **Backend → Render / Railway / Fly.io**: provee una base PostgreSQL, define
  `DATABASE_URL`, y ejecuta `npm run migrate && npm run seed` en el arranque.

## 🔒 Datos y secretos

El catálogo vive **una sola vez** en `frontend/src/data/products.json`; el
backend lo siembra en la base de datos. Ningún secreto se versiona: las
credenciales se leen de archivos `.env` (documentados en los `.env.example`).

---

© 2026 Pizzería La Foccacia — Desarrollado con pasión.
