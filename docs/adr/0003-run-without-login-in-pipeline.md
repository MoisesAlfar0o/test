# 0003 — Correr las pruebas sin login (para pipeline)

- **Estado:** propuesta (requiere cambios en las apps + visto bueno de Seguridad)
- **Fecha:** 2026-10-19

## Contexto

Seguridad confirmó que **no habrá usuario de pruebas** (restricciones). Nos pidieron
"buscar la manera de correr las pruebas sin hacer login", y en un entorno que no sea
solo la máquina local (pipeline).

El login manual (`pnpm auth:manual`, decisión 0002) sirve en local, pero **no sirve en
pipeline**: necesita que una persona inicie sesión en el navegador.

## Cómo está hecha la autenticación hoy (lo que hay que sortear)

El BackOffice valida la sesión en **tres capas**. Para correr sin login hay que
neutralizar las tres, y ninguna vive en este repositorio de pruebas:

| Capa | Dónde | Qué exige |
|---|---|---|
| **1. Middleware** | `internal-host/src/middleware.ts` y en cada MFE `src/proxy.ts` (`@lafise/internal-auth-middleware`) | Una cookie con el **ID token de Cognito** (`CognitoIdentityServiceProvider.<clientId>…idToken`). **Verifica la firma del JWT** contra el JWKS real de Cognito. Sin token válido → redirige al login. Solo `/health` es público. |
| **2. Servidor (tRPC)** | `rgnl-backoffice-lafiservicios/src/server/api/trpc.ts` (`protectedProcedure`) + `@lafise/auth` | Resuelve la sesión con `POST /sessions/resolve` contra Internal Security. Sin usuario → `UNAUTHORIZED`. |
| **3. Cliente** | `src/providers.tsx` → `<InternalAuthProvider>` + `<Authenticated>` (`@lafise/internal-auth-next`, AWS Amplify) | Una sesión de Amplify/Cognito en el navegador. Sin ella no renderiza el contenido. |

Dato clave: la capa 1 **verifica la firma** del token contra Cognito. Por eso **no se
puede "inventar" un token falso** desde las pruebas: el middleware lo rechaza. Cualquier
bypass tiene que vivir en las apps.

Nota: `checkModuleAccess()` (acceso al módulo) **ya está desactivado temporalmente** en
`rgnl-backoffice-lafiservicios/src/app/(admin)/layout.tsx` (comentario `TEMP BYPASS`), y el
host ya tiene un `dockerfile-testcontainer`. Es decir, el equipo ya empezó a moverse hacia
un modo de pruebas.

## Conclusión

**No se puede lograr solo desde este repo.** Correr sin login exige un "modo de pruebas"
en las apps (host + LAFISErvicios), controlado por una variable de entorno y **imposible
de activar en producción**. Es un cambio del equipo de desarrollo, revisado por Seguridad.

## Opciones

### Opción A — Modo de pruebas con sesión simulada (recomendada)

Un bypass gated por env (p. ej. `E2E_TEST_MODE=true`) que se compila **solo en builds
que no son de producción**:

- **Middleware:** si `E2E_TEST_MODE`, deja pasar sin verificar el token.
- **Servidor:** inyecta un usuario de prueba en el contexto tRPC (sin llamar a
  `/sessions/resolve`), con roles/empresa configurables.
- **Cliente:** `<Authenticated>` tratado como autenticado.

Ventajas: prueba la UI y los flujos completos. Encaja con lo que el equipo ya empezó
(`dockerfile-testcontainer`, bypass de `checkModuleAccess`).
Cuida: que el flag sea inerte en prod (idealmente que el código del bypass **no exista** en
el bundle de producción), y definir de dónde salen los datos (APIs reales de dev vs.
simuladas).

### Opción B — Modo de pruebas + APIs simuladas (mock)

Como A, pero además las llamadas a las APIs del back se interceptan (en la app con MSW, o
en Playwright con `page.route`) y responden con datos de prueba.

Ventajas: estable y sin depender de datos reales ni de la red interna; ideal para pipeline.
Cuida: no prueba la integración real; hay que mantener los datos simulados.

### Opción C — Levantar todo el stack en el pipeline

Host + MFE + Internal Security + base de datos sembrada, todo en contenedores, con un
usuario sembrado en la BD de pruebas.

Ventajas: lo más realista.
Cuida: es la más cara de montar y mantener; posiblemente choca con la restricción de
Seguridad (crear usuarios), aunque sea en una BD efímera.

## Recomendación

**Opción A** como base, con la **B** para los escenarios que no dependan de datos reales.
Que el "modo de pruebas" (y, a futuro, el login automático) lo provea el proyecto testing
del host / `@lafise/testing`, para que todos los MFE lo compartan.

## Impacto en este repo (mínimo y ya preparado)

Cuando exista el modo de pruebas:

- `NEXT_PUBLIC_INTERNAL_ZONE_HOST_URL` → al host levantado en modo de pruebas.
- Se elimina `auth/` (login manual) y el proyecto `setup` deja de validar sesión.
- `features`, `steps`, agentes y flujo de trabajo **no cambian**.
- El pipeline (`.azuredevops/pipeline.yml`) queda habilitado.

## Preguntas para Seguridad / Desarrollo

1. ¿Se aprueba un modo sin login **gated por env y ausente en prod**? ¿Quién lo implementa?
2. ¿Las APIs de dev aceptan un token de servicio, o se simulan (opción B)?
3. ¿El bypass debe cubrir también permisos/roles, o basta con una sesión genérica?
4. ¿Corre en el pipeline de Microsoft (`ubuntu-latest`) o en un pool propio con acceso a la red interna?
