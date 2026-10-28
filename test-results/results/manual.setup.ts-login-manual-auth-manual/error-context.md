# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\manual.setup.ts >> login manual
- Location: auth\manual.setup.ts:11:6

# Error details

```
Error: page.waitForURL: Target page, context or browser has been closed
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Test source

```ts
  1  | // ⚠️ TEMPORAL — ver auth/README.md. Se elimina cuando el login venga del proyecto testing del host.
  2  | 
  3  | import { test as setup } from '@playwright/test';
  4  | 
  5  | import { AFTER_SIGN_IN_PATH } from './session';
  6  | import { STORAGE_STATE } from './storage-state';
  7  | 
  8  | // Login manual (pnpm auth:manual): abre el navegador, la persona inicia sesión con su propio
  9  | // usuario y MFA, y se guarda la sesión para que la reutilicen las pruebas y los agentes.
  10 | // No guarda contraseñas ni secretos MFA en ningún archivo.
  11 | setup('login manual', async ({ page, baseURL }) => {
  12 |   setup.setTimeout(6 * 60_000);
  13 | 
  14 |   await page.goto('/');
  15 |   await page.getByTestId('sign-in-button').click();
  16 | 
  17 |   console.log(
  18 |     '\n👉 Inicia sesión en la ventana del navegador (usuario, contraseña y MFA).' +
  19 |       '\n   Tienes 5 minutos. La sesión se guardará al llegar al BackOffice.\n',
  20 |   );
  21 | 
  22 |   const origin = new URL(baseURL!).origin;
> 23 |   await page.waitForURL(
     |              ^ Error: page.waitForURL: Target page, context or browser has been closed
  24 |     (url) => url.origin === origin && url.pathname.startsWith(AFTER_SIGN_IN_PATH),
  25 |     { timeout: 5 * 60_000 },
  26 |   );
  27 |   await page.waitForLoadState('load');
  28 | 
  29 |   await page.context().storageState({ path: STORAGE_STATE });
  30 |   console.log('\n✅ Sesión guardada. Ya puedes ejecutar pnpm test.\n');
  31 | });
  32 | 
```