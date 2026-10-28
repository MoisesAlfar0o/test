# language: es
@smoke
Característica: Acceso a LAFISErvicios
  Como colaborador de LAFISE
  Quiero entrar a LAFISErvicios desde el BackOffice con mi usuario corporativo
  Para gestionar el catálogo, los pagos y el recaudo de servicios

  Escenario: La página de inicio del BackOffice carga con la sesión iniciada
    Dado que abro el BackOffice
    Entonces la URL contiene "/app/home"
    Y veo el título "Módulos"
    Y veo el título "Todos los módulos"

  Escenario: El inicio de LAFISErvicios carga con la sesión iniciada
    Dado que abro la ruta "/app/lafiservicios"
    Entonces veo el título "Inicio"
    Y veo el texto "Resumen operativo de LAFISErvicios"
