// ⚠️ TEMPORAL — ver auth/README.md. Se elimina cuando el login venga del proyecto testing del host.

import fs from 'fs';

import { test as setup } from '@playwright/test';

import { hasActiveSession } from './session';
import { STORAGE_STATE } from './storage-state';

// Proyecto "setup": no inicia sesión, solo valida que la sesión guardada con
// `pnpm auth:manual` exista y siga vigente antes de ejecutar los escenarios.
setup('validar sesión', async ({ browser }) => {
  if (!fs.existsSync(STORAGE_STATE)) {
    throw new Error('No hay una sesión guardada. Ejecuta: pnpm auth:manual');
  }

  const context = await browser.newContext({ storageState: STORAGE_STATE });
  const active = await hasActiveSession(await context.newPage());
  await context.close();

  if (!active) {
    throw new Error('La sesión guardada expiró. Ejecuta: pnpm auth:manual');
  }
});
