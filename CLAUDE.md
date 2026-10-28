# lafiservicios-frontend-qa-automation

Automatización de pruebas (QA) del frontend de **LAFISErvicios**, micro-frontend del BackOffice LAFISE
(se accede por el host `internal-host`, ruta `/app/lafiservicios`). Son pruebas end-to-end de caja negra
contra un ambiente desplegado o local; este repositorio no contiene código de la aplicación
(repo de la app: `rgnl-backoffice-lafiservicios`).

Cada micro-frontend tiene su propio repo de pruebas con esta misma estructura; lo común (login y base
de los micro-frontends) vendrá de `@lafise/testing`.

## Stack

- Playwright + playwright-bdd. Escenarios en Gherkin en español (`# language: es`).
- pnpm (obligatorio). Node según `.nvmrc`.
- El equipo trabaja en **Windows y macOS**. No poner en scripts, configuración ni documentación comandos
  propios de un solo sistema (`cmd`, `copy`, rutas con `\`) sin dar la alternativa del otro. En
  particular, `.mcp.json` lanza el servidor con `node node_modules/@playwright/test/cli.js`: no
  cambiarlo a `npx` ni a `cmd /c`, porque rompería un sistema (ver `docs/adr/0004-cross-platform-mcp-server-command.md`).
- El login (OneLogin + MFA) y la base común de los micro-frontends se centralizarán en el proyecto
  testing del host (`@lafise/testing`). Hasta entonces se usa un login manual temporal (`auth/`).

## Estructura

- `features/<area>/<feature>.feature`: escenarios por área funcional de LAFISErvicios
  (ej. `features/services/consultation.feature`). `features/smoke/` para pruebas de humo.
- `steps/fixtures.ts`: exporta `Given`, `When`, `Then`. Todos los pasos se importan desde aquí.
- `steps/common.steps.ts`: pasos genéricos (abrir ruta, clic en botón o enlace, ver texto…).
- `steps/<area>/*.steps.ts`: pasos propios de un área.
- `auth/`: ⚠️ temporal. Login manual (`pnpm auth:manual`) y proyecto `setup`, que valida la sesión
  guardada en `test-results/.auth/`. Ver `auth/README.md`.
- `.claude/agents/` y `.claude/commands/`: agentes de IA y comando `/new-test` (ver "Agentes de IA").
- `seed/seed.spec.ts`: proyecto `seed`; solo para los agentes de IA (navegador ya autenticado).
- `.features-gen/`: generado por `bddgen`. No editar ni versionar.

## Comandos

- `pnpm test`: genera y ejecuta todos los escenarios (antes valida la sesión).
- `pnpm test:smoke`: solo escenarios `@smoke`.
- `pnpm bddgen`: genera los tests; falla y lista los pasos que faltan por implementar.
- `pnpm auth:manual`: login manual (abre el navegador). Lo ejecuta siempre la persona, nunca un
  agente: requiere escribir credenciales.

## Autenticación (temporal)

- El proyecto `setup` no inicia sesión: valida la sesión guardada por `pnpm auth:manual`.
- Si falla con "No hay una sesión guardada" o "La sesión guardada expiró", hay que pedirle a la persona
  que ejecute `pnpm auth:manual`; no es un fallo de las pruebas.
- Las acciones quedan registradas con el usuario personal de quien inició sesión: extremar el cuidado
  con acciones que modifiquen datos. Motivo: `docs/adr/0002-temporary-manual-login.md`.
- No agregar lógica de login automático en este repo: vendrá de `@lafise/testing`.

## Convenciones

- **Nombres de archivos y carpetas en inglés** (kebab-case). El contenido puede ir en español:
  el texto Gherkin de los `.feature`, las descripciones y los comentarios.
- Frases en lenguaje de negocio y reutilizables; datos variables entre comillas (`{string}`) o
  números (`{int}`). Reutilizar frases existentes antes de crear nuevas.
- `<area>` = segmento de ruta bajo `/app/lafiservicios/managements/` en inglés (`services`, `payments`,
  `settlements`, `approvals`…). Se usa en la carpeta del feature, en sus steps y en la etiqueta.
- Etiquetas: `@<area>` en cada característica, `@smoke` en escenarios críticos y rápidos,
  `@fixme` para escenarios bloqueados por un defecto (con comentario `# POSIBLE DEFECTO: ...`).
- Selectores: `getByRole` > `getByLabel` > `getByPlaceholder` > `getByText` > `getByTestId`.
  Nada de XPath ni clases CSS (Tailwind).
- Aserciones web-first con `expect`. Prohibido `waitForTimeout` y `networkidle`.
- Escenarios independientes entre sí, partiendo de la sesión iniciada.

## Agentes de IA

- `.claude/agents/bdd-planner.md`, `bdd-generator.md` y `bdd-healer.md` son versiones propias de los
  agentes oficiales de Playwright, adaptadas para trabajar con Gherkin y playwright-bdd.
  El motivo y las diferencias están en `docs/adr/0001-ai-agents-with-bdd.md`.
- `.claude/commands/new-test.md` define el comando `/new-test`: crea una prueba a partir de una
  descripción en lenguaje natural (escribe el `.feature`, espera aprobación, implementa los steps con
  `bdd-generator` y verifica). No usa `bdd-planner`, no hace commit ni push, y por ahora solo para
  flujos de lectura. Flujo completo en `docs/workflow.md`.
- No ejecutar `npx playwright init-agents`: agrega los agentes oficiales (que generan `.spec.ts`)
  y sobrescribe `.mcp.json`.
- El flujo de trabajo del equipo (revisiones, `@fixme` con ticket de Jira, ramas `test/<TICKET>-...`,
  commits `test(<TICKET>): ...`) está en `docs/workflow.md`.

## Seguridad

- Nunca credenciales en código, features, `.env.example` ni commits.
- No ejecutar acciones irreversibles o con efecto real (aprobar, desembolsar, notificar a clientes)
  salvo que un escenario lo pida explícitamente y el ambiente sea de pruebas.
- Usar solo datos de prueba; nunca datos reales de clientes.
