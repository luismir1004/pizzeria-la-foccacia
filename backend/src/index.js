const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { serializeProduct } = require('./serialize');
const { validateContact } = require('./validation');
const { securityHeaders, corsOptions, rateLimit } = require('./security');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1); // detrás de proxy (Render/Vercel): IP real para rate-limit

// Middleware
app.use(securityHeaders);
app.use(cors(corsOptions()));
app.use(express.json({ limit: '8kb' })); // tope de payload

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🍕 Pizzería La Foccacia API v1.0', status: 'ok' });
});

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'up' });
  } catch (error) {
    res.status(503).json({ status: 'error', db: 'down' });
  }
});

// Categorías
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } });
    res.json(categories);
  } catch (error) {
    console.error('GET /api/categories', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// Productos (con filtros opcionales ?category= y ?featured=true)
app.get('/api/products', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const where = {};
    if (category) where.categoryId = String(category);
    if (featured === 'true') where.featured = true;

    const products = await prisma.product.findMany({
      where,
      include: { prices: true, extras: true },
      orderBy: { name: 'asc' },
    });
    res.json(products.map(serializeProduct));
  } catch (error) {
    console.error('GET /api/products', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Contacto: rate-limit + validación/saneamiento + honeypot + persistencia
app.post('/api/contact', rateLimit({ windowMs: 60_000, max: 5 }), async (req, res) => {
  // Honeypot: si el campo oculto viene relleno, es un bot.
  if (req.body && req.body.website) {
    return res.status(201).json({ ok: true }); // finge éxito sin hacer nada
  }

  const result = validateContact(req.body);
  if (!result.ok) {
    return res.status(422).json({ error: 'Datos de contacto inválidos', fields: result.errors });
  }

  try {
    await prisma.contactMessage.create({ data: result.data });
    // TODO: notificar por email (Resend/SES) cuando haya credenciales.
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('POST /api/contact', error);
    res.status(500).json({ error: 'No se pudo registrar el mensaje' });
  }
});

// Producto individual
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { prices: true, extras: true },
    });
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(serializeProduct(product));
  } catch (error) {
    console.error('GET /api/products/:id', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Arranque (se omite cuando el módulo se importa desde un test)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = { app, prisma };
