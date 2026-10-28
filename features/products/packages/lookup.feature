# language: es
@packages
Característica: Consulta de Paquetes

  Antecedentes:
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Productos"
    Y hago clic en el enlace "Paquetes" del menú

  Escenario: Consulta de Paquetes
    Cuando escribo "CLARO" en el campo "Buscar por banco, proveedor o paquete..."
