import { expect } from '@playwright/test';
import { Given, Then, When } from '../../../steps/fixtures';
// Misma forma que steps/ del repo de pruebas.
// bddgen solo lee features/ y steps/, así que esta carpeta no entra en pnpm test.
// Si copias el .feature a features/, reutiliza los pasos que ya existen y no copies este archivo.
function dataRows(page) {
  return page.getByRole('table').getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
}

Given('que abro la ruta {string}', async ({ page }, ruta: string) => {
  await page.goto(ruta);
});
When('hago clic en el botón {string}', async ({ page }, nombre: string) => {
  await page.getByRole('button', { name: nombre, exact: true }).click();
});
When('hago clic en el enlace {string}', async ({ page }, nombre: string) => {
  await page.getByRole('link', { name: nombre, exact: true }).click();
});
When('hago clic en la pestaña {string}', async ({ page }, nombre: string) => {
  await page.getByRole('tab', { name: nombre, exact: true }).click();
});
When('escribo {string} en el campo {string}', async ({ page }, valor: string, campo: string) => {
  await page.getByPlaceholder(campo).fill(valor);
});
Then('veo solo la categoría {string}', async ({ page }, categoria: string) => {
  const rows = dataRows(page);
  await expect(rows.first()).toBeVisible();
  await expect(rows.filter({ hasNot: page.getByRole('cell', { name: categoria, exact: true }) })).toHaveCount(0);
});