/**
 * Validación y saneamiento del formulario de contacto (módulo puro, testeable).
 */
const LIMITS = { nombre: 80, email: 120, mensaje: 2000 };
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
// Caracteres de control ASCII (C0 + DEL).
const CONTROL_RE = new RegExp('[\\u0000-\\u001F\\u007F]', 'g');

/** Recorta espacios y elimina caracteres de control. */
function clean(str, max) {
  return String(str ?? '')
    .replace(CONTROL_RE, '')
    .trim()
    .slice(0, max);
}

/**
 * @returns {{ ok: boolean, errors: string[], data?: {nombre,email,mensaje} }}
 */
function validateContact(input = {}) {
  const nombre = clean(input.nombre, LIMITS.nombre);
  const email = clean(input.email, LIMITS.email);
  const mensaje = clean(input.mensaje, LIMITS.mensaje);
  const errors = [];

  if (nombre.length < 2) errors.push('nombre');
  if (!EMAIL_RE.test(email)) errors.push('email');
  if (mensaje.length < 10) errors.push('mensaje');

  return errors.length
    ? { ok: false, errors }
    : { ok: true, errors: [], data: { nombre, email, mensaje } };
}

module.exports = { validateContact, LIMITS };
