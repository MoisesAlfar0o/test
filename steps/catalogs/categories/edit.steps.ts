import { When } from '../../fixtures';

When('guardo la categoría', async ({ page }) => {
  // El formulario repite la misma acción junto al título y al final del formulario.
  await page.getByRole('button', { name: 'Guardar', exact: true }).first().click();
});

When('edito la categoría {string}', async ({ page }, categoria: string) => {
  const fila = page.getByRole('row').filter({
    has: page.getByRole('cell', { name: categoria, exact: true }),
  });

  await fila.getByRole('button', { name: 'Editar categoría', exact: true }).click();
});
