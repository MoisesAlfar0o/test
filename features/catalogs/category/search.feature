# language: es
@categories
Característica: Búsqueda de categorías del catálogo
  Como colaborador de LAFISE
  Quiero buscar una categoría por su nombre
  Para ver solo las que coinciden con lo que escribí

  Antecedentes:
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Catálogos"
    Y hago clic en el enlace "Categorías"
    Y hago clic en la pestaña "Nicaragua"

  Escenario: Buscar recargas muestra solo esa categoría
    Cuando escribo "recargas" en el campo "Buscar por banco, categoría, estado o URL de imagen..."
    Entonces veo solo la categoría "RECARGAS"

  Escenario: Buscar un nombre que no existe avisa que no hay resultados
    Cuando escribo "zzzz" en el campo "Buscar por banco, categoría, estado o URL de imagen..."
    Entonces veo el texto "No hay categorías para mostrar con los criterios actuales."