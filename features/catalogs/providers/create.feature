# language: es
@providers
Característica: Alta de un proveedor del catálogo
  Como colaborador de LAFISE
  Quiero registrar un proveedor
  Para volver al listado de proveedores

  Antecedentes:
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Catálogos"
    Y hago clic en el enlace "Proveedores"
    Y hago clic en la pestaña "Nicaragua"

  Escenario: Registrar un proveedor de prueba regresa al listado
    Cuando hago clic en el botón "Nuevo proveedor"
    Entonces veo el título "Nuevo proveedor"
    Cuando escribo "TEST" en el campo "Código"
    Y escribo "proveedor prueba" en el campo "Nombre (Español)"
    Y escribo "provider test" en el campo "Nombre (Inglés)"
    Y guardo el proveedor
    Entonces veo el título "Proveedores"
