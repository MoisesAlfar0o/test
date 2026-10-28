# Flujo de trabajo

Cómo se crean, revisan, ejecutan y mantienen las pruebas E2E del frontend de LAFISErvicios con BDD y agentes de IA.

## Roles

| Rol | Responsabilidad |
|---|---|
| **Negocio / Product Owner** | Define los criterios de aceptación. Revisa (o escribe) los `.feature`. |
| **QA funcional** | Diseña y revisa escenarios: casos límite, validaciones, errores. Triage de fallos. |
| **Automatizador / QA técnico** | Usa los agentes de IA, revisa los steps generados, mantiene el repositorio. |
| **Desarrollo** | Corrige defectos reportados. Agrega selectores estables (`aria-label`, `data-testid`) cuando se piden. |

Una misma persona puede tener varios roles.

## Visión general

```
 Historia de usuario / criterios de aceptación
            │
            ▼
 ┌────────────────────────┐      ┌─────────────────────────┐
 │ 1. Escenarios (.feature)│ ───▶ │ 2. Revisión del .feature │  negocio / QA
 │    bdd-planner o manual │      └────────────┬────────────┘
 └────────────────────────┘                   │ aprobado
                                              ▼
 ┌────────────────────────┐      ┌─────────────────────────┐
 │ 3. Steps (código)       │ ───▶ │ 4. Pull request          │  revisión de código
 │    bdd-generator        │      └────────────┬────────────┘
 └────────────────────────┘                   │ merge
                                              ▼
                               ┌─────────────────────────┐
                               │ 5. Ejecución en pipeline │
                               └────────────┬────────────┘
                                            │ falla
                                            ▼
                               ┌─────────────────────────┐
                               │ 6. Triage: bdd-healer    │──▶ ¿defecto de la app? → reportar
                               └─────────────────────────┘
```

---

## Flujo A — Probar una funcionalidad nueva (con IA)

Es el flujo principal. Tiene dos formas de arrancar, según si ya sabes qué quieres probar:

