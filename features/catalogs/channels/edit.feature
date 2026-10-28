# language: es
@channels-catalog
Característica: Edición de un canal del catálogo
  Como colaborador de LAFISE
  Quiero corregir los nombres de un canal y dejarlos como estaban
  Para volver al listado de canales

  Antecedentes:
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Catálogos"
    Y hago clic en el enlace "Catálogo de canales"
    Y hago clic en la pestaña "Nicaragua"

  Escenario: Cambiar los nombres de Atm a ATM y revertirlos regresa al listado
    Cuando edito el canal "Atm"
    Entonces veo el título "Editar canal"
    Cuando escribo "ATM" en el campo "Nombre (Español)"
    Y escribo "ATM" en el campo "Nombre (Inglés)"
    Y guardo el canal
    Entonces veo el título "Catálogo de canales"
    Cuando edito el canal "ATM"
    Entonces veo el título "Editar canal"
    Cuando escribo "Atm" en el campo "Nombre (Español)"
    Y escribo "Atm" en el campo "Nombre (Inglés)"
    Y guardo el canal
    Entonces veo el título "Catálogo de canales"
