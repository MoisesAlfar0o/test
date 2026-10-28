# language: es
@providers
Característica: Edición de un proveedor del catálogo
  Como colaborador de LAFISE
  Quiero corregir el nombre en inglés de un proveedor
  Para volver al listado de proveedores

  Antecedentes:
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Catálogos"
    Y hago clic en el enlace "Proveedores"
    Y hago clic en la pestaña "Nicaragua"

  Escenario: Cambiar el nombre en inglés de RECARGAS regresa al listado
    Cuando edito el proveedor "Arabela"
    Entonces veo el título "Editar proveedor"
    Cuando escribo "Arabelas" en el campo "Nombre (Inglés)"
    Y guardo el proveedor
    Entonces veo el título "Proveedores"
