import { expect, type Page } from '@playwright/test';

import { Then } from '../fixtures';

function dataRows(page: Page) {
  return page
    .getByRole('table')
    .getByRole('row')
    .filter({ hasNot: page.getByRole('columnheader') });
}

Then('veo solo servicios con estado {string}', async ({ page }, estado: string) => {
  const rows = dataRows(page);

  await expect(rows.first()).toBeVisible();
  await expect(
    rows.filter({
      hasNot: page.getByRole('cell', { name: estado, exact: true }),
    }),
  ).toHaveCount(0);
});
