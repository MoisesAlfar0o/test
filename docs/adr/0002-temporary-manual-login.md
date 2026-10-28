# 0002 — Login fuera de este repo; login manual temporal mientras tanto

- **Estado:** aceptada (el login manual es temporal)
- **Fecha:** 2026-10-19

## Contexto

Las pruebas necesitan una sesión iniciada en el BackOffice (OneLogin + MFA). Se decidió que **el login
y la base común de los micro-frontends** (fixtures, configuración compartida) se centralicen en el
proyecto **testing del host** (`internal-host`, paquete `@lafise/testing`), y que cada proyecto de
pruebas use esa base en lugar de implementar su propio login. Ese trabajo lo está haciendo otra
persona y aún no está disponible. Además, el paquete publicado (`@lafise/testing` 0.2.0) no funciona
con Playwright actual.

Mientras tanto hace falta poder avanzar con los escenarios y los agentes de IA.

## Decisión

- Este repo **no implementa login automático** ni depende de `@lafise/testing` por ahora.
- Se usa un **login manual temporal**, aislado en la carpeta `auth/`:
  - `pnpm auth:manual` abre el navegador; la persona inicia sesión con su usuario y su MFA, y se
    guarda la sesión del navegador en `test-results/.auth/` (ignorado por git).
  - El proyecto `setup` solo valida que esa sesión exista y siga vigente antes de los escenarios.
- No se guardan contraseñas ni secretos MFA en ningún archivo.

## Consecuencias

- Las acciones de las pruebas y de los agentes quedan registradas con el **usuario personal** de quien
  inició sesión. Usarlo solo en local y contra dev. Los agentes no ejecutan acciones irreversibles.
- La sesión expira; entonces `pnpm test` falla con un mensaje claro y hay que repetir `pnpm auth:manual`.
- `pnpm auth:manual` lo ejecuta siempre una persona, nunca un agente.
- **El pipeline no puede ejecutarse** hasta tener login automático.
- Cuando el proyecto testing del host esté listo, se elimina `auth/` y se integra `@lafise/testing`
  siguiendo los pasos de `auth/README.md`. Esta decisión pasará a "reemplazada".
