# 0001 — Agentes de IA propios para trabajar con BDD (Gherkin)

- **Estado:** aceptada
- **Fecha:** 2026-10-19

## Contexto

Queremos que las pruebas E2E del frontend de LAFISErvicios (BackOffice) se escriban en **Gherkin en español** (BDD), para que
negocio y QA funcional puedan leer, revisar y escribir los escenarios, y que sirvan como criterios de
aceptación. También queremos usar **IA** para planificar, generar y mantener esas pruebas.

Playwright incluye agentes de IA oficiales (`npx playwright init-agents`, desde la versión 1.56):

| Agente oficial | Qué produce |
|---|---|
| `playwright-test-planner` | Un plan en Markdown libre (`specs/*.md`) |
| `playwright-test-generator` | Tests de Playwright puro (`tests/*.spec.ts`) con `generator_write_test` |
| `playwright-test-healer` | Correcciones sobre esos `.spec.ts` |

**No sirven tal cual para BDD:**

- El generator escribe `.spec.ts`, no `.feature` + step definitions, y no reutiliza pasos existentes.
- El healer editaría los tests generados en `.features-gen/`, que `bddgen` sobrescribe en cada ejecución.
- No conocen cómo obtenemos la sesión del BackOffice ni nuestras reglas de seguridad.

## Decisión

Crear tres agentes propios en `.claude/agents/`, basados en los oficiales, que usan **el mismo
servidor MCP de Playwright** (`npx playwright run-test-mcp-server`, en `.mcp.json`) y sus herramientas,
pero adaptados a playwright-bdd:

| Agente | Cambio respecto al oficial |
|---|---|
| `bdd-planner` | Escribe `features/<area>/*.feature` en Gherkin en español en vez de Markdown. Antes lee los steps existentes y **reutiliza sus frases literalmente**. |
| `bdd-generator` | Usa `pnpm bddgen` para detectar los pasos que faltan, los ejecuta en el navegador real (`generator_setup_page` / `generator_read_log`) y escribe **step definitions** en `steps/` en lugar de `.spec.ts`. No usa `generator_write_test`. |
| `bdd-healer` | Corrige en `steps/` (o agrega `@fixme` en el `.feature` si es un defecto de la app) y **nunca** edita `.features-gen/`. Distingue fallos de login o de ambiente de fallos de la prueba. |

Los tres además:

- Parten de `seed/seed.spec.ts` (proyecto `seed`), que depende del proyecto `setup` y por tanto
  llega con la sesión iniciada (hoy, la sesión manual; ver decisión 0002).
- No ejecutan acciones irreversibles ni escriben credenciales o datos reales.
- Leen `CLAUDE.md`, donde están las convenciones del repositorio.

## Consecuencias

- **No ejecutar `npx playwright init-agents`** en este repositorio: agregaría los agentes oficiales
  (que generan `.spec.ts`) y sobrescribiría `.mcp.json`.
- Al actualizar Playwright, revisar si cambiaron las herramientas del MCP (`planner_*`, `generator_*`,
  `test_*`, `browser_*`) y ajustar la lista `tools:` de cada agente. Las definiciones oficiales de la
  versión instalada están en `node_modules/playwright/lib/agents/` como referencia.
- Los agentes son Markdown: cualquier mejora en su comportamiento se hace editando esos archivos y
  pasa por revisión en un pull request, como el resto del código.
- Sigue siendo necesaria la revisión humana: del `.feature` (negocio/QA) y de los steps (código).
