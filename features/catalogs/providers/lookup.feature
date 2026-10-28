# language: es
@providers
Característica: En Proveedores escribo Arabela y veo solo los proveedores Arabela

  Antecedentes:
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Catálogos"
    Y hago clic en el enlace "Proveedores"
    Y hago clic en la pestaña "Nicaragua"

  Escenario: En Proveedores escribo Arabela y veo solo los proveedores Arabela
    Cuando escribo "Arabela" en el campo "Buscar por banco, código o nombre..."
    Entonces veo solo el proveedor "Arabela"
