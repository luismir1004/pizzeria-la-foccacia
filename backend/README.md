# Backend Pizzería

Este es el servidor API para la Pizzería La Foccacia.

## Requisitos
- Docker y Docker Compose
- Node.js v18+ (opcional si usas Docker)

## Cómo iniciar (Modo Profesional)

Simplemente ejecuta:

```bash
docker-compose up -d
```

Esto iniciará:
1.  **PostgreSQL**: Base de datos en el puerto 5432.
2.  **pgAdmin**: Interfaz visual en http://localhost:5050 (Email: `admin@admin.com`, Password: `password123`).

## Cómo iniciar (Modo Desarrollo Local)

1.  Asegúrate de que la base de datos esté corriendo (docker-compose up -d postgres).
2.  Instala dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor:
    ```bash
    npm run dev
    ```

## Estructura
- `src/index.js`: Punto de entrada del servidor.
- `prisma/schema.prisma`: Definición de la base de datos.
