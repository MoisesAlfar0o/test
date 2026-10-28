# Inicio rápido (primer día)

Guía para empezar a escribir pruebas E2E del frontend de LAFISErvicios (BackOffice). Tiempo estimado: 1 hora.

## 0. Accesos que necesitas (pídelos antes de empezar)

| Acceso | Para qué | A quién pedirlo |
|---|---|---|
| Repositorio `lafiservicios-frontend-qa-automation` en Azure DevOps | Clonar y abrir PRs | Líder técnico |
| Registro npm interno (Azure Artifacts `LAFISE`) | Instalar dependencias | Igual que en los repos del BackOffice |
| Tu usuario de OneLogin con acceso al BackOffice de dev | Iniciar sesión (login manual, paso 2) | Líder técnico, si aún no tienes acceso |
| URL del ambiente a probar | `NEXT_PUBLIC_INTERNAL_ZONE_HOST_URL` (dev ya viene en `.env.example`) | Líder técnico |
| Claude Code (licencia aprobada) | Usar los agentes de IA | Líder técnico |

## 1. Instala y configura

Requisitos: Node.js según `.nvmrc`, pnpm y git. Funciona en **Windows y macOS**.

```bash
git clone <url-del-repo-lafiservicios-frontend-qa-automation>
cd lafiservicios-frontend-qa-automation
pnpm install
npx playwright install chromium
```

Crea tu `.env` a partir de la plantilla, según tu sistema:

```bash
cp .env.example .env
```

```powershell
Copy-Item .env.example .env
```

El primero es para macOS (o Git Bash en Windows); el segundo, para PowerShell en Windows.

`.env.example` ya apunta a dev; normalmente no hay que cambiar nada. El `.env` no se sube al repo.

## 2. Inicia sesión y comprueba que todo funciona

```bash
pnpm auth:manual
pnpm test
```

- `pnpm auth:manual` abre el navegador: inicia sesión con tu usuario y tu MFA habituales. Al llegar
  al BackOffice, la sesión se guarda. No se guardan contraseñas.
- `pnpm test` ejecuta la prueba de humo (`features/smoke/access.feature`) y debe pasar.
- Cuando la sesión expire, `pnpm test` lo indicará: repite `pnpm auth:manual`.

> ⚠️ Este login manual es **temporal**: el login automático vendrá del proyecto testing del host.
> Úsalo solo contra dev; todo queda registrado con tu usuario. Ver [auth/README.md](../auth/README.md).

## 3. Lee esto (20 minutos)

1. [README](../README.md): estructura y comandos.
2. [Flujo de trabajo](workflow.md): **cómo se trabaja aquí**. Lee al menos el Flujo A.
3. [Por qué los agentes son propios](adr/0001-ai-agents-with-bdd.md).
4. `features/smoke/access.feature` y `steps/common.steps.ts`: un ejemplo completo y pequeño.

## 4. Prepara Claude Code

```bash
claude
```

Dentro de Claude Code:

1. La primera vez, inicia sesión (`/login`), confía en la carpeta y **aprueba el servidor MCP `playwright-test`**.
2. `/mcp` → `playwright-test` debe aparecer como *connected*.
3. `/agents` → deben aparecer `bdd-planner`, `bdd-generator` y `bdd-healer`.
4. Escribe `/` → debe aparecer el comando `/new-test`.

Los agentes y `/new-test` usan tu sesión guardada: ejecuta `pnpm auth:manual` antes si expiró.

## 5. Tu primera tarea

Elige con tu líder **una funcionalidad pequeña** de LAFISErvicios (por ejemplo, una pantalla de consulta)
y sigue el [Flujo A](workflow.md#flujo-a--probar-una-funcionalidad-nueva-con-ia):

1. Rama: `git switch -c test/<TICKET>-<descripcion>`.
2. En Claude Code, según el caso:

   **Ya sabes qué probar** → describe la prueba en lenguaje natural con `/new-test` (dónde, qué haces y
   qué debe pasar). Escribe el `.feature`, se detiene para que lo apruebes y luego implementa los pasos:

   ```
   /new-test En Servicios, país Nicaragua, busco "Agua" y debo ver solo servicios cuyo nombre contenga "Agua"
   ```

   **Quieres que la IA explore y proponga escenarios** → usa el agente `bdd-planner`:

   ```
   Usa el agente bdd-planner para planificar los escenarios de LAFISErvicios,
   funcionalidad "<funcionalidad>". Criterios de aceptación: <pega los del ticket>.
   ```

3. Revisa el `.feature` con QA o negocio (con `/new-test`, es la pausa que te pide).
4. Si usaste el planner: `Usa el agente bdd-generator para implementar los pasos que faltan.`
   (`/new-test` ya lo hace por ti.)
5. `pnpm test` en verde, revisa el código de `steps/` y abre el PR.

Para tu primera prueba, elige un flujo de **solo lectura** (consultas, filtros, listados): hoy las
pruebas corren con tu usuario personal.

Objetivo del primer día: **un PR con 2 o 3 escenarios en verde**. No hace falta cubrir todo.

## Reglas que no se rompen

- Nunca subas `.env`, credenciales ni datos reales de clientes.
- No ejecutes `npx playwright init-agents` (ver la decisión 0001).
- No cambies el resultado esperado de un escenario para que pase: si la app falla, es `@fixme` + ticket.
- Todo lo que genera la IA se revisa antes del merge.
- Con tu usuario personal, no ejecutes ni dejes que un agente ejecute acciones que modifiquen datos reales.

## Problemas frecuentes

| Problema | Solución |
|---|---|
| `pnpm install` da 401 / 403 | Falta autenticarte en el registro de Azure Artifacts (igual que en los otros repos del BackOffice) |
| `/mcp` no muestra `playwright-test`, o aparece con error | Ejecuta antes `pnpm install` (el servidor se lanza desde `node_modules`) y abre `claude` en la raíz de `lafiservicios-frontend-qa-automation`, donde está `.mcp.json`. Ver [ADR 0004](adr/0004-cross-platform-mcp-server-command.md) |
| `No hay una sesión guardada` / `La sesión guardada expiró` | Ejecuta `pnpm auth:manual` |
| `pnpm auth:manual` se queda esperando | Termina de iniciar sesión en la ventana; tienes 5 minutos. Si ya entraste y no termina, revisa `NEXT_PUBLIC_INTERNAL_AFTER_SIGN_IN_PATH` |
| El agente dice que falló la sesión | Ejecuta `pnpm auth:manual` y vuelve a pedirle la tarea |
| Las pruebas fallan por tiempo de espera al abrir la página | La URL no responde: revisa VPN, el ambiente o que el host local esté levantado |
