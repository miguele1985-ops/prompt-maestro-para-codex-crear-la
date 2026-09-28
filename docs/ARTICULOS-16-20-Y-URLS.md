# Articulos 16-20 y migracion de direcciones

Fecha: 2026-09-28.

- Tres articulos nuevos: psicologia-emergencia-errores-mentales, que-hacer-si-te-pierdes-24-horas y sin-mochila-sin-equipo.
- Dos ampliaciones sin duplicados: objetos-de-casa-que-pueden-ayudarte-en-una-emergencia (20 objetos) y 5-mitos-de-supervivencia-que-pueden-ponerte-en-peligro (ahora 15 mitos).
- Los dos slugs alternativos propuestos por el autor redirigen a las ampliaciones.
- Todos los 98 articulos pasan de /blog/<slug> a /supervivencia/<slug>. El indice pasa a /supervivencia.
- Redirecciones permanentes 308 desde el indice, cada articulo y los alias anteriores; se conservan los parametros de consulta.
- Canonical, Open Graph, datos estructurados, sitemap, navegacion y enlaces internos usan el destino nuevo. Las imagenes conservan /images/blog/ para evitar romper recursos existentes.
- No se ha borrado contenido del catalogo. Las paginas de herramientas, temas y guias conservan sus propias direcciones.

## Validacion local

- Next build: correcto, 169 paginas estaticas generadas.
- Vitest: 63 pruebas correctas en 21 archivos.
- Comprobacion HTTP de 98 redirecciones permanentes, con parametros.
- Quince comprobaciones de los cinco articulos a 360, 414 y 768 px: respuesta 200, canonical, imagen, boton de descarga y ausencia de desbordamiento horizontal.
- Recorrido del sitemap: 181 paginas y 22 destinos adicionales sin errores.
- ESLint de los archivos principales de esta entrega: correcto.

Ejecutar scripts/check-article-migration.cjs con la URL de un servidor de produccion local para repetir la comprobacion. No enviar solicitudes de prueba a administracion ni modificar datos de produccion.

## Publicacion pendiente

Estas pruebas corresponden al proyecto local, no acreditan un despliegue nuevo en Cloudflare. Tras desplegar, comprobar /blog y una ruta antigua con redireccion desactivada, y confirmar los nuevos destinos y sitemap. Mantener las redirecciones a largo plazo.

La migracion organiza las direcciones; eliminar la palabra blog no garantiza una mejora de posiciones. Referencia: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
