/**
 * Seed de la base de datos.
 * Fuente única de verdad: frontend/src/data/products.json.
 * Ejecuta: npm run seed  (o  npx prisma db seed)
 */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DATA_PATH = path.resolve(
  __dirname,
  '../../frontend/src/data/products.json'
);

async function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const data = JSON.parse(raw);

  console.log(`Sembrando desde ${DATA_PATH}`);

  // Limpieza idempotente (respeta el orden de las relaciones).
  await prisma.extra.deleteMany();
  await prisma.price.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Categorías
  for (const [index, cat] of data.categories.entries()) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        description: cat.description ?? null,
        order: index,
      },
    });
  }

  // Productos con precios y extras anidados
  for (const p of data.products) {
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        categoryId: p.category,
        image: p.image,
        alt: p.alt ?? null,
        ingredients: p.ingredients ?? [],
        preparation: p.preparation ?? null,
        featured: p.featured ?? false,
        prices: {
          create: (p.prices ?? []).map((pr) => ({
            size: pr.size,
            price: pr.price,
          })),
        },
        extras: {
          create: (p.extras ?? []).map((ex) => ({
            name: ex.name,
            price: ex.price,
          })),
        },
      },
    });
  }

  const [categories, products] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
  ]);
  console.log(`✔ Seed completo: ${categories} categorías, ${products} productos.`);
}

main()
  .catch((e) => {
    console.error('✖ Error en el seed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
