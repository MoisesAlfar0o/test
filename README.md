# lafiservicios-frontend-qa-automation

Automatización de pruebas (QA) del **frontend de LAFISErvicios** en el BackOffice LAFISE, con
Playwright y escenarios en **Gherkin en español** (playwright-bdd), con agentes de IA que planifican,
implementan y reparan los escenarios.

Son pruebas end-to-end de caja negra: entran por el navegador al módulo LAFISErvicios del BackOffice
desplegado (o levantado en local) y no necesitan el código de la aplicación
(`rgnl-backoffice-lafiservicios`).

> 👋 **¿Primer día en este repo?** Empieza por [docs/getting-started.md](docs/getting-started.md).

## Requisitos

- Windows o macOS.
- Node.js (versión en `.nvmrc`) y pnpm.
- Acceso al registro npm interno de Azure Artifacts (el mismo que usan los repos del BackOffice).
- Tu usuario de OneLogin con acceso al BackOffice del ambiente que vas a probar.
- Acceso de red a ese ambiente.

## Configuración inicial

```bash
pnpm install
npx playwright install chromium
cp .env.example .env    # en PowerShell: Copy-Item .env.example .env
```

Completa `.env`:

| Variable | Qué es |
|---|---|
| `NEXT_PUBLIC_INTERNAL_ZONE_HOST_URL` | URL raíz del BackOffice a probar (dev: `https://backoffice-dev.lafise.app/`, local o QA) |
| `NEXT_PUBLIC_INTERNAL_AFTER_SIGN_IN_PATH` | Ruta a la que redirige el BackOffice tras el login (`/app/home`) |
| `PLAYWRIGHT_HEADLESS` | `true` para no ver el navegador |
| `PLAYWRIGHT_SLOW_MO` | Cámara lenta, en milisegundos entre acciones |

### Inicio de sesión (⚠️ temporal)

El login automático y la base común de los micro-frontends se van a centralizar en el proyecto
**testing del host** (`internal-host`, paquete `@lafise/testing`). Mientras tanto, se inicia sesión
**a mano**:

```bash
pnpm auth:manual
```

Se abre el navegador, inicias sesión con tu usuario y tu MFA habituales, y la sesión se guarda en
`test-results/.auth/` (ignorado por git). No se guardan contraseñas ni secretos MFA. Cuando la
sesión expire, `pnpm test` lo indicará: vuelve a ejecutar `pnpm auth:manual`.

Úsalo solo en local y contra dev: todo lo que hagan las pruebas o los agentes queda registrado con
tu usuario. Detalles y cómo retirarlo: [auth/README.md](auth/README.md).

## Ejecutar

```bash
pnpm test          # todos los escenarios
pnpm test:smoke    # solo @smoke
pnpm test:headed   # viendo el navegador
pnpm test:ui       # modo interactivo de Playwright
pnpm test:trace    # graba una traza completa de cada prueba
pnpm report        # reporte HTML
```

### Ver la ejecución

| Forma | Cómo | Para qué |
|---|---|---|
| **Navegador visible** | `PLAYWRIGHT_HEADLESS` vacío en `.env` (por defecto), o `pnpm test:headed` | Ver la prueba en tiempo real |
| **Cámara lenta** | `PLAYWRIGHT_SLOW_MO=500` en `.env` | Seguir cada acción con calma (demos, depuración) |
| **Modo UI** | `pnpm test:ui` | Elegir pruebas, verlas paso a paso, línea de tiempo, DOM, red y consola |
| **Traza** | `pnpm test:trace` y luego `pnpm report` → abrir la traza de la prueba | Revisar después, paso a paso y con capturas, lo que pasó |
| **Reporte HTML** | `pnpm report` | Resultados, capturas de los fallos y trazas |

En el pipeline las trazas se graban automáticamente en el reintento de una prueba que falló, y
quedan dentro del artefacto `playwright-report-*`.

## Estructura

