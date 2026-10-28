import { expect, type Page } from '@playwright/test';
import { DataTable } from 'playwright-bdd';

import { Then } from '../../fixtures';

function dataRows(page: Page) {
  return page
    .getByRole('table')
    .getByRole('row')
    .filter({ hasNot: page.getByRole('columnheader') });
}

Then('veo solo la categoría {string}', async ({ page }, categoria: string) => {
  const rows = dataRows(page);

  await expect(rows.first()).toBeVisible();
  await expect(
    rows.filter({
      hasNot: page.getByRole('cell', { name: categoria, exact: true }),
    }),
  ).toHaveCount(0);
});

Then('veo las siguientes categorías en la tabla:', async ({ page }, dataTable: DataTable) => {
  const categoriasEsperadas = dataTable.raw().map((row) => row[0]);

  for (const categoria of categoriasEsperadas) {
    await expect(page.getByRole('cell', { name: categoria, exact: true }).first()).toBeVisible();
  }
});
