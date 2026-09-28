import type { BlogPost } from "./blog";

const series = [
  ["como-prepararse-para-un-apagon", "72 horas sin luz ni Internet"],
  ["ciberataque-masivo-servicios-esenciales", "Servicios esenciales y ciberataques"],
  ["crisis-cadena-suministro-supermercados-vacios", "Una interrupción del abastecimiento"],
  ["espana-2030-calor-sequia-inundaciones", "Calor, sequía e inundaciones"],
  ["desinformacion-emergencias-deepfakes-alertas-falsas", "Desinformación y alertas falsas"],
] as const;
const common = {
  category: "Actualidad y preparación",
  date: "27 septiembre 2026",
  publishedAt: "2026-09-27",
  readingTime: "5 min",
};
const photo = (name: string, description: string) => ({
  image: `/images/blog/${name}.jpg`,
  imageAlt: `${description}. Imagen ilustrativa generada con IA, no una fotografía de una emergencia real.`,
});
const related = (current: number) => [
  {
    label: `Siguiente escenario: ${series[(current + 1) % 5][1]}`,
    href: `/supervivencia/${series[(current + 1) % 5][0]}`,
  },
  { label: "Prepara tu lista familiar", href: "/checklists" },
  { label: "Herramientas y calculadoras web", href: "/herramientas-supervivencia" },
];

