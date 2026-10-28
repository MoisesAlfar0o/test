# language: es
@categories
Característica: Alta de una categoría del catálogo
  Como colaborador de LAFISE
  Quiero registrar una categoría
  Para volver al listado de categorías

  Antecedentes:
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Catálogos"
    Y hago clic en el enlace "Categorías"
    Y hago clic en la pestaña "Nicaragua"

  Escenario: Registrar una categoría de prueba regresa al listado
    Cuando hago clic en el botón "Nueva categoría"
    Entonces veo el título "Nueva categoría"
    Cuando escribo "Prueba QA" en el campo "Nombre (Español)"
    Y escribo "Prueba QA" en el campo "Nombre (Inglés)"
    Y guardo la categoría
    Entonces veo el título "Categorías"
