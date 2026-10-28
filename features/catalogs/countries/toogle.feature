# language: es
@countries
Característica: Estado de un país del catálogo
  Como colaborador de LAFISE
  Quiero habilitar o deshabilitar un país
  Para decidir si ese país queda disponible en el catálogo

  Antecedentes:
    Dado que abro la ruta "/app/lafiservicios"
    Cuando hago clic en el botón "Catálogos"
    Y hago clic en el enlace "Países"
    Entonces veo el texto "BLRD"

  Escenario: Deshabilitar BLRD y volver a habilitarlo
    Dado que el país "BLRD" está habilitado
    Cuando deshabilito el país "BLRD"
    Y hago clic en el botón "Confirmar"
    Entonces veo el país "BLRD" deshabilitado
    Cuando habilito el país "BLRD"
    Y hago clic en el botón "Confirmar"
    Entonces veo el país "BLRD" habilitado