# ⚠️ Login manual TEMPORAL

Esta carpeta es un **puente temporal**. El login (OneLogin + MFA) y la base común de los
micro-frontends se van a centralizar en el proyecto **testing del host** (`internal-host`,
paquete `@lafise/testing`). Mientras tanto, este login manual permite avanzar con las pruebas.

## Cómo funciona

| Comando / proyecto | Qué hace |
|---|---|
| `pnpm auth:manual` (proyecto `auth-manual`) | Abre el navegador; la persona inicia sesión con su usuario y MFA; se guarda la sesión en `test-results/.auth/user.json` |
| Proyecto `setup` (`auth.setup.ts`) | Antes de los escenarios, valida que la sesión guardada exista y siga vigente |
| Proyectos `bdd` y `seed` | Usan la sesión guardada (`storageState`) |

No se guardan contraseñas ni secretos MFA. Las acciones quedan registradas con el usuario de quien
inició sesión. Úsalo solo en local y contra dev.

## Cómo eliminarlo (cuando el login del host esté listo)

1. Borrar esta carpeta `auth/` completa.
2. `playwright.config.ts`:
   - Quitar el import de `./auth/storage-state` y los proyectos `setup` y `auth-manual`.
   - Configurar el login con lo que provea `@lafise/testing` (proyecto de setup, fixtures o
     `storageState`), y mantener `dependencies` de los proyectos `bdd` y `seed` hacia ese setup.
3. `package.json`: quitar el script `auth:manual` y agregar `@lafise/testing` a `devDependencies`.
4. `.env.example`: quitar `NEXT_PUBLIC_INTERNAL_AFTER_SIGN_IN_PATH` y agregar las variables que pida
   `@lafise/testing`.
5. Documentación: buscar `auth:manual` y `TEMPORAL` en el repo (README, `CLAUDE.md`, `docs/`) y
   actualizar esas secciones. Marcar `docs/adr/0002-...` como reemplazada.
6. Verificar con `pnpm test`.
