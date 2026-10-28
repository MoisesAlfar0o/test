import { When } from '../../fixtures';

When('edito el tipo de impuesto {string}', async ({ page }, tipo: string) => {
  const fila = page.getByRole('row').filter({
    has: page.getByRole('cell', { name: tipo, exact: true }),
  });

  await fila.getByRole('button', { name: 'Editar tipo de impuesto', exact: true }).click();
});
