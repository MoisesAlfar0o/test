import { expect } from '@playwright/test';

import { Then, When } from '../../fixtures';

Then('veo solo el paquete {string}', async ({ page }, texto: string) => {
  const rows = page.getByRole('table').getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
  await expect(rows.first()).toBeVisible();
  await expect(rows.filter({ hasNot: page.getByRole('cell', { name: texto, exact: true }) })).toHaveCount(0);
});
