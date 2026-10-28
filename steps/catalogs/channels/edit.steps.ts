import { When } from '../../fixtures';

When('edito el canal {string}', async ({ page }, canal: string) => {
  const fila = page.getByRole('row').filter({
    has: page.getByRole('cell', { name: canal, exact: true }),
  });

  await fila.getByRole('button', { name: 'Editar canal', exact: true }).click();
});