export const resilienceArticles: BlogPost[] = [
  {
    ...common,
    ...photo(
      "energia-comunicacion-natural",
      "Radio, iluminación y energía de respaldo para el hogar",
    ),
    slug: series[0][0],
    title:
      "El día que todo se apaga: cómo prepararse para 72 horas sin electricidad, Internet ni pagos electrónicos",
    seoTitle: "Apagón total: cómo prepararse para 72 horas sin luz ni Internet",
    excerpt:
      "¿Qué ocurriría si un apagón dejara tu ciudad sin electricidad, Internet, cobertura y pagos electrónicos durante 72 horas? Así puedes prepararte.",
    keywords: [
      "apagón total",
      "apagón prolongado",
      "qué hacer en un apagón",
      "supervivencia apagón",
      "72 horas sin electricidad",
      "kit apagón",
      "prepararse para un apagón",
    ],
    warning:
      "Escenario hipotético, no aviso de un apagón previsto. Los efectos y los tiempos varían. Sigue las instrucciones oficiales; si dependes de equipos médicos eléctricos, acuerda un plan específico con tus profesionales sanitarios.",
    sections: [
      {
        heading: "Son las 18:47 y acaba de apagarse tu ciudad",
        body: "Imagina esta escena: la televisión se apaga. El router deja de funcionar. Las farolas de la calle también. Coges el teléfono: sin Wi-Fi. Todavía tienes cobertura, pero los mensajes tardan en salir. Bajas al supermercado y escuchas: «No funciona el datáfono; solo podemos cobrar en efectivo». Vas al cajero y encuentras una pantalla negra. Entonces comprendes algo importante: un apagón moderno no significa simplemente quedarse sin luz. Puede dejarte temporalmente sin parte de los sistemas de los que depende tu vida diaria. Es un ejercicio de preparación, no una descripción de lo que sucederá necesariamente.",
      },
      {
        heading: "El problema es todo lo que depende de la electricidad",
        body: "Telecomunicaciones, pagos, distribución de alimentos, gasolineras, semáforos, ascensores y refrigeración forman una red de dependencias. No fallan siempre a la vez ni de la misma manera: puede seguir funcionando una plataforma bancaria mientras un cajero o un terminal de pago carece de luz o conexión. El Banco de España analizó cómo el apagón del 28 de abril de 2025 afectó a los pagos. Prepararse no consiste en comprar veinte linternas, sino en disponer de alternativas para las tareas esenciales de tu hogar.",
      },
      {
        heading: "Las primeras dos horas: orientarte sin gastar tus recursos",
        body: "Comprueba si el corte afecta solo a tu vivienda, al edificio o a una zona mayor, sin manipular instalaciones ni exponerte a peligros. Busca información oficial por los medios disponibles y evita difundir rumores. Estas franjas horarias ordenan el ejercicio; no son un calendario universal de fallos.",
        bullets: [
          "Reduce el brillo y activa el ahorro de energía del móvil. Evita vídeos y usos innecesarios.",
          "Desactiva funciones que no necesites, pero conserva los medios de comunicación y alertas necesarios para tu situación.",
          "Evita abrir repetidamente frigorífico y congelador. La seguridad de los alimentos depende de tiempo y temperatura; no se comprueba probándolos.",
          "Localiza linternas, pilas, powerbanks, radio, agua, medicación, efectivo y documentación antes de que anochezca.",
        ],
      },
      {
        heading: "De dos a doce horas: administrar, no acaparar",
        body: "Si el suministro no vuelve, la incomodidad puede afectar a más actividades: algunos comercios cerrarán, determinadas comunicaciones se degradarán o el transporte sufrirá alteraciones. No lo des por seguro; comprueba la situación real. La regla útil es sencilla: no gastes sin necesidad lo que podrías necesitar mañana. Revisa las cargas del móvil, reserva iluminación para las tareas importantes y acuerda cuándo consultar información para no agotar la batería buscando novedades continuamente.",
      },
      {
        heading: "De doce a veinticuatro horas: la casa como base",
        body: "Ahora el ejercicio consiste en medir autonomía. ¿Cuánta agua hay realmente? ¿Cuántas comidas puedes preparar sin cocina eléctrica? ¿Puedes iluminar los espacios necesarios durante varias noches? ¿Tienes accesibles los tratamientos prescritos y sus condiciones de conservación? ¿Puedes escuchar información sin Internet? ¿Habéis acordado cómo reencontraros si estáis separados? Permanecer en casa no siempre será la opción adecuada: una orden oficial, un riesgo en el edificio o una necesidad sanitaria tienen prioridad.",
      },
      {
        heading: "De veinticuatro a setenta y dos horas: margen para tu familia",
        body: "La Estrategia de Preparación de la Unión Europea incluye desarrollar directrices para una autosuficiencia de la población de al menos 72 horas. No anuncia una catástrofe ni significa que todos los cortes duren tres días. Es una referencia para organizar recursos y reducir la necesidad inmediata de ayuda. Adapta el plan al espacio, presupuesto, personas, animales y riesgos de tu vivienda.",
        bullets: [
          "Agua para beber y necesidades esenciales, con almacenamiento adecuado y revisión.",
          "Comida habitual que pueda consumirse sin depender por completo de refrigeración o cocina eléctrica.",
          "Linternas y luces LED, pilas compatibles y powerbanks comprobadas. Evita las velas como iluminación principal.",
          "Una radio que sepas sintonizar y alimentar, contactos en papel y documentos accesibles.",
          "Medicación organizada según las indicaciones profesionales y una pequeña reserva razonable de efectivo.",
          "Un plan familiar con puntos de encuentro y atención a quien necesite ayuda.",
        ],
      },
      {
        heading: "Lo que no debes hacer",
        body: "Nunca uses un generador de combustión dentro de casa, un sótano o un garaje, aunque abras puertas y ventanas. Los CDC indican utilizarlo en exterior a más de 20 pies, aproximadamente seis metros, de puertas, ventanas y ventilaciones. Un balcón no es automáticamente seguro. No improvises conexiones eléctricas ni almacenes combustible de forma insegura. No uses un ascensor afectado hasta que su servicio se haya restablecido con seguridad. No difundas mensajes alarmistas sin comprobar su procedencia.",
      },
      {
        heading: "Haz una prueba, sin provocar una emergencia",
        body: "Esta noche imagina un corte de 24 horas sin comprar nada. No desconectes equipos médicos, refrigeración ni dispositivos esenciales para hacer el ejercicio. Recorre mentalmente una cena, una noche y la mañana siguiente. Anota qué faltaría primero, dónde está y quién sabe utilizarlo. Esa respuesta señala una mejora concreta: cargar una batería, preparar una lista de contactos o revisar el agua, no necesariamente comprar más.",
      },
      {
        heading: "Prepáralo antes de necesitarlo",
        body: "Modo Crisis Survival reúne guías, listas y recursos para consultar principalmente sin conexión. Descarga y comprueba previamente lo que vayas a utilizar: mapas, archivos y funciones no se preparan solos al perder cobertura. Un teléfono también puede quedarse sin batería; conserva alternativas en papel. Durante una emergencia hay algo mejor que buscar qué hacer: haber ensayado tu plan con calma.",
      },
    ],
    sources: [
      {
        title: "Comisión Europea: Estrategia de Preparación",
        url: "https://commission.europa.eu/topics/preparedness_es",
      },
      {
        title: "Banco de España: impacto del apagón de abril de 2025 sobre los sistemas de pago",
        url: "https://www.bde.es/f/webbe/GAP/Secciones/Publicaciones/InformesBoletinesRevistas/RevistaEstabilidadFinanciera/25/3_REF49_Apagon.pdf",
      },
      {
        title: "CDC: seguridad de los generadores",
        url: "https://www.cdc.gov/carbon-monoxide/media/pdfs/Generators_1.pdf",
      },
    ],
    relatedLinks: related(0),
  },
  {
    ...common,
    ...photo("familia-preparada-natural", "Preparación doméstica de recursos y documentación"),
    slug: series[1][0],
    title:
      "El ciberataque que no ves venir: qué pasaría si durante varios días fallaran bancos, Internet o servicios esenciales",
    seoTitle: "Ciberataque masivo: cómo prepararse si fallan servicios esenciales",
    excerpt:
      "Un gran ciberataque podría afectar bancos, comunicaciones o servicios digitales. Descubre cómo preparar tu hogar sin caer en alarmismos.",
    keywords: [
      "ciberataque masivo",
      "ciberataque infraestructura crítica",
      "caída de Internet",
      "bancos sin servicio",
      "preparación ciberataque",
    ],
    warning:
      "Una aplicación caída no demuestra un ciberataque. Este escenario es hipotético: confirma la información con el proveedor y los organismos competentes, y no compartas claves ni códigos de acceso.",
    sections: [
      {
        heading: "Esta crisis podría empezar sin que escuchases nada",
        body: "No habría explosiones, humo ni necesariamente sirenas. Intentarías entrar en tu banco y aparecería «Servicio temporalmente no disponible». Después fallaría otra aplicación. En redes circularían explicaciones contradictorias y descubrirías que varias empresas tienen problemas. Es una escena posible, no una prueba de que todas sufran un ataque. Una avería o una incidencia compartida también pueden producir síntomas parecidos. Lo importante para tu hogar es saber qué puedes seguir haciendo mientras se aclara la causa.",
      },
      {
        heading: "Nuestra dependencia digital es enorme",
        body: "No hace falta imaginar que desaparece todo Internet. Una interrupción puede afectar a un proveedor tecnológico, una empresa de telecomunicaciones, un servicio administrativo, una cadena logística o una entidad concreta. Compartir proveedores puede ampliar el alcance de un incidente. ENISA estudia amenazas como ransomware y ataques contra la disponibilidad de servicios. Ese análisis ayuda a comprender riesgos, pero no predice que un día determinado vayan a dejar de funcionar todos los bancos.",
      },
      {
        heading: "¿Qué notaría una familia normal?",
        body: "Probablemente algo poco cinematográfico: una transferencia pendiente, una web que no carga, un comercio que no procesa un medio de pago o un trámite que se aplaza. Una operación fallida no implica que debas repetirla sin comprobar su estado. Consulta al proveedor por sus canales habituales. El problema doméstico aumenta cuando no queda ninguna alternativa: ni un teléfono escrito, ni una copia local de un documento necesario, ni otra forma de completar una gestión importante.",
      },
      {
        heading: "Nunca dependas de una única vía",
        body: "Si todos tus documentos están únicamente en la nube, dependes de esa cuenta, de su proveedor y de la conexión. Si todos los contactos están en un solo teléfono, también dependes de su batería y de que no se pierda. Crear redundancia no consiste en difundir copias por todas partes: consiste en elegir alternativas útiles y protegerlas. Una carpeta indiscriminada con documentos, contraseñas y datos bancarios puede aumentar el daño de una pérdida.",
        bullets: [
          "Anota contactos importantes de familia, seguros, banco, asistencia y profesionales habituales.",
          "Prepara copias seguras de los documentos necesarios, con acceso controlado.",
          "Comprueba una copia de seguridad con un archivo de ejemplo, no solo que exista.",
          "Conserva códigos de recuperación de cuentas en un lugar seguro, separado del dispositivo cuando proceda.",
        ],
      },
      {
        heading: "Tu plan de contingencia digital",
        body: "Utiliza contraseñas distintas y un gestor fiable cuando te resulte adecuado. Activa la autenticación multifactor, especialmente en correo y cuentas importantes, y prepara sus opciones de recuperación. Mantén sistemas y aplicaciones actualizados. Antes de una crisis, aprende a llegar por ti mismo al canal oficial de cada servicio: un enlace urgente recibido por mensaje no es un acceso de confianza.",
        bullets: [
          "No entregues contraseñas, códigos de un solo uso ni claves de recuperación a quien contacte contigo.",
          "Desconfía de mensajes sobre supuestas ayudas, bloqueos de cuentas o verificaciones inmediatas.",
          "Comprueba solicitudes por un canal conocido e independiente del mensaje recibido.",
          "Si detectas un problema en una cuenta, sigue el procedimiento del proveedor desde su aplicación o web oficial.",
        ],
      },
      {
        heading: "¿Y si además falla Internet?",
        body: "Pregúntate qué puedes consultar sin buscarlo primero en un navegador. ¿Está descargado el mapa o solo lo viste una vez? ¿La documentación abre sin iniciar sesión? ¿Tienes un punto de encuentro acordado? La preparación digital también consiste en poder funcionar temporalmente sin ciertos servicios. No todos los documentos descargados sustituyen al original o sirven para cualquier trámite: identifica sus límites antes de necesitarlos.",
      },
      {
        heading: "Haz un experimento controlado",
        body: "Desde un lugar seguro y sin una emergencia activa, avisa a tu familia y prueba brevemente las funciones offline. No desconectes comunicaciones o equipos de los que dependa una persona. Puedes usar modo avión solo si es apropiado para tu situación: bloqueará llamadas y mensajes habituales mientras permanezca activo. Intenta consultar un mapa descargado, un contacto y un documento de ejemplo; después restablece la conexión. La comunicación con la familia se ensaya con conexión o mediante un acuerdo previo, no esperando que funcione en modo avión.",
      },
      {
        heading: "La preparación del futuro también será digital",
        body: "Agua, alimentos, refugio y herramientas siguen importando. Hemos añadido otra dependencia: información que a menudo vive detrás de una contraseña y una conexión. Combina recursos físicos con copias offline útiles, protegidas y comprobadas. Empieza por una sola tarea: recuperar un contacto importante sin desbloquear tu móvil habitual. Después prueba otra. Un plan pequeño que funciona vale más que una colección de archivos que nadie sabe abrir.",
      },
    ],
    sources: [
      {
        title: "ENISA: panorama de amenazas",
        url: "https://www.enisa.europa.eu/topics/cyber-threats/threat-landscape",
      },
      {
        title: "INCIBE: consejos para evitar riesgos en línea",
        url: "https://www.incibe.es/sites/default/files/2024-12/tips-para-evitar-riesgos-en-linea.pdf",
      },
    ],
    relatedLinks: related(1),
  },
  {
    ...common,
    ...photo("reserva-agua-natural", "Organización doméstica de una reserva de agua"),
    slug: series[2][0],
    title:
      "Supermercados vacíos en 48 horas: qué pasaría si se rompe temporalmente la cadena de suministro",
    seoTitle: "Supermercados vacíos: cómo prepararse ante una crisis de suministro",
    excerpt:
      "¿Qué ocurriría si durante varios días se interrumpiera el abastecimiento de alimentos, combustible o productos básicos? Aprende a prepararte.",
    keywords: [
      "crisis de suministro",
      "desabastecimiento supermercado",
      "almacenar comida emergencia",
      "crisis alimentos",
      "reserva alimentos 72 horas",
    ],
    warning:
      "Las 48 horas del título plantean un escenario hipotético: no existe aquí una predicción ni un plazo universal de desabastecimiento. Evita compras de pánico y sigue la información local.",
    sections: [
      {
        heading: "El supermercado parece un almacén infinito. No lo es",
        body: "Entras cualquier lunes: agua, arroz, pasta, conservas, fruta llegada de otras regiones y productos de higiene. Parece normal. Detrás de cada estantería hay agricultores, fabricantes, almacenes, transporte, combustible, electricidad, carreteras, trabajadores, pagos y sistemas informáticos. El supermercado es el último eslabón de muchas cadenas diferentes. Una falta puntual de un producto no significa que vaya a desaparecer toda la oferta de alimentos.",
      },
      {
        heading: "¿Qué podría interrumpir esa cadena?",
        body: "No hace falta imaginar una catástrofe global. Una inundación puede cortar una carretera; una tormenta, alterar un puerto; un fallo tecnológico, retrasar una empresa logística. También pueden influir problemas energéticos o interrupciones del transporte. Son ejemplos de dependencias, no avisos de que vayan a ocurrir. El efecto depende de existencias, alternativas, duración y productos afectados: no hay un reloj común que deje vacías todas las tiendas a las 48 horas.",
      },
      {
        heading: "El comportamiento colectivo también importa",
        body: "Imagina una noticia ambigua sobre problemas de abastecimiento. Muchas personas deciden comprar al mismo tiempo «por si acaso». Esa demanda puede dificultar la reposición de determinados productos, incluso cuando el problema inicial era limitado. Prepararte progresivamente permite no competir por recursos cuando aparece incertidumbre. Consulta la información del servicio afectado y no conviertas una fotografía de una estantería en una conclusión sobre todo el país.",
      },
      {
        heading: "No necesitas almacenar comida para seis meses",
        body: "Para empezar, revisa lo que tu hogar necesita durante unos días. La referencia europea de 72 horas es un punto de partida de preparación, no una obligación de comprar un paquete concreto. Después puedes valorar un margen mayor según espacio, presupuesto y circunstancias. La reserva debe ser manejable, accesible y compatible con las necesidades familiares. No sacrifiques gastos esenciales ni bloquees pasillos y salidas para acumular cajas.",
      },
      {
        heading: "El método de la despensa rotativa",
        body: "Compra alimentos que realmente consumís y organiza los más antiguos delante. Repón según lo que uses, revisando fechas y condiciones del envase. Tu reserva forma parte de la despensa habitual; no es un almacén olvidado. Arroz, pasta o legumbres secas necesitan agua, tiempo y cocción: no deben ser toda la reserva si también puede faltar electricidad.",
        bullets: [
          "Incluye opciones listas para consumir y un abrelatas manual cuando sea necesario.",
          "Ten en cuenta alergias, intolerancias, alimentación infantil y otras necesidades específicas.",
          "Revisa productos de larga duración y qué conservación requieren después de abrirlos.",
          "Cuenta las comidas para las personas reales del hogar, no solo el número de paquetes.",
          "Incluye alimento y necesidades de las mascotas, si las hay.",
        ],
      },
      {
        heading: "Empieza también por el agua",
        body: "No cuentes únicamente alimentos. Revisa cuántos litros de agua apta para el uso previsto tienes disponibles, cómo están almacenados y qué necesidades cubren. Beber, preparar comida e higiene no son la misma partida. No todas las fuentes alternativas son potables. Un cálculo de volumen ayuda a organizarte, pero no certifica la calidad del agua ni sustituye indicaciones sanitarias o restricciones del suministro.",
        links: [
          {
            label: "Calcular la autonomía de tu reserva de agua",
            href: "/supervivencia/calculadora-gestion-agua-supervivencia#calculadora",
          },
        ],
      },
      {
        heading: "Medicamentos: planificar, no acumular",
        body: "Si una persona depende de un tratamiento, una interrupción puede importar más que no encontrar un alimento concreto. Organiza las prescripciones y consulta con profesionales sanitarios o tu farmacia cómo gestionar las necesidades particulares, renovaciones y conservación. No acapares medicamentos, no cambies dosis para alargar existencias ni sustituyas un tratamiento por tu cuenta.",
      },
      {
        heading: "La regla de oro: tener margen",
        body: "Una reserva útil permite decir: «No necesito salir corriendo a comprar porque hoy haya incertidumbre». Ese es el objetivo: no acumular, competir ni entrar en pánico. Comparte el plan con las personas que conviven contigo y revisa que todas saben dónde están los recursos. Comprar más no arregla una reserva que nadie localiza o cuyos alimentos no podéis preparar.",
      },
      {
        heading: "Revisa ahora mismo tu cocina",
        body: "Imagina tres días sin poder comprar. ¿Cuántas personas comen en casa? ¿Cuántas comidas completas podrías preparar? ¿Dependes de una nevera o cocina eléctrica para casi todo? ¿Hay suficiente agua y alguna dieta especial? Anota también tratamientos imprescindibles y mascotas. Elige una carencia concreta y resuélvela gradualmente. Tus respuestas describen mejor tu preparación que el tamaño del último pedido.",
      },
    ],
    sources: [
      {
        title: "Comisión Europea: preparación de la población y suministros esenciales",
        url: "https://commission.europa.eu/topics/preparedness_es",
      },
    ],
    relatedLinks: [...related(2), {label:'Conservar los alimentos durante un apagón',href:'/supervivencia/gestion-alimentos-sin-electricidad'}],
  },
  {
    ...common,
    ...photo("lluvia-prevencion-editorial", "Calle residencial bajo la lluvia"),
    slug: series[3][0],
    title:
      "España 2030: calor extremo, sequía y lluvias torrenciales; cómo preparar tu casa para un clima más difícil",
    seoTitle: "España 2030: cómo prepararse para calor, sequía e inundaciones",
    excerpt:
      "Calor extremo, falta de agua, DANAs e inundaciones plantean riesgos en España. Cómo adaptar tu hogar y tu plan familiar a tu entorno.",
    keywords: [
      "emergencias climáticas España",
      "prepararse DANA",
      "sequía España",
      "ola de calor",
      "inundaciones",
      "cambio climático supervivencia",
    ],
    warning:
      "2030 es un horizonte para planificar, no una previsión meteorológica concreta. Consulta los avisos actuales de AEMET y las instrucciones de Protección Civil de tu zona.",
    sections: [
      {
        heading: "Demasiada agua y demasiado poca agua",
        body: "Imagina meses con poca lluvia, restricciones y presión sobre el suministro. Después, en pocas horas, llegan precipitaciones intensas, calles anegadas y carreteras cortadas. Son escenarios distintos que pueden afectar a un mismo territorio en momentos diferentes. Esa aparente paradoja explica por qué no basta con prepararse para una sola emergencia. El título mira hacia 2030 como ejercicio de adaptación; no afirma que una ciudad concreta vaya a sufrir esos episodios en una fecha determinada.",
      },
      {
        heading: "España está en una región sensible a múltiples riesgos",
        body: "La evaluación europea de riesgos climáticos identifica problemas vinculados al calor, inundaciones, agua, incendios y producción agrícola. El sur de Europa presenta una exposición especialmente importante a varios de ellos. Una evaluación regional no describe el riesgo exacto de cada vivienda: la ubicación, el edificio y las circunstancias personales importan. Prepararte puede exigir tanto organizar una reserva ante cortes de agua como saber qué hacer si el agua amenaza el acceso a casa.",
      },
      {
        heading: "Escenario uno: calor intenso durante un apagón",
        body: "En el ejercicio, la temperatura exterior supera los 38 °C y falla la electricidad. El problema no es solo dejar de cargar el teléfono: también puede aumentar el calor interior. Identifica con antelación las zonas más frescas y consulta las recomendaciones sanitarias para las personas más vulnerables. No existe un horario universal de ventilación válido para todas las viviendas y condiciones.",
        bullets: [
          "Reduce la entrada de sol mediante persianas o protección adecuada.",
          "Ventila cuando las condiciones exteriores permitan refrescar, sin ignorar humo u otros riesgos.",
          "Localiza espacios frescos o climatizados habilitados cuando existan y sea seguro llegar.",
          "Presta atención a mayores, menores y personas con enfermedades o necesidades particulares.",
          "Consulta al profesional sanitario sobre tratamientos y conservación de medicamentos; no los modifiques por tu cuenta.",
        ],
      },
      {
        heading: "Escenario dos: varios días con problemas de agua",
        body: "Abres el grifo y cae la presión hasta desaparecer. ¿Cuánta agua tienes realmente? ¿Para qué usos está destinada? Prepara el almacenamiento antes de una incidencia y revisa las comunicaciones del suministrador y las autoridades. No asumas que recuperar presión significa que el agua ya sea apta para beber si se ha emitido una advertencia sanitaria. La preparación incluye conocer el canal donde se comunicaría el restablecimiento del servicio.",
      },
      {
        heading: "Escenario tres: empieza a llover y llega una alerta",
        body: "Aquí la prioridad puede cambiar: ya no se trata de almacenar, sino de seguir instrucciones de protección. Una alerta no autoriza a improvisar una evacuación por cualquier carretera. Consulta su zona, horario y medidas; una orden oficial tiene prioridad sobre este artículo.",
        bullets: [
          "No atravieses zonas inundadas a pie ni en vehículo, aunque parezcan poco profundas.",
          "No bajes a sótanos o garajes que puedan inundarse para salvar objetos o el coche.",
          "Aléjate de cauces y barrancos; no te acerques a observar ni grabar una crecida.",
          "Sigue las indicaciones locales de refugio o evacuación y no te expongas para recoger pertenencias.",
        ],
      },
      {
        heading: "Prepara tu vivienda según dónde vives",
        body: "No existe un kit perfecto para todos. Una casa próxima a un cauce, un piso alto sin ascensor operativo y una vivienda rural presentan necesidades distintas. Consulta información oficial sobre riesgos locales y prepara alternativas sin dar por seguros los itinerarios habituales.",
        bullets: [
          "Exposición a inundación o incendio y restricciones del entorno.",
          "Temperatura interior y dependencia de climatización o equipos eléctricos.",
          "Personas que necesitan ayuda, mascotas y disponibilidad de transporte.",
          "Accesibilidad de documentos, medicación y contactos.",
          "Puntos de encuentro y rutas alternativas que deberán adaptarse a la situación real.",
        ],
      },
      {
        heading: "La preparación empieza antes del aviso",
        body: "Decide con tiempo quién ayuda a los niños, cómo atender a una persona dependiente y qué recursos necesita cada mascota. Localiza documentos y tratamientos; comprueba el equipo básico y comparte el plan. No esperes a recibir una alerta grave para averiguar dónde está todo. Aun así, un plan no debe convertirse en una rutina rígida: si la autoridad indica permanecer dentro o evita una ruta, cambia lo acordado.",
      },
      {
        heading: "Reducir vulnerabilidad sin vivir esperando una catástrofe",
        body: "No podemos controlar el tiempo meteorológico. Sí podemos detectar una persiana que no cierra, una reserva sin revisar o un contacto que solo conoce una persona. Elige una mejora pequeña y compruébala. Adaptar una vivienda no siempre consiste en comprar aparatos: puede empezar por pedir información al ayuntamiento, revisar los riesgos con profesionales y acordar ayuda con la familia.",
      },
    ],
    sources: [
      {
        title: "Agencia Europea de Medio Ambiente: evaluación europea de riesgos climáticos",
        url: "https://climate-adapt.eea.europa.eu/en/eu-adaptation-policy/key-eu-actions/european-climate-risk-assessment",
      },
      {
        title: "Ministerio de Sanidad: prevención de los efectos del calor",
        url: "https://www.sanidad.gob.es/gabinete/notasPrensa.do?id=6111",
      },
      {
        title: "MITECO: qué hacer en caso de inundación",
        url: "https://www.miteco.gob.es/es/agua/temas/gestion-de-los-riesgos-de-inundacion/cnih/tras-huellas-agua/aprende/hacer-inundacion.html",
      },
      {
        title: "AEMET: avisos meteorológicos vigentes",
        url: "https://www.aemet.es/es/eltiempo/prediccion/avisos",
      },
    ],
    relatedLinks: [...related(3), {label:'Qué hacer durante una DANA',href:'/supervivencia/que-hacer-durante-dana'}, {label:'Preparar la vivienda ante frío o calor',href:'/supervivencia/refugio-temporal-casa-frio-calor'}],
  },
  {
    ...common,
    ...photo(
      "aprendizaje-campo-natural",
      "Consulta y preparación de información antes de una salida",
    ),
    slug: series[4][0],
    title:
      "La próxima gran emergencia podría empezar con una mentira: desinformación, deepfakes y caos informativo",
    seoTitle: "Desinformación en emergencias: detectar alertas falsas y deepfakes",
    excerpt:
      "Durante una crisis pueden circular audios, vídeos y alertas falsas creadas incluso con IA. Aprende a verificar información antes de actuar.",
    keywords: [
      "desinformación en emergencias",
      "deepfake",
      "alertas falsas",
      "noticias falsas emergencia",
      "IA desinformación",
      "verificar información",
    ],
    warning:
      "No retrases una medida de protección ante peligro inmediato ni una instrucción oficial urgente para buscar otra fuente. El 112 es para emergencias reales, no para comprobar rumores.",
    sections: [
      {
        heading: "Imagina recibir este mensaje",
        body: "Tu teléfono vibra. Un familiar reenvía un audio: «URGENTE. Un amigo que trabaja en emergencias dice que van a cortar el agua esta noche». Después llega otro sobre carreteras cerradas y un vídeo de una supuesta autoridad. Mucha gente comienza a compartirlos. En este escenario los mensajes son falsos, pero todavía nadie ha identificado de dónde salieron. El ejemplo no describe un aviso real: muestra lo fácil que puede resultar actuar antes de verificar.",
      },
      {
        heading: "Verlo no significa necesariamente que sea verdad",
        body: "Una voz, una fotografía o un vídeo pueden estar manipulados o generados artificialmente. También puede engañar una imagen auténtica de otro lugar o fecha, sin intervención de IA. Un logotipo institucional, una captura de pantalla y una voz reconocible no acreditan por sí solos la procedencia. No necesitas convertirte en perito audiovisual para adoptar una buena costumbre: buscar el mensaje original en el canal responsable.",
      },
      {
        heading: "Por qué es peligroso durante una emergencia",
        body: "La incertidumbre, la urgencia y la información incompleta dificultan decidir con calma. Un mensaje aparentemente preciso puede ofrecer una explicación tranquilizadora o alarmante antes de que se conozcan los hechos. Reenviarlo por precaución no es inocuo si lleva a comprar compulsivamente, desplazarse hacia una zona peligrosa o facilitar datos a un estafador. La intención de ayudar no sustituye la comprobación.",
      },
      {
        heading: "El mensaje falso puede parecer auténtico",
        body: "No esperes siempre faltas de ortografía o un montaje evidente. Puede usar imágenes reales, nombres de instituciones y una presentación cuidada. Las herramientas de detección de IA y los defectos visuales no son pruebas infalibles. Un contenido convincente merece la misma revisión de origen, fecha y contexto que cualquier otro mensaje importante.",
      },
      {
        heading: "Contrasta la fuente, no solo el número de reenvíos",
        body: "Para un mensaje no verificado, busca el comunicado en la web, aplicación o cuenta oficial del organismo responsable. Comprueba lugar, fecha, horario y medidas. Una segunda fuente independiente puede ayudar, pero veinte reenvíos del mismo audio siguen siendo una sola fuente. Tampoco exijas dos confirmaciones para obedecer una instrucción oficial urgente auténtica.",
        bullets: [
          "Para meteorología, consulta AEMET; para medidas de protección, los canales oficiales de tu comunidad, municipio y Protección Civil.",
          "Comprueba la dirección completa del sitio. No accedas a una supuesta ayuda desde un enlace dudoso.",
          "Consulta publicaciones oficiales de los servicios de emergencias cuando estén disponibles. No llames al 112 para verificar una cadena de mensajes.",
          "Ante peligro inmediato, protégete y solicita ayuda de emergencia cuando corresponda; no dediques tiempo a investigar un vídeo.",
        ],
      },
      {
        heading: "Nunca confundas viralidad con credibilidad",
        body: "«Lo está diciendo todo el mundo» no equivale a «está confirmado». Si no localizas una fuente identificable, no presentes el mensaje como un hecho. Puedes preguntar por su origen sin volver a difundirlo masivamente. Si ya lo compartiste y descubres que era falso, comunica la corrección a las mismas personas y enlaza el desmentido oficial cuando exista.",
      },
      {
        heading: "¿Y si Internet está saturado?",
        body: "Ten localizados previamente emisoras, contactos, puntos de encuentro y documentación útil. Una radio puede aportar información, pero tampoco toda emisión o comentario es una instrucción oficial para tu localidad. Revisa qué organismo está hablando y a qué zona se refiere. Los mapas offline ayudan a consultar información preparada, pero no muestran necesariamente cierres de carreteras o cambios recientes: no deben imponerse a las instrucciones actuales.",
      },
      {
        heading: "Cuidado con los audios que invocan a un conocido",
        body: "«Mi primo trabaja en…», «un amigo de un policía…», «una persona del hospital dice…». La cercanía aparente no identifica una fuente comprobable. Pregúntate quién firma el aviso, dónde se publicó originalmente y qué acción pretende provocar. Si una voz conocida pide dinero, datos o un código urgente, contrástalo por otro canal que ya conozcas; no respondas únicamente al contacto que te acaba de escribir.",
      },
      {
        heading: "Una nueva habilidad de preparación",
        body: "Orientarse, conservar recursos y reparar siguen teniendo valor. A esas habilidades se suma verificar antes de reaccionar a un mensaje dudoso. Cuando no existe peligro inmediato, detenerte a comprobar una información puede evitar una decisión equivocada. Cuando sí lo hay, la protección de las personas tiene prioridad: no conviertas la verificación en una excusa para ignorar una alerta oficial o retrasar ayuda.",
      },
      {
        heading: "El hilo que une los cinco escenarios",
        body: "Un apagón, un ciberataque, una interrupción del suministro, una emergencia climática y una campaña de desinformación parecen problemas distintos. Comparten nuestra dependencia de electricidad, agua, telecomunicaciones, logística, pagos e información. No sabemos cuál será la próxima incidencia ni tiene sentido prepararse obsesivamente para una sola catástrofe. La preparación inteligente crea alternativas para que el hogar pueda seguir atendiendo sus necesidades durante una interrupción, con un margen adaptado a su situación.",
      },
      {
        heading: "¿Tu familia tendría margen durante 72 horas?",
        body: "Hazte una última pregunta: si faltaran durante unos días la electricidad, Internet, algunos medios de pago o la posibilidad de comprar, ¿qué echarías primero en falta? Revisa agua, alimentación, energía, comunicación, medicación, documentos y acuerdos familiares. Empieza por una mejora concreta. La resiliencia no empieza cuando aparece la alerta: se construye antes, paso a paso.",
      },
      {
        heading: "Prepáralo hoy. Consúltalo cuando lo necesites",
        body: "Modo Crisis Survival permite preparar guías, mapas, listas y otros recursos para uso principalmente offline. Descarga y prueba lo necesario mientras tengas conexión, y conoce las funciones que sí dependen de servicios externos. La app complementa tu plan; no sustituye las instrucciones oficiales, una llamada de emergencia, la formación ni una alternativa cuando se agota la batería.",
      },
    ],
    sources: [
      {
        title: "INCIBE: consejos para evitar riesgos en línea",
        url: "https://www.incibe.es/sites/default/files/2024-12/tips-para-evitar-riesgos-en-linea.pdf",
      },
      {
        title: "Protección Civil: recomendaciones oficiales",
        url: "https://www.proteccioncivil.es/gestion-riesgos/recomendaciones",
      },
      {
        title: "AEMET: avisos meteorológicos",
        url: "https://www.aemet.es/es/eltiempo/prediccion/avisos",
      },
    ],
    relatedLinks: related(4),
  },
];
