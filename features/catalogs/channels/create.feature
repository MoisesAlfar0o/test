# language: es
@channels-catalog
Característica: Alta de un canal del catálogo
  Como colaborador de LAFISE
  Quiero registrar un canal
  Para volver al listado de canales

  Antecedentes:
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Catálogos"
    Y hago clic en el enlace "Catálogo de canales"
    Y hago clic en la pestaña "Nicaragua"

  Escenario: Registrar un canal de prueba regresa al listado
    Cuando hago clic en el botón "Nuevo canal"
    Entonces veo el título "Nuevo canal"
    Cuando escribo "CANALQA" en el campo "Código"
    Y escribo "99" en el campo "Id Core"
    Y escribo "Canal prueba" en el campo "Nombre (Español)"
    Y escribo "Test channel" en el campo "Nombre (Inglés)"
    Y guardo el canal
    Entonces veo el título "Catálogo de canales"
