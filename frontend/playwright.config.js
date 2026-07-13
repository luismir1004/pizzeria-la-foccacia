import { defineConfig, devices } from '@playwright/test';

/**
 * E2E con Playwright. Levanta el preview del build y prueba el flujo de pedido.
 * En este entorno Chromium ya está disponible (PLAYWRIGHT_BROWSERS_PATH).
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: process.env.CI ? 'list' : 'line',
  use: {
    baseURL: 'http://localhost:4173',
    headless: true,
    launchOptions: {
      args: ['--no-sandbox'],
      // En entornos con Chromium preinstalado (build distinto al de Playwright),
      // apuntar al binario vía PW_CHROMIUM. En CI queda vacío y usa el suyo.
      executablePath: process.env.PW_CHROMIUM || undefined,
    },
  },
  webServer: {
    command: 'npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
