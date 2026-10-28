# language: es
@services
Característica: Filtros de servicios
  Como colaborador de LAFISE
  Quiero filtrar los servicios por estado y por proveedor
  Para ver solo los que corresponden a lo que elegí

  Antecedentes:
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Productos"
    Y hago clic en el enlace "Servicios" del menú
    Y hago clic en la pestaña "Nicaragua"

  Escenario: Filtrar servicios activos muestra solo ese estado
    Cuando hago clic en el botón "Activos"
    Entonces veo solo servicios con estado "Active"

  Escenario: Buscar Tigo entre los activos muestra sus servicios
    Cuando hago clic en el botón "Activos"
    Y escribo "Tigo" en el campo "Buscar por banco, servicio, proveedor o categoría..."
    Entonces veo el texto "Recarga de Saldo"
    Y veo el texto "Compra de Paquete"
    Y veo el texto "Plan Pospago Tigo"
    Y veo el texto "Full Hogar Tigo"

  Escenario: Buscar Tigo entre los inactivos avisa que no hay resultados
    Cuando hago clic en el botón "Activos"
    Y escribo "Tigo" en el campo "Buscar por banco, servicio, proveedor o categoría..."
    Y hago clic en el botón "Inactivos"
    Entonces veo el texto "No se encontraron servicios"