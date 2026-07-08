# Backend · Pizzería La Foccacia

API REST del catálogo (Express 5 + Prisma 7 + PostgreSQL).

## Requisitos

- Docker y Docker Compose
- Node.js v18+

## Puesta en marcha

1. Copia las variables de entorno y edítalas:

   ```bash
   cp .env.example .env
   # define al menos DATABASE_URL, POSTGRES_PASSWORD y PGADMIN_PASSWORD
   ```

2. Levanta la base de datos (y pgAdmin opcional):

   ```bash
   docker-compose up -d
   ```

   - **PostgreSQL** queda en el puerto `5432`.
   - **pgAdmin** en http://localhost:5050 (credenciales según tu `.env`).

3. Instala dependencias, genera el cliente, migra y siembra:

   ```bash
   npm install
   npm run generate
   npm run migrate:dev      # crea las tablas
   npm run seed             # carga el catálogo desde el products.json del frontend
   ```

4. Arranca el servidor:

   ```bash
   npm run dev              # con recarga en caliente
   # o
   npm start
   ```

## Endpoints

| Método | Ruta                | Descripción                                |
| ------ | ------------------- | ------------------------------------------ |
| GET    | `/`                 | Estado de la API                           |
| GET    | `/api/health`       | Salud del servicio y de la BD              |
| GET    | `/api/categories`   | Lista de categorías                        |
| GET    | `/api/products`     | Productos (`?category=`, `?featured=true`) |
| GET    | `/api/products/:id` | Producto individual con precios y extras   |

## Fuente de datos

El catálogo vive en `frontend/src/data/products.json` (fuente única de verdad).
El seed lo lee y lo carga en la base de datos, de modo que la API y el sitio
estático nunca divergen.

## Estructura

- `src/index.js` — servidor Express y rutas.
- `prisma/schema.prisma` — modelos `Category`, `Product`, `Price`, `Extra`.
- `prisma/seed.js` — carga inicial desde el JSON del frontend.

## Notas de seguridad

Ningún secreto se versiona: las credenciales viven en `.env` (ignorado por git).
`.env.example` documenta las variables con valores de marcador.
