import { test, expect } from '@playwright/test';

test('la home muestra las especialidades destacadas', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#featured-grid [data-product-id]');
  await expect(cards.first()).toBeVisible({ timeout: 10_000 });
  await expect(cards).toHaveCount(4);
  await expect(page.locator('#featured-grid').getByText('Popular').first()).toBeVisible();
});

test('flujo de pedido: abrir producto, elegir, agregar y ver el carrito', async ({ page }) => {
  await page.goto('/menu.html');

  // Esperar a que se rendericen las tarjetas (reemplazan a los esqueletos)
  const firstCard = page.locator('#pizzas-grid [data-product-id]').first();
  await expect(firstCard).toBeVisible({ timeout: 10_000 });

  // Abrir el modal
  await firstCard.click();
  const modal = page.locator('#product-modal');
  await expect(modal).toBeVisible();

  // El botón refleja un total en vivo
  const addBtn = page.locator('#modal-add-btn');
  await expect(addBtn).toContainText('Agregar');
  await expect(addBtn).toContainText('$');

  // Agregar al pedido
  await addBtn.click();

  // Aparece el toast de confirmación
  await expect(page.locator('#cart-toast')).toContainText('añadido al pedido');

  // El contador del carrito llega a 1
  await expect(page.locator('#cart-count')).toHaveText('1');

  // Abrir el carrito y comprobar el checkout
  await page.locator('#cart-btn').click();
  await expect(page.locator('#cart-drawer')).toBeVisible();
  await expect(page.locator('#checkout-btn')).toContainText('WhatsApp');
});

test('el buscador del menú filtra por texto', async ({ page }) => {
  await page.goto('/menu.html');
  await expect(page.locator('#pizzas-grid [data-product-id]').first()).toBeVisible({ timeout: 10_000 });

  await page.locator('#menu-search').fill('margherita');
  await expect(page.locator('[data-product-id="pizza-margherita"]')).toBeVisible();
  await expect(page.locator('[data-product-id="pizza-pepperoni"]')).toBeHidden();
});
