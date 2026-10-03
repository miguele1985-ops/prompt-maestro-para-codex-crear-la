export const appPrivacy = {
  title: "Politica de privacidad de Modo Crisis Survival",
  version: "Version Android de Google Play",
  updatedAt: "2026-10-03",
  responsible: "miguel angel",
  email: "migueleclip@gmail.com",
  publicationUrl: "https://modo-crisis-survival.pages.dev/privacidad",
  sections: [
    {
      title: "Datos en el dispositivo",
      body: "El inventario, contactos introducidos manualmente, notas, plan familiar, datos de salud, medicacion, documentos, fotos elegidas y registros de emergencia se guardan en el almacenamiento privado de esta app. No se envian a nuestro servidor. No creamos cuentas ni identificadores de licencia, no hay publicidad ni pagos y no utilizamos un servicio propio de analitica. Los SDK de terceros se describen por separado. El PIN limita el acceso a la interfaz: no cifra todos los archivos.",
    },
    {
      title: "Ubicacion y sensores",
      body: "La ubicacion se utiliza con tu permiso mientras usas mapas, orientacion, horas de luz o registros de emergencia. Si pulsas el widget de ubicacion, solicitas guardar una posicion desde ese acceso de Android; no se activa automaticamente. Puede usarse la ultima posicion disponible de los dos minutos anteriores, con su hora de captura real. Conservamos hasta 100 capturas pendientes del widget hasta que se importan a tus ubicaciones locales. No solicitamos el permiso de ubicacion en segundo plano ni seguimiento continuo con la app cerrada. Los registros de camara y microfono requieren activacion y permiso, se indican en pantalla y se detienen al pasar a segundo plano. Las comunicaciones cercanas usan Bluetooth o Wi-Fi cuando las activas; el otro dispositivo recibe lo que decides enviar.",
    },
    {
      title: "Chat local y denuncias",
      body: "El chat requiere aceptar las normas y autorizar cada dispositivo. Bluetooth utiliza el enlace seguro de Android entre equipos emparejados. Wi-Fi Direct utiliza TLS y requiere comparar el codigo de identidad con el otro telefono antes de autorizarlo. Los mensajes recibidos y enviados solo permanecen en memoria mientras esta pantalla siga abierta; no se publican ni se envian a un servidor. La aceptacion de normas, las identidades bloqueadas y la clave privada de identidad se conservan en el dispositivo. Las denuncias que guardes incluyen el mensaje seleccionado, identidad tecnica del dispositivo, motivo, fecha y observaciones; se conservan hasta que borres los datos de la app (hasta 100 denuncias). Solo se envian al responsable y al proveedor de correo cuando decides abrir y enviar el correo. El bloqueo se aplica a esa identidad tecnica; no identifica a una persona que cambie de dispositivo. Al salir de la pantalla o pasar a segundo plano se cierran las conexiones. Borrar todos los datos elimina tambien estos bloqueos, denuncias, autorizaciones y claves.",
    },
    {
      title: "Tiempo con Internet",
      body: "Antes de consultar Open-Meteo pedimos autorizacion. Se envian coordenadas redondeadas a dos decimales para el pronostico, o el nombre de la poblacion que escribes para buscarla. El proveedor recibe tambien tu direccion IP y datos tecnicos de la peticion. Puedes rechazarlo y consultar el ultimo pronostico local, si existe. No se solicita GPS ni se actualiza el tiempo automaticamente desde el inicio. No se realiza geocodificacion inversa del GPS. Open-Meteo informa de que sus registros tecnicos pueden incluir IP y coordenadas y se eliminan tras 90 dias (https://open-meteo.com/en/terms).",
    },
    {
      title: "Otros servicios externos",
      body: "Al abrir alertas se consulta GDACS y el portal sismico europeo EMSC; las distancias se calculan en tu dispositivo. Al usar radio se consulta Radio Browser y el proveedor de la emisora. Estas conexiones transmiten IP y datos tecnicos al proveedor. Si abres un mapa externo, compartes coordenadas con ese servicio. Las copias, PDF, fotos y grabaciones solo salen de la app cuando eliges compartirlos o exportarlos. Comprueba el destinatario y evita compartir datos de terceros sin autorizacion. La radio se detiene al salir de la app; no notificamos al directorio cada emisora que escuchas.",
    },
    {
      title: "SDK de camara de Google",
      body: "La biblioteca de camara de Android incluye Google ML Kit y componentes de Google Play Services. Esta app no ofrece escaneo de codigos de barras y hemos retirado el inicio automatico de ML Kit, pero esas bibliotecas forman parte de la version. Google indica que ML Kit recoge informacion tecnica del dispositivo y de la app, identificadores por instalacion, metricas de rendimiento y eventos de sus funciones para diagnostico y analisis de uso, mediante HTTPS. No prometemos que estas bibliotecas carezcan de comunicaciones tecnicas. No enviamos tus documentos ni grabaciones a nuestro servidor. Puedes consultar la informacion de Google sobre estos SDK en https://developers.google.com/ml-kit/android-data-disclosure y su politica en https://policies.google.com/privacy.",
    },
    {
      title: "Conservacion y eliminacion",
      body: "Los datos locales permanecen hasta que los borras o desinstalas. En Ajustes, Borrar todos los datos personales elimina los registros y archivos privados de esta app, incluidas las copias locales, mapas importados y autorizaciones. No borra las copias que ya exportaste fuera de la app ni datos que terceros hayan recibido por tu decision. No activamos copias de seguridad automaticas de Android. El mapa de Google Play puede prepararse de nuevo despues de borrar los datos.",
    },
    {
      title: "Base juridica y derechos",
      body: "El acceso a sensores y el envio de ubicacion al servicio meteorologico se habilitan con tu autorizacion. El soporte que solicites se atiende para responder tu peticion; los datos que envies al contacto de privacidad se conservaran mientras sean necesarios para resolverla o cumplir obligaciones legales. Puedes retirar permisos en Android y revocar la autorizacion meteorologica en Ajustes. Para acceso, rectificacion, supresion, limitacion, oposicion, portabilidad o informacion sobre destinatarios y transferencias, contacta con el responsable. Puedes reclamar ante la Agencia Espanola de Proteccion de Datos (www.aepd.es).",
    },
    {
      title: "Seguridad y terceros",
      body: "Las consultas de red emplean HTTPS. Los documentos y grabaciones contienen informacion potencialmente sensible: protege el telefono y las copias que exportes. Las practicas de conservacion y transferencias de los proveedores externos deben revisarse en sus respectivas politicas. No prometemos que un dispositivo comprometido o una copia compartida permanezcan protegidos.",
    },
    {
      title: "Salud y condiciones de uso",
      body: "Esta version es gratuita y no exige licencia ni pagos. Ofrece informacion educativa y organizacion personal. No es un dispositivo medico y no diagnostica, trata, cura ni previene enfermedades; no sustituye a profesionales sanitarios ni a los servicios de emergencia. Consulta a un profesional para asesoramiento, diagnostico o tratamiento. En una emergencia llama al 112 y sigue sus instrucciones. Los calculos, mapas y senales son orientativos: no garantizan rutas seguras, ausencia de riesgos ni disponibilidad de recursos. Las imagenes ilustrativas, incluidas las creadas con IA, no sirven por si solas para identificar especies comestibles o peligrosas. Los menores deben usar las herramientas bajo supervision adulta.",
    },
  ],
} as const;
