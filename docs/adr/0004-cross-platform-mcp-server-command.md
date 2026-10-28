# 0004 — Comando del servidor MCP compatible con Windows y macOS

- **Estado:** aceptada
- **Fecha:** 2026-10-20

## Contexto

Los agentes de IA y `/new-test` controlan el navegador a través del servidor MCP de Playwright, que
se declara en `.mcp.json`. El equipo trabaja en **Windows y macOS**.

La configuración original lanzaba el servidor con `cmd /c npx playwright run-test-mcp-server`:

- `cmd` solo existe en Windows: en macOS el servidor no arranca y los agentes no funcionan.
- Quitar el envoltorio (`npx playwright …`) arregla macOS, pero en Windows `npx` es un script
  (`npx.cmd`) y no se puede lanzar directamente como proceso, por eso se había añadido `cmd /c`.

`.mcp.json` no permite condicionar el comando según el sistema operativo.

## Decisión

Lanzar el servidor con `node` y el CLI de Playwright instalado en el proyecto:

```json
"command": "node",
"args": ["node_modules/@playwright/test/cli.js", "run-test-mcp-server"]
```

- `node` es un ejecutable real en Windows y en macOS: no hace falta `cmd` ni `npx`.
- `node_modules/@playwright/test/cli.js` es el mismo programa que ejecuta `npx playwright`, así que el
  servidor es idéntico y queda fijado a la versión instalada.
- `@playwright/test` es dependencia directa del proyecto, por lo que esa ruta existe con cualquier
  configuración de `node-linker` de pnpm.

## Consecuencias

- **Hay que ejecutar `pnpm install` antes de usar los agentes**: el servidor se lanza desde
  `node_modules`.
- **Claude Code debe abrirse en la raíz del repositorio**: la ruta es relativa al directorio de trabajo
  (igual que antes, el servidor necesita encontrar `playwright.config.ts` ahí).
- No volver a `cmd /c npx …` ni a `npx …`: cada uno rompe un sistema operativo.
- Si una versión futura de Playwright cambia la ubicación de su CLI, hay que actualizar la ruta.
- Verificado en Windows (el servidor arranca con este comando y responde a `tools/list`). En macOS se
  espera que funcione por ser `node` con una ruta relativa, pero **está pendiente de confirmar** con la
  primera persona que lo use en Mac; si falla, documentar el resultado aquí.
- Puede que Claude Code pida aprobar de nuevo el servidor `playwright-test` la primera vez, porque
  cambió su definición.