| Si… | Usa | Qué hace |
|---|---|---|
| **Ya sabes qué probar** (lo describes tú) | [`/new-test`](#atajo-new-test) | Traduce tu descripción a Gherkin y automatiza los pasos (pasos 2 a 5 en uno) |
| **Quieres que la IA explore** y te proponga escenarios | `bdd-planner` (paso 2) | Explora la pantalla y escribe los escenarios que ve necesarios |

En ambos casos el resto del flujo es igual: la revisión humana del `.feature` y del código no se salta.

### 1. Prepara el entorno

- `.env` creado y sesión iniciada con `pnpm auth:manual` (temporal; ver README).
- Crea una rama desde `main`:

  ```bash
  git switch -c test/<TICKET>-<descripcion-corta>
  ```

  Ejemplo: `test/PBACOF-512-filtros-servicios`.

### 2. Genera los escenarios con `bdd-planner`

Abre Claude Code en la carpeta del repo (`claude`) y pide los escenarios indicando **módulo,
funcionalidad y lo que debe cubrirse**. Cuanto más contexto de negocio des, mejores escenarios:

```
Usa el agente bdd-planner para planificar los escenarios del módulo LAFISErvicios,
funcionalidad "consulta de servicios": búsqueda por nombre, filtros por estado y
paginación. Criterios de aceptación del ticket PBACOF-512:
- La búsqueda no distingue mayúsculas.
- Sin resultados se muestra "No se encontraron servicios".
```

El agente explora la aplicación con la sesión iniciada, escribe `features/<area>/<feature>.feature`
y devuelve un resumen con **frases nuevas** y **posibles defectos**.

> También puedes escribir el `.feature` a mano (o que lo traiga negocio). Ver [Flujo B](#flujo-b--el-feature-lo-escribe-negocio-o-qa).
> Y si ya sabes qué probar, [`/new-test`](#atajo-new-test) se salta al planner.

### 3. Revisa el `.feature` (paso humano obligatorio)

Lo revisa QA funcional y, si el cambio es relevante, negocio. Checklist:

- [ ] Cada escenario corresponde a un criterio de aceptación real.
- [ ] Están el camino feliz, los casos límite y las validaciones importantes.
- [ ] Los resultados esperados son los que **negocio espera**, no lo que la app hace hoy.
- [ ] Las frases están en lenguaje de negocio (qué hace el usuario, no "clic en el botón con id X").
- [ ] Se reutilizan frases existentes; las nuevas son genéricas y parametrizadas.
- [ ] Etiquetas correctas: `@<area>` y `@smoke` solo en lo crítico y rápido.
- [ ] Sin datos reales de clientes ni credenciales.

Corrige el archivo a mano o pídele cambios a la IA (*"agrega un escenario para…"*, *"une estos dos
escenarios en un Esquema del escenario"*).

### 4. Implementa los pasos con `bdd-generator`

```
Usa el agente bdd-generator para implementar los pasos que faltan.
```

El agente ejecuta `pnpm bddgen` para ver qué frases no tienen código, ejecuta cada escenario en el
navegador, escribe los steps en `steps/` y corre las pruebas hasta que pasen.

### 5. Verifica tú mismo

```bash
pnpm test
```

Si quieres ver la ejecución: `pnpm test:headed`, o `pnpm test:ui` para ir paso a paso.

### 6. Revisa el código de los steps

Checklist:

- [ ] La frase del step coincide con el `.feature` y está parametrizada (`{string}`, `{int}`).
- [ ] Selectores por rol, etiqueta o texto. Sin XPath ni clases CSS.
- [ ] Los pasos `Entonces` verifican con `expect(...)`; no hay `waitForTimeout`.
- [ ] No duplica un step existente con otra redacción.
- [ ] Los pasos genéricos están en `steps/common.steps.ts`; los del módulo, en `steps/<area>/`.
- [ ] Sin credenciales ni datos sensibles.

### 7. Commit y pull request

```bash
git add features steps
git commit -m "test(PBACOF-512): escenarios de consulta de servicios"
git push -u origin HEAD
```

Abre el PR en Azure DevOps. En la descripción incluye: ticket, escenarios agregados, posibles
defectos encontrados y el resultado de `pnpm test`.

### Atajo: `/new-test`

Cuando ya sabes qué quieres probar, describe la prueba en lenguaje natural y la IA hace los pasos 2 a 5
(el `.feature`, los steps y la verificación). Dentro de Claude Code, en la carpeta del repo:

```
/new-test En Servicios, país Nicaragua, busco "Agua" y debo ver solo servicios cuyo nombre contenga "Agua"
```

**Cómo describirla.** Tres partes: **dónde** (pantalla o área), **qué haces** (acciones) y **qué debe
pasar** (resultado esperado). El resultado esperado es lo más importante: si falta, el comando te lo
pregunta en lugar de deducirlo de lo que hace la aplicación hoy.

**Qué hace, en orden:**

1. Entiende la descripción y pregunta si falta el resultado esperado o si implica una acción con efecto
   real (crear, editar, aprobar…). Por ahora solo flujos de lectura (ver [ADR 0002](adr/0002-temporary-manual-login.md)).
2. Lee los steps y features existentes para **reutilizar frases**.
3. Escribe `features/<area>/<feature>.feature` (nombre en inglés, texto en español).
4. **Se detiene y te muestra el `.feature`** con las frases nuevas. Tú lo revisas (checklist del paso 3)
   y respondes para continuar. Con `--sin-pausa` al final de la descripción no se detiene.
5. Usa `bdd-generator` para implementar los steps verificándolos en el navegador real.
6. Ejecuta el escenario y luego `pnpm test`, hasta que pase.
7. Resume lo hecho. **No hace commit ni push**: eso lo haces tú después de revisar el diff.

**Si algo no cuadra:** si la sesión expiró, te pedirá ejecutar `pnpm auth:manual` (nunca inicia sesión
ella misma). Si la aplicación no se comporta como describiste, no cambia lo esperado para que pase: marca
el escenario `@fixme` con `# POSIBLE DEFECTO: …` y te lo reporta.

La revisión humana (pasos 3 y 6 del flujo) sigue siendo obligatoria: el comando agiliza escribir, no
reemplaza revisar.

---

## Flujo B — El `.feature` lo escribe negocio o QA

Cuando los criterios de aceptación ya vienen en Gherkin (o los escribe QA directamente):

1. Crea la rama y escribe `features/<area>/<feature>.feature`.
   - Para reutilizar frases, revisa `steps/common.steps.ts` y los steps del módulo.
   - Puedes ejecutar `pnpm bddgen` para ver qué frases todavía no tienen código.
2. Revisión del `.feature` (checklist del paso 3 del Flujo A).
3. Continúa desde el **paso 4 del Flujo A** (`bdd-generator`).

En este flujo la IA solo escribe código; el **qué** se prueba lo deciden personas.

---

## Flujo C — Una prueba falla

### 1. Diagnostica con `bdd-healer`

```
Usa el agente bdd-healer para reparar las pruebas que fallan.
```

El agente regenera, ejecuta, depura cada fallo en el navegador y decide la causa:

| Causa | Qué hace el agente | Qué haces tú |
|---|---|---|
| **Selector desactualizado** (cambió un texto o un elemento) | Corrige el step | Revisa el cambio en el PR |
| **Sincronización** (la prueba no espera lo suficiente) | Cambia a una aserción que espera | Revisa el cambio en el PR |
| **Falla la sesión** (`setup`) | Se detiene e informa | Ejecuta `pnpm auth:manual` |
| **Ambiente caído** (errores 5xx, servicio no disponible) | Informa sin cambiar código | Avisa al equipo responsable del ambiente |
| **La app no cumple el escenario** | Marca `@fixme` con `# POSIBLE DEFECTO: ...` | Continúa en el paso 2 |

### 2. Si es un posible defecto de la aplicación

1. **Confírmalo** reproduciéndolo a mano en el ambiente (`pnpm test:headed` ayuda).
2. **Repórtalo** en Jira, con el escenario, el resultado esperado y el real, y el reporte o *trace* de Playwright.
3. Agrega el número del ticket al comentario del escenario:

   ```gherkin
   # POSIBLE DEFECTO: PBACOF-530 — el filtro "Completadas" muestra también las pendientes
   @fixme
   Escenario: Filtrar servicios completados
   ```

4. Cuando el defecto se corrija, **quita `@fixme`** y verifica que el escenario pasa.

> Nunca cambies el resultado esperado de un escenario para que pase. Si negocio decide que el
> comportamiento cambió, se actualiza el `.feature` con su aprobación.

### 3. Si el cambio fue intencional en la aplicación

Por ejemplo, un texto o un flujo cambió a propósito: actualiza el `.feature` (con aprobación de
negocio/QA) y los steps, en un PR.

---

## Flujo D — Ejecución periódica (pipeline)

> ⚠️ **Aún no disponible:** requiere el login automático del proyecto testing del host. Mientras
> tanto, las pruebas se ejecutan en local con `pnpm test`.

`.azuredevops/pipeline.yml` se ejecuta en Azure DevOps eligiendo:

- **Ambiente:** `develop` o `qa`.
- **Escenarios:** `todos` o una etiqueta, por ejemplo `@smoke`.

Uso recomendado:

| Cuándo | Qué ejecutar |
|---|---|
| Después de cada despliegue a un ambiente | `@smoke` |
| Antes de pasar a producción | `todos` (regresión completa) |
| Programado (por ejemplo, cada noche) | `todos` |

Resultados: pestaña **Tests** del pipeline (JUnit) y el artefacto `playwright-report-*` con el
reporte HTML (incluye capturas y *traces* de los fallos). Si algo falla, sigue el [Flujo C](#flujo-c--una-prueba-falla).

---

## Etiquetas

| Etiqueta | Uso |
|---|---|
| `@<area>` | En cada característica, según el área de LAFISErvicios: el segmento de ruta bajo `/app/lafiservicios/managements/` (`@services`, `@approvals`, `@payments`…). Permite ejecutar por área. |
| `@smoke` | Escenarios críticos y rápidos. Se ejecutan tras cada despliegue. |
| `@fixme` | Escenario bloqueado por un defecto conocido. Siempre con comentario y ticket. |

Ejecutar por etiqueta en local:

```bash
pnpm bddgen && npx playwright test --project=setup --project=bdd --grep @services
```

## Buenas prácticas al pedir trabajo a la IA

- **Da contexto de negocio:** criterios de aceptación, reglas y datos de prueba válidos.
- **Pide por partes:** una funcionalidad por vez. Escenarios más pequeños dan mejores resultados.
- **Revisa siempre:** los agentes aceleran, pero el `.feature` y el código pasan por revisión humana.
- **No pegues credenciales ni datos de clientes** en el chat.
- **Si un agente o `/new-test` hace algo que no debería**, mejora sus instrucciones en `.claude/agents/`
  o `.claude/commands/` mediante un PR. El porqué de estos agentes está en
  [adr/0001-ai-agents-with-bdd.md](adr/0001-ai-agents-with-bdd.md).
