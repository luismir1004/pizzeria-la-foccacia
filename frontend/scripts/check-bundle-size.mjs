/**
 * Presupuesto de tamaño de bundle. Falla el build si los assets superan el
 * umbral (bytes en bruto). Evita regresiones silenciosas de peso.
 */
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'dist/assets';
const BUDGET = { js: 300_000, css: 120_000 }; // bytes

let jsMax = 0;
let cssMax = 0;
try {
  for (const f of readdirSync(DIR)) {
    const size = statSync(join(DIR, f)).size;
    if (f.endsWith('.js')) jsMax = Math.max(jsMax, size);
    if (f.endsWith('.css')) cssMax = Math.max(cssMax, size);
  }
} catch {
  console.error(`No se encontró ${DIR}. Ejecuta "npm run build" primero.`);
  process.exit(1);
}

const rows = [
  ['JS (mayor)', jsMax, BUDGET.js],
  ['CSS (mayor)', cssMax, BUDGET.css],
];
let failed = false;
for (const [label, size, budget] of rows) {
  const kb = (size / 1024).toFixed(1);
  const max = (budget / 1024).toFixed(0);
  const ok = size <= budget;
  if (!ok) failed = true;
  console.log(`${ok ? '✔' : '✖'} ${label}: ${kb} KB (máx ${max} KB)`);
}
process.exit(failed ? 1 : 0);
