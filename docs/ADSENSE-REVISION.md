# Revision de Modo Crisis Survival para AdSense

Fecha: 2026-10-08. Esta revision no garantiza la aprobacion de Google.

## Diagnostico

- La captura muestra dos estados independientes: contenido de poco valor y ads.txt no encontrado.
- Comprobacion publica: `/ads.txt` devolvia 404. Contacto, aviso legal y un articulo representativo respondian 200.
- El catalogo original tenia 98 articulos, con 27 introducciones informativas breves y contenido solapado. Las calculadoras se evaluan como herramientas, no solo por palabras. La longitud no es una regla de aceptacion de Google.
- El contador estadistico no respetaba el rechazo del banner. PayPal se conectaba antes de activar su boton.
- No conocemos el detalle interno de la evaluacion ni cuales son las paginas concretas rechazadas. No se ha accedido a la cuenta de AdSense.

## Cambios

- `public/ads.txt`: autoriza el ID real `pub-7330652876943268`. Archivo de texto, sin cargar anuncios ni rastreadores.
- `public/_headers`: tipo de contenido de ads.txt y noindex para tres vistas previas de desarrollo. No se ocultan articulos normales ni se cambia el contenido segun el visitante.
- `/politica-editorial`: responsable real, contacto, fuentes, uso de IA, limites de comparativas, financiacion y correcciones. Se enlaza desde todos los pies de pagina y desde la firma de los articulos.
- Se muestran las fechas de modificacion registradas y se retiran bloques comerciales genericos de guias organizativas y situaciones sanitarias o urgentes. Los enlaces Amazon restantes se identifican como publicidad. Esta moderacion es una decision editorial, no una afirmacion de que Google prohiba toda informacion sanitaria.
- Cuatro guias reescritas en sus mismas URLs: plan familiar, revision del kit, documentacion y preparacion de menores. Incorporan ejercicios especificos y fuentes; conservan sus portadas y no crean duplicados.
- Once guias adicionales reescritas con tareas concretas, ejercicios seguros y limites: MBTiles, bateria, alimentos refrigerados, simulacro, personas mayores, primeros pasos, funciones offline, rutas, frio y calor en casa, SOS y radio. Mantienen sus URLs y portadas.
- Doce introducciones duplicadas consolidadas en guias existentes mas completas. Sus 24 direcciones antiguas redirigen permanentemente. Catalogo, enlaces, indices y sitemap conservan 86 articulos canonicos. No hay contenido diferente para Google y visitantes.
- Referencias explicitas incorporadas a las herramientas y articulos que carecian de ellas. Distinguen formulas, unidades, contexto y seguridad: enlazar una fuente no equivale a certificar cientificamente cada herramienta o parrafo.
- Instrucciones de edicion retiradas de textos publicos y reparto de los 61 dias de ola de calor de 2026 corregido segun AEMET.
- Consentimiento estadistico funcional: aceptar, rechazar, configurar y revocar. Sin autorizacion no se envian eventos ni se crean marcas de visita. Las elecciones antiguas ambiguas no autorizan la nueva finalidad.
- PayPal se conecta solo tras activar su boton. No se cargan anuncios de Google ni Google Analytics.
- Privacidad, cookies, aviso legal y contacto describen los servicios reales. La politica Android facilitada por el titular se conserva separada y sin modificar.

## Verificacion local

Compilacion Next.js de produccion correcta, 90 pruebas correctas en 28 archivos, ESLint y comprobacion de espacios correctos. ads.txt local responde 200 y text/plain con el identificador real. Quince paginas revisadas a 360/414/768/1440 px sin desbordamiento horizontal; primera visita con banner comprobada en movil y CTAs del hero visibles.

Las 185 URLs del sitemap responden 200, tienen canonical correcto, un H1, son indexables y alcanzables desde la portada. Se revisaron 206 destinos internos sin enlaces rotos y 24 redirecciones permanentes. En navegador: rechazo sin eventos estadisticos, aceptacion explicita, revocacion respetada, PayPal sin precarga y anuncios sin activar.

Auditoria de datos: 86 articulos con fuentes explicitas y sin introducciones informativas pendientes de la criba de longitud. El umbral de esa criba es interno, no un requisito ni una garantia de AdSense. Las calculadoras se evaluan por su funcion. No se inventan experiencias propias, credenciales ni pruebas de productos.

Informes: `editorial-quality-audit.json`, `adsense-readiness-check.json`, `consent-redirects-check.json`, `public-links-check.json` e `indexing-audit.json`. Proceden de la version local, no del dominio desplegado.

El adaptador Next-on-Pages no se ha validado aqui: su herramienta falla en este Windows al intentar invocar npm desde Bash. La compilacion Next.js si se ha validado. Cloudflare debe confirmar su compilacion y despliegue de produccion.

## Pendientes del titular y su cuenta

1. Publicar los commits en origin/master y comprobar que Cloudflare termina correctamente. Comprobacion publica del 8 de octubre: ads.txt sigue dando 404 en el dominio y la variante www; todavia conservan la version anterior.
2. Facilitar nombre completo o razon social, NIF y domicilio valido para notificaciones que se autorice a publicar. El aviso legal utiliza solo nombre y correo conocidos; no debe presentarse como identificacion legal completa. Se ha solicitado esta informacion, sin inventarla.
3. Revisar los derechos de los materiales aportados y cualquier correccion especializada necesaria. No se ha afirmado una revision medica, juridica o tecnica externa de todos los contenidos.
4. En AdSense, comprobar la propiedad y buscar actualizaciones de ads.txt. El rastreo puede tardar. No quitar y volver a crear el sitio repetidamente.
5. Antes de activar publicidad, configurar en Privacidad y mensajes una CMP certificada de Google para la publicidad y regiones correspondientes. El banner local de estadisticas no es una CMP certificada ni autoriza personalizacion publicitaria.
6. Tras comprobar la version publicada y completar los datos pendientes, solicitar otra revision desde Sitios. No se ha cambiado la cuenta ni pulsado ese boton en nombre del titular.

ads.txt no sustituye el contenido original y util. No hay un numero de palabras, paginas indexadas, trafico ni plazo que garantice la aprobacion. Si Google vuelve a rechazar, revisar el motivo concreto; no recurrir a encubrimientos, trafico artificial o clics incentivados.

## Fuentes oficiales

- [Contenido y experiencia de usuario](https://support.google.com/adsense/answer/10015918?hl=es)
- [Sitio no listo para mostrar anuncios](https://support.google.com/adsense/answer/12176698?hl=es)
- [Crear y comprobar ads.txt](https://support.google.com/adsense/answer/12171612?hl=es)
- [Consentimiento y CMP](https://support.google.com/adsense/answer/13554116?hl=es)
- [Verificacion mediante etiqueta meta](https://support.google.com/adsense/answer/12169212?hl=es)
- [Privacidad requerida por AdSense](https://support.google.com/adsense/answer/1348695?hl=es)
- [LSSI: informacion para prestadores](https://lssi.digital.gob.es/lssi/la-ley/preguntas-frecuentes)
