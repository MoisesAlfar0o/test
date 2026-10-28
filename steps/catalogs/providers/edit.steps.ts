import { When } from '../../fixtures';

When('edito el proveedor {string}', async ({ page }, proveedor: string) => {
  const fila = page.getByRole('row').filter({
    has: page.getByRole('cell', { name: proveedor, exact: true }),
  });

  await fila.getByRole('button', { name: 'Editar proveedor', exact: true }).click();
});
