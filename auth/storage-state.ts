// ⚠️ TEMPORAL — ver auth/README.md. Se elimina cuando el login venga del proyecto testing del host.

import path from 'path';

// Sesión guardada por `pnpm auth:manual` y reutilizada por las pruebas y los agentes.
// Está en test-results/ (ignorado por git) porque contiene tokens.
export const STORAGE_STATE = path.join(__dirname, '..', 'test-results', '.auth', 'user.json');
