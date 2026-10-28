# language: es
@tax-types
Característica: Alta de un tipo de impuesto del catálogo
  Como colaborador de LAFISE
  Quiero registrar un tipo de impuesto
  Para volver al listado de tipos de impuesto

  Antecedentes:
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Catálogos"
    Y hago clic en el enlace "Tipos de impuesto"
    Y hago clic en la pestaña "Nicaragua"

  Escenario: Registrar un tipo de impuesto de prueba regresa al listado
    Cuando hago clic en el botón "Nuevo tipo de impuesto"
    Entonces veo el título "Nuevo tipo de impuesto"
    Cuando escribo "QATAX" en el campo "Código"
    Y escribo "Impuesto de prueba" en el campo "Nombre (Español)"
    Y escribo "Test tax" en el campo "Nombre (Inglés)"
    Y escribo "15" en el campo "Tasa (%)"
    Y escribo "260503001099" en el campo "Cuenta contable destino"
    Y guardo el tipo de impuesto
    Entonces veo el título "Tipos de impuesto"
