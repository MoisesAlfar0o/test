# language: es
@categories
Característica: Edición de una categoría del catálogo
  Como colaborador de LAFISE
  Quiero corregir el nombre en inglés de una categoría
  Para volver al listado de categorías

  Antecedentes:
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Catálogos"
    Y hago clic en el enlace "Categorías"
    Y hago clic en la pestaña "Nicaragua"

  Escenario: Cambiar el nombre en inglés de RECARGAS regresa al listado
    Cuando edito la categoría "RECARGAS"
    Entonces veo el título "Editar categoría"
    Cuando escribo "Recharges" en el campo "Nombre (Inglés)"
    Y guardo la categoría
    Entonces veo el título "Categorías"
