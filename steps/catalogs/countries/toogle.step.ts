import { expect, type Page } from '@playwright/test';

import { Given, Then, When } from '../../fixtures';

function countrySwitch(page: Page, pais: string) {
  // El código es un badge. Su contenedor también contiene solo ese texto, así que
  // hay que quedarse con el badge y subir al grupo donde está el interruptor.
  const code = page.getByText(pais, { exact: true }).filter({
    hasNot: page.getByRole('switch'),
  });

  return code.locator('..').getByRole('switch');
}

async function leaveCountryEnabled(page: Page, pais: string, enabled: boolean) {
  const toggle = countrySwitch(page, pais);

  await expect(toggle).toBeVisible();
  if ((await toggle.isChecked()) === enabled) return;

  await toggle.click();
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  await (enabled ? expect(toggle).toBeChecked() : expect(toggle).not.toBeChecked());
}

Given('que el país {string} está habilitado', async ({ page }, pais: string) => {
  await leaveCountryEnabled(page, pais, true);
});

Given('que el país {string} está deshabilitado', async ({ page }, pais: string) => {
  await leaveCountryEnabled(page, pais, false);
});

When('deshabilito el país {string}', async ({ page }, pais: string) => {
  const toggle = countrySwitch(page, pais);

  await expect(toggle).toBeChecked();
  await toggle.click();
});

When('habilito el país {string}', async ({ page }, pais: string) => {
  const toggle = countrySwitch(page, pais);

  await expect(toggle).not.toBeChecked();
  await toggle.click();
});

Then('veo el país {string} deshabilitado', async ({ page }, pais: string) => {
  await expect(countrySwitch(page, pais)).not.toBeChecked();
});

Then('veo el país {string} habilitado', async ({ page }, pais: string) => {
  await expect(countrySwitch(page, pais)).toBeChecked();
});
