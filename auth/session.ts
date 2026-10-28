// ⚠️ TEMPORAL — ver auth/README.md. Se elimina cuando el login venga del proyecto testing del host.

import type { Page } from '@playwright/test';

// Ruta a la que el BackOffice redirige después de iniciar sesión (variable del host).
export const AFTER_SIGN_IN_PATH =
  process.env['NEXT_PUBLIC_INTERNAL_AFTER_SIGN_IN_PATH'] || '/app/home';

/**
 * Abre el BackOffice con la sesión del contexto y comprueba que sigue vigente:
 * si aparece el botón "Iniciar sesión con OneLogin", la sesión expiró.
 */
export async function hasActiveSession(page: Page): Promise<boolean> {
  await page.goto('/');

  const signInVisible = await page
    .getByTestId('sign-in-button')
    .waitFor({ state: 'visible', timeout: 15_000 })
    .then(() => true)
    .catch(() => false);

  return !signInVisible;
}
