# language: es
# Historia: Como colaborador de LAFISE, quiero buscar "recargas" en las categorías de Nicaragua y ver solo la categoría RECARGAS.
@generated
Característica: Buscar recargas muestra solo esa categoría

  Escenario: Buscar recargas muestra solo esa categoría
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Catálogos"
    Y hago clic en el enlace "Categorías"
    Y hago clic en la pestaña "Nicaragua"
    Y escribo "recargas" en el campo "Buscar por banco, categoría, estado o URL de imagen..."
    Entonces veo solo la categoría "RECARGAS"
