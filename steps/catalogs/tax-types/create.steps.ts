import { When } from '../../fixtures';

When('guardo el tipo de impuesto', async ({ page }) => {
  // El formulario repite la misma acción junto al título y al final del formulario.
  await page.getByRole('button', { name: 'Guardar', exact: true }).first().click();
});
