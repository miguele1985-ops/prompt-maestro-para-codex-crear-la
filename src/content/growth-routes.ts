export const learningRoutes = [
  { id: 'casa', title: 'Preparar mi casa', intro: 'Una semana para comprobar recursos y acordar un plan familiar.', steps: [
    { title: 'Localiza lo esencial', href: '/supervivencia/preparacion-emergencias-casa-principiantes', task: 'Comprueba agua, luz, comida y medicación. Anota una carencia real.' },
    { title: 'Organiza el agua', href: '/supervivencia/como-guardar-agua-emergencias', task: 'Revisa envases, etiquetas, ubicación y necesidades particulares.' },
    { title: 'Acordad el plan', href: '/supervivencia/como-crear-plan-familiar-emergencia', task: 'Escribid contactos y un punto de encuentro alternativo cuando sea seguro.' },
    { title: 'Comprueba la energía', href: '/supervivencia/como-ahorrar-bateria-emergencia', task: 'Prueba la linterna y el cable que vas a guardar.' },
    { title: 'Revisa los cuidados', href: '/supervivencia/medicamentos-tratamientos-emergencias', task: 'Prepara las preguntas que necesitas consultar con tu farmacia o profesional sanitario.' },
    { title: 'Haz un ensayo de mesa', href: '/supervivencia/simulacro-familiar-emergencia-30-minutos', task: 'Sin apagar servicios ni simular llamadas al 112, localizad los recursos.' },
    { title: 'Programa la revisión', href: '/supervivencia/revision-mensual-preparacion-familiar', task: 'Elige una fecha y tres comprobaciones pequeñas para el próximo mes.' },
  ] },
  { id: 'sendero', title: 'Salir al sendero', intro: 'Siete decisiones antes de tu próxima excursión.', steps: [
    { title: 'Elige una ruta adecuada', href: '/supervivencia/senderismo-principiantes-planificar-ruta', task: 'Comprueba desnivel, terreno y puntos de retorno, no solo kilómetros.' },
    { title: 'Pon una hora de vuelta', href: '/supervivencia/hora-retorno-montana', task: 'Acordad cuándo daréis la vuelta y comunicad el plan a alguien.' },
    { title: 'Prepara ropa y protección', href: '/supervivencia/capas-ropa-senderismo-frio-lluvia', task: 'Prueba la combinación completa de capas y guarda una alternativa seca.' },
    { title: 'Comprueba orientación', href: '/supervivencia/brujula-mapa-orientacion-basica', task: 'Practica con un mapa en un lugar conocido y seguro.' },
    { title: 'Organiza la comida', href: '/supervivencia/comida-senderismo-sin-cocinar', task: 'Prepara alimentos conocidos y revisa alergias, envases y residuos.' },
    { title: 'Revisa la mochila de día', href: '/supervivencia/mochila-dia-senderismo-lista', task: 'Haz una comprobación por funciones y prueba el peso.' },
    { title: 'Aprende cuándo cancelar', href: '/supervivencia/tormenta-electrica-montana', task: 'Localiza previsiones oficiales y acuerda qué condiciones os harán cambiar de plan.' },
  ] },
] as const;
