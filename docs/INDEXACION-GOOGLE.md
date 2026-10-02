# Descubrimiento e indexacion en Google

## Cambios implementados

- Paginacion con direcciones propias y enlaces HTML reales, accesibles sin JavaScript. Antes, los botones cambiaban el listado solo en el navegador.
- 18 paginas adicionales de catalogo con canonical propio y contenido renderizado en servidor.
- `/mapa-web`: indice por temas que enlaza directamente los 98 articulos, las guias y las herramientas. Accesible desde el pie de todas las paginas.
- Sitemap ampliado a 200 direcciones unicas; incluye las portadas de los articulos. Mantiene las fechas reales, sin simular actualizaciones.
- Las rutas privadas y la busqueda siguen fuera del sitemap.

## Verificacion local

- Compilacion de produccion de Next.js correcta.
- 73 pruebas automaticas correctas.
- Las 200 direcciones del sitemap responden 200, tienen canonical propio y un H1, y no estan bloqueadas por noindex.
- Las 200 direcciones se pueden alcanzar siguiendo enlaces desde la portada; ninguna queda aislada.
- Paginacion, filtros y mapa comprobados en 360, 414, 768 y 1440 px.
- Resultado detallado: `indexing-audit.json`. Para repetirlo, iniciar la compilacion de produccion en el puerto 3021 y ejecutar `node scripts/check-indexing.cjs`.

## Despues del despliegue

1. Comprobar `https://www.modocrisissurvival.com/mapa-web` y `https://www.modocrisissurvival.com/catalogo/articulos/2`.
2. En Search Console, enviar `https://www.modocrisissurvival.com/sitemap.xml` en la propiedad del dominio correcto.
3. Inspeccionar el mapa y unos pocos articulos importantes, comprobar la URL publicada y solicitar su indexacion.
4. Revisar el informe de indexacion: distinguir entre paginas descubiertas sin indexar, rastreadas sin indexar, duplicadas y bloqueadas. La accion depende del motivo concreto.

Search Console no estaba conectado a esta tarea. No se han enviado solicitudes desde la cuenta de la propietaria. Un sitemap y los enlaces facilitan el descubrimiento, pero Google decide que paginas indexa y cuando; no hay una garantia ni un plazo fijo.

## Referencias oficiales

- [Paginacion rastreable](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading?hl=es)
- [Crear y enviar un sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=es)
- [Solicitar un nuevo rastreo](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=es)
- [Informe de indexacion](https://support.google.com/webmasters/answer/7440203?hl=es)
