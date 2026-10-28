# language: es
@tax-types
Característica: Edición de un tipo de impuesto del catálogo
  Como colaborador de LAFISE
  Quiero corregir el nombre en inglés de un tipo de impuesto y dejarlo como estaba
  Para volver al listado de tipos de impuesto

  Antecedentes:
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Catálogos"
    Y hago clic en el enlace "Tipos de impuesto"
    Y hago clic en la pestaña "Nicaragua"

  Escenario: Corregir el nombre en inglés de ISC y revertirlo regresa al listado
    Cuando edito el tipo de impuesto "ISC"
    Entonces veo el título "Editar tipo de impuesto"
    Cuando escribo "Selective Consumption Tax" en el campo "Nombre (Inglés)"
    Y guardo el tipo de impuesto
    Entonces veo el título "Tipos de impuesto"
    Cuando edito el tipo de impuesto "ISC"
    Entonces veo el título "Editar tipo de impuesto"
    Cuando escribo "Impuesto Selectivo al Consumido" en el campo "Nombre (Inglés)"
    Y guardo el tipo de impuesto
    Entonces veo el título "Tipos de impuesto"
