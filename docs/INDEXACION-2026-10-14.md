# Rastreo e indexacion: revision del 14 de octubre de 2026

## Que muestra Search Console

La captura muestra 38 URLs indexadas y 178 sin indexar, distribuidas en cuatro motivos. El texto aportado identifica 167 como Descubierta: actualmente sin indexar. El informe tiene fecha del 9 de octubre, no representa una prueba en directo del dia 14.

Descubierta significa que Google conoce la URL pero aun no la ha rastreado; por eso Ultimo rastreo aparece N/D. No equivale a una sancion, a un bloqueo confirmado ni al rechazo de AdSense. Tampoco es necesario que todas las URLs de archivo, variantes o paginas retiradas aparezcan en los resultados.

## Comprobacion de la web publicada

Informe reproducible: `published-indexing-audit.json`. Se comprobaron las 185 URLs actuales del sitemap y los diez ejemplos de Search Console, mediante HTTP y HTML publico. No es una prueba de Inspeccion de URLs ni se ha suplantado un Googlebot verificado.

- Sitemap: 185 URLs unicas, dominio correcto.
- Robots.txt: responde 200 y permite las rutas publicas; restringe administracion y pago de licencia.
- 183 de las 185 URLs del sitemap responden 200, con canonical correcto, un H1 y sin noindex. Todas son alcanzables por enlaces HTML desde la portada.
- La presentacion principal de la app devuelve 500. Su respuesta de error contiene noindex: no es una directiva editorial deliberada, sino el documento de error generado por Next.js. La funcion entrega datos RSC, pero el renderizado publicado falla. La misma version funciona en Next.js local; no disponemos del registro privado del worker para identificar la excepcion exacta de Cloudflare.
- Sobre nosotros devuelve 404 pese a estar enlazada y en el sitemap. La ruta dinamica utilizaba la lista antigua de paginas guardada como sustituto total de las paginas del codigo.
- Calendario lunar, herramientas de la app, aviso legal y las paginas de catalogo actuales comprobadas responden 200 con canonical propio y sin noindex.
- `/catalogo/guias/5` devuelve 404 y ya no forma parte del sitemap actual: el catalogo se redujo al consolidar introducciones duplicadas. No debe inventarse una quinta pagina vacia ni duplicarse la cuarta solo para mejorar el contador de indexacion.

No hay evidencia de un bloqueo general de las 167 URLs. Los dos fallos encontrados son reales, pero no prueban por si solos por que Google ha aplazado el rastreo de las demas. No se han revisado registros historicos del servidor ni los otros tres motivos del informe.

## Reparaciones

1. Las paginas guardadas se combinan por slug con las del codigo, en vez de sustituir todo el catalogo. Se conservan las ediciones y paginas personalizadas; las politicas actuales siguen siendo autoritativas. Sobre nosotros vuelve a disponer de su contenido predeterminado cuando falta en la lista antigua.
2. La presentacion de la app se pregenera durante la compilacion para evitar depender del renderizado dinamico del worker de Cloudflare en cada visita. La version, fecha, tamano y aviso manual se consultan desde el servicio de versiones en el navegador. Si falla esa consulta, se conserva la descarga y la version incluida al compilar. El aviso de nueva actualizacion no se deduce de la version: sigue requiriendo el interruptor del administrador.
3. El servicio de versiones publica el interruptor y los campos informativos de descarga, manteniendo los campos anteriores de la API movil. No se modifica la app Android ni sus mecanismos de licencia.

La mitigacion de la pagina de la app requiere desplegar y verificar HTTP 200 en Cloudflare; que funcione localmente no demuestra que el worker anterior este reparado. No se han quitado noindex de paginas privadas, alterado contenido para bots ni enviado solicitudes artificiales de indexacion.

Verificacion local: compilacion de produccion correcta, 94 pruebas correctas y ambas rutas responden 200 con un H1 y sin noindex. La app se comprobo a 360, 414, 768 y 1440 px, sin desbordamiento horizontal. Una API de versiones simulada permite comprobar cambios de version y encendido/apagado del aviso manual; no se modifico la configuracion real del administrador. Informe: `indexing-repairs-check.json`.

## Pasos en Search Console despues de publicar

1. Inspeccionar la portada, `/mapa-web`, `/temas`, `/aplicacion-supervivencia-offline` y dos o tres guias importantes. En cada una usar Probar URL publicada y comprobar acceso, rastreo permitido y canonical.
2. Solicitar indexacion de esas pocas URLs importantes si la prueba es correcta. No repetir la misma solicitud a diario: Google indica que no acelera el proceso.
3. Comprobar que el sitemap enviado es `https://www.modocrisissurvival.com/sitemap.xml` y que su ultima lectura corresponde a la version actual. No crear multiples copias del mismo sitemap ni cambiar fechas sin editar realmente el contenido.
4. Revisar Configuracion > Estadisticas de rastreo: disponibilidad del host, respuestas 5xx/429, tiempos y solicitudes. Si aparecen problemas, revisar los registros y reglas de seguridad de Cloudflare sin desactivar las protecciones globalmente. La prueba de URL publicada ayuda a determinar si el rastreador real tiene acceso.
5. Revisar los otros tres motivos y exportar sus URLs. Un 404 retirado, una redireccion o una URL duplicada necesitan tratamiento distinto de un servidor que falla.
6. Mantener guias utiles y enlaces editoriales pertinentes. No crear mas paginas casi iguales para subir el total ni usar la Indexing API fuera de sus contenidos admitidos.

Google puede tardar dias o semanas en rastrear y no garantiza que todas las URLs terminen indexadas. Priorizar articulos, herramientas y paginas principales utiles al lector, no llegar a un porcentaje artificial de cobertura.

## Fuentes oficiales

- [Significado de los estados del informe](https://support.google.com/webmasters/answer/7440203?hl=es)
- [Solicitar rastreo y limites de las solicitudes](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=es)
- [Resolver problemas de rastreo](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors)
- [Paginacion y canonical propio](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading?hl=es)
