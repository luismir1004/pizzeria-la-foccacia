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

/** Validación mínima de la forma del catálogo antes de sembrar. */
function validateCatalog(data) {
  const errors = [];
  if (!Array.isArray(data.categories) || !data.categories.length) errors.push('categories vacío');
  if (!Array.isArray(data.products) || !data.products.length) errors.push('products vacío');
  const catIds = new Set((data.categories || []).map((c) => c.id));
  for (const p of data.products || []) {
    if (!p.id) errors.push('producto sin id');
    if (!catIds.has(p.category)) errors.push(`${p.id}: categoría desconocida "${p.category}"`);
    if (!Array.isArray(p.prices) || !p.prices.length) errors.push(`${p.id}: sin precios`);
    for (const pr of p.prices || []) {
      if (typeof pr.price !== 'number' || pr.price <= 0) errors.push(`${p.id}: precio inválido`);
      if (!pr.size) errors.push(`${p.id}: tamaño sin nombre`);
    }
  }
  if (errors.length) {
    throw new Error(`products.json inválido:\n - ${errors.join('\n - ')}`);
  }
}

async function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const data = JSON.parse(raw);
  validateCatalog(data);

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
