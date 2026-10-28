import { test } from '@playwright/test';

// Punto de partida de los agentes de IA (proyecto "seed").
// Depende del proyecto "setup", así que el navegador ya llega con la sesión iniciada,
// y abre directamente el inicio de LAFISErvicios.
test('seed', async ({ page }) => {
  await page.goto('/app/lafiservicios');
});
