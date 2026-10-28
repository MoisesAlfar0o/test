import { expect } from '@playwright/test';

import { Given, Then, When } from './fixtures';

// Pasos genéricos reutilizables en cualquier área de LAFISErvicios (y del BackOffice).
// Los pasos propios de un área van en steps/<area>/*.steps.ts.

Given('que abro el BackOffice', async ({ page }) => {
  await page.goto('/');
});

Given('que abro la ruta {string}', async ({ page }, ruta: string) => {
  await page.goto(ruta);
});

When('hago clic en el botón {string}', async ({ page }, nombre: string) => {
  await page.getByRole('button', { name: nombre, exact: true }).click();
});

When('hago clic en el enlace {string}', async ({ page }, nombre: string) => {
  await page.getByRole('link', { name: nombre, exact: true }).click();
});

When('hago clic en el enlace {string} del menú', async ({ page }, nombre: string) => {
  await page.getByRole('complementary').getByRole('link', { name: nombre, exact: true }).click();
});

When('hago clic en la pestaña {string}', async ({ page }, nombre: string) => {
  await page.getByRole('tab', { name: nombre, exact: true }).click();
});

When('escribo {string} en el campo {string}', async ({ page }, valor: string, campo: string) => {
  const porEtiqueta = page.getByLabel(campo, { exact: true });
  const porPlaceholder = page.getByPlaceholder(campo, { exact: true });

  await porEtiqueta.or(porPlaceholder).fill(valor);
});

When('borro el campo {string}', async ({ page }, campo: string) => {
  await page.getByLabel(campo).clear();
});

Then('veo el texto {string}', async ({ page }, texto: string) => {
  await expect(page.getByText(texto).first()).toBeVisible();
});

Then('veo el título {string}', async ({ page }, titulo: string) => {
  // exact: evita que "Módulos" coincida también con "Todos los módulos" o "Sin módulos favoritos"
  await expect(page.getByRole('heading', { name: titulo, exact: true })).toBeVisible();
});

Then('la URL contiene {string}', async ({ page }, fragmento: string) => {
  await expect(page).toHaveURL(new RegExp(fragmento.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});