```
features/<area>/*.feature      Escenarios en Gherkin (el QUÉ) por área de LAFISErvicios. Los revisa negocio/QA.
steps/common.steps.ts         Pasos genéricos reutilizables.
steps/<area>/*.steps.ts        Pasos propios de cada área (el CÓMO).
steps/fixtures.ts              Given/When/Then compartidos.
auth/                          ⚠️ Temporal: login manual (pnpm auth:manual) y validación de sesión.
seed/                          Punto de partida de los agentes de IA.
.claude/agents/                Agentes de IA (planner, generator, healer).
.claude/commands/new-test.md   Comando /new-test: crea una prueba desde lenguaje natural.
.mcp.json                      Servidor MCP de Playwright para los agentes.
.azuredevops/pipeline.yml      Pipeline de ejecución en Azure DevOps.
docs/workflow.md               Cómo se trabaja: de la historia de usuario al pipeline.
docs/adr/                      Registros de decisión (ADRs): por qué está hecho así.
```

## Trabajar con IA (Claude Code)

Abre Claude Code en esta carpeta (`claude`). La primera vez, aprueba el servidor MCP `playwright-test`.
Comprueba con `/mcp` y `/agents`.

### Crear una prueba con una sola instrucción: `/new-test`

Si ya sabes qué quieres probar, descríbelo en lenguaje natural (**dónde**, **qué haces** y **qué debe
pasar**) y la IA escribe el Gherkin y los pasos por debajo:

```
/new-test En Servicios, país Nicaragua, busco "Agua" y debo ver solo servicios cuyo nombre contenga "Agua"
```

Escribe el `.feature` en español → **se detiene para que lo apruebes** → implementa los pasos con
`bdd-generator`, verificándolos en el navegador real → ejecuta `pnpm test`. No hace commit ni push, y
por ahora solo para flujos de lectura. Detalle en [docs/workflow.md](docs/workflow.md#atajo-new-test).

### Agentes

| Agente | Qué hace | Ejemplo |
|---|---|---|
| `bdd-planner` | Explora el módulo y escribe escenarios en `features/`. No escribe código. | "Usa bdd-planner para planificar los escenarios de la consulta de servicios en LAFISErvicios" |
| `bdd-generator` | Ejecuta en el navegador los pasos que faltan y escribe su código en `steps/`. | "Usa bdd-generator para implementar los pasos que faltan" |
| `bdd-healer` | Depura y repara escenarios que fallan. Marca `@fixme` si es un defecto de la app. | "Usa bdd-healer para reparar las pruebas que fallan" |

Flujo resumido:

1. `bdd-planner` escribe el `.feature`, o lo escribe una persona de negocio o QA.
2. **Revisión humana del `.feature`**.
3. `bdd-generator` implementa los pasos y deja los escenarios en verde.
4. **Revisión del código** de `steps/` en el pull request.
5. Cuando algo se rompa, `bdd-healer`. Revisa lo que cambió y cada `@fixme`.

📖 **El flujo completo** (roles, ramas y PR, checklists de revisión, qué hacer con un defecto,
pipeline y etiquetas) está en [docs/workflow.md](docs/workflow.md).

Las convenciones del repositorio están en `CLAUDE.md`; los agentes las leen antes de trabajar.

### ¿Por qué agentes propios y no los oficiales de Playwright?

Los agentes oficiales (`npx playwright init-agents`) generan tests de Playwright puro (`.spec.ts`).
Como aquí trabajamos con **Gherkin**, los adaptamos: escriben `.feature` y step definitions,
reutilizan frases existentes y nunca tocan `.features-gen/`. Usan el mismo servidor MCP de Playwright.
El detalle está en [docs/adr/0001-ai-agents-with-bdd.md](docs/adr/0001-ai-agents-with-bdd.md).

**No ejecutes `npx playwright init-agents` en este repo**: agregaría los agentes oficiales y
sobrescribiría `.mcp.json`.

## Pipeline (Azure DevOps)

> ⚠️ **Aún no funcional.** El login manual no puede ejecutarse en un pipeline. Se habilitará cuando
> el login automático venga del proyecto testing del host.

`.azuredevops/pipeline.yml` se lanza manualmente eligiendo ambiente y filtro (`todos` o una etiqueta
como `@smoke`). Publica los resultados JUnit y el reporte HTML.

Para habilitarlo hará falta: el grupo de variables `lafiservicios-frontend-qa-automation-<ambiente>` (con las
variables que defina `@lafise/testing`, las sensibles como secretas) y un agente con acceso de red
al ambiente, a OneLogin y al registro npm interno.
