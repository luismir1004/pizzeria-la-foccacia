/**
 * Utilidades de seguridad sin dependencias externas: cabeceras, CORS por
 * whitelist y un rate-limiter en memoria por IP.
 */

/** Cabeceras de seguridad básicas (sustituto ligero de helmet). */
function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  next();
}

/**
 * Opciones de CORS. Restringe a los orígenes de ALLOWED_ORIGINS (coma-separados).
 * Si la variable no está definida, refleja el origen (modo desarrollo).
 */
function corsOptions() {
  const allow = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    origin(origin, cb) {
      if (!origin || allow.length === 0 || allow.includes(origin)) return cb(null, true);
      cb(new Error('Origen no permitido por CORS'));
    },
    methods: ['GET', 'POST'],
    maxAge: 86400,
  };
}

/**
 * Rate-limiter en memoria. Devuelve un middleware que limita a `max`
 * peticiones por `windowMs` y por IP. Suficiente para proteger endpoints
 * de escritura en una sola instancia; para varias, usar Redis.
 */
function rateLimit({ windowMs = 60_000, max = 10 } = {}) {
  const hits = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const entry = hits.get(ip);

    if (!entry || now > entry.reset) {
      hits.set(ip, { count: 1, reset: now + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      const retry = Math.ceil((entry.reset - now) / 1000);
      res.setHeader('Retry-After', String(retry));
      return res.status(429).json({ error: 'Demasiadas solicitudes, intenta más tarde.' });
    }
    next();
  };
}

module.exports = { securityHeaders, corsOptions, rateLimit };
