// ⚠️ TEMPORAL — ver auth/README.md. Se elimina cuando el login venga del proyecto testing del host.

import { test as setup } from '@playwright/test';

import { AFTER_SIGN_IN_PATH } from './session';
import { STORAGE_STATE } from './storage-state';

// Login manual (pnpm auth:manual): abre el navegador, la persona inicia sesión con su propio
// usuario y MFA, y se guarda la sesión para que la reutilicen las pruebas y los agentes.
// No guarda contraseñas ni secretos MFA en ningún archivo.
setup('login manual', async ({ page, baseURL }) => {
  setup.setTimeout(6 * 60_000);

  await page.goto('/');
  await page.getByTestId('sign-in-button').click();

  console.log(
    '\n👉 Inicia sesión en la ventana del navegador (usuario, contraseña y MFA).' +
      '\n   Tienes 5 minutos. La sesión se guardará al llegar al BackOffice.\n',
  );

  const origin = new URL(baseURL!).origin;
  await page.waitForURL(
    (url) => url.origin === origin && url.pathname.startsWith(AFTER_SIGN_IN_PATH),
    { timeout: 5 * 60_000 },
  );
  await page.waitForLoadState('load');

  await page.context().storageState({ path: STORAGE_STATE });
  console.log('\n✅ Sesión guardada. Ya puedes ejecutar pnpm test.\n');
});
