# Primera mejora para la revision de AdSense

Fecha: 2026-10-08. Esta revision no garantiza la aprobacion de Google.

## Diagnostico

- La captura muestra dos estados independientes: contenido de poco valor y ads.txt no encontrado.
- Comprobacion publica: `/ads.txt` devolvia 404. Contacto, aviso legal y un articulo representativo respondian 200.
- El inventario tiene 98 articulos. Antes de esta mejora, 27 guias informativas tenian menos de 250 palabras de cuerpo; las 13 calculadoras cortas se evaluan por separado porque ofrecen funciones interactivas. La longitud no es una regla de aceptacion de Google.
- No conocemos el detalle interno de la evaluacion ni cuales son las paginas concretas rechazadas. No se ha accedido a la cuenta de AdSense.

## Cambios

- `public/ads.txt`: autoriza el ID real `pub-7330652876943268`. Archivo de texto, sin cargar anuncios ni rastreadores.
- `public/_headers`: tipo de contenido de ads.txt y noindex para tres vistas previas de desarrollo. No se ocultan articulos normales ni se cambia el contenido segun el visitante.
- `/politica-editorial`: responsable real, contacto, fuentes, uso de IA, limites de comparativas, financiacion y correcciones. Se enlaza desde todos los pies de pagina y desde la firma de los articulos.
- Se muestran las fechas de modificacion registradas y se retira el bloque generico de Amazon de las cuatro guias de organizacion: su tarea no requiere comprar equipo.
- Cuatro guias reescritas en sus mismas URLs: plan familiar, revision del kit, documentacion y preparacion de menores. Incorporan ejercicios especificos y fuentes; conservan sus portadas y no crean duplicados.
- Sitemap actualizado con la pagina editorial. Las fechas nuevas solo se aplican a las cuatro guias modificadas.

## Trabajo editorial pendiente

Verificacion local: compilacion de produccion correcta, 80 pruebas correctas, ads.txt 200 y text/plain, seis paginas sin desbordamiento a 360/414/768/1440 px. Las 201 URLs del sitemap responden correctamente y son alcanzables desde la portada. Informes: `adsense-readiness-check.json` e `indexing-audit.json`.

El archivo `editorial-quality-audit.json`, generado por `node scripts/audit-editorial-quality.cjs`, identifica 23 guias breves restantes y 42 articulos sin fuentes explicitas en sus datos. Son senales de revision, no una prueba automatica de infraccion. Las herramientas interactivas no se califican solo por su cantidad de texto.

Antes de solicitar otra revision, revisar individualmente esos contenidos: resolver tareas especificas, comprobar hechos sensibles, contrastar fuentes, fusionar temas realmente duplicados cuando proceda y evitar repetir introducciones o recomendaciones comerciales. No se ha eliminado contenido ni se han desindexado articulos para aparentar calidad. No se deben inventar experiencias propias, titulos profesionales, pruebas de productos o fechas.

## Publicacion y cuenta

1. Desplegar los cambios y comprobar `https://modocrisissurvival.com/ads.txt` y la variante con www. El ID debe coincidir con el de la cuenta.
2. En AdSense, Sitios, seleccionar el sitio y buscar actualizaciones de ads.txt. Ese estado puede tardar en cambiar.
3. Completar la revision editorial antes de pulsar Solicitar revision. No quitar y volver a crear el sitio repetidamente.
4. Antes de activar publicidad, configurar el mensaje de consentimiento/CMP correspondiente. El banner local no se presenta como una CMP certificada. Se conserva la verificacion de propiedad mediante metadatos sin activar anuncios.

`ads.txt` no sustituye el contenido original y util. La cuenta y la decision final de aprobacion corresponden a Google; no se ha solicitado una nueva revision en nombre de la propietaria.

## Fuentes oficiales

- [Contenido y experiencia de usuario](https://support.google.com/adsense/answer/10015918?hl=es)
- [Sitio no listo para mostrar anuncios](https://support.google.com/adsense/answer/12176698?hl=es)
- [Crear y comprobar ads.txt](https://support.google.com/adsense/answer/12171612?hl=es)
- [Consentimiento y CMP](https://support.google.com/adsense/answer/13554116?hl=es)
