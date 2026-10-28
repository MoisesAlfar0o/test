# language: es
# Historia: Como colaborador de LAFISE, quiero entrar a Productos, abrir Servicios de Nicaragua, filtrar "Activos" y ver solo servicios con estado "Active".
@generated
Característica: Filtrar servicios activos muestra solo ese estado

  Escenario: Filtrar servicios activos muestra solo ese estado
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Productos"
    Y hago clic en el enlace "Servicios" del menú
    Y hago clic en la pestaña "Nicaragua"
    Y hago clic en el botón "Activos"
    Entonces veo solo servicios con estado "Active"
