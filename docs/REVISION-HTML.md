# Revisión de HTML y remodelación

Fecha de trabajo: 26 de septiembre de 2026.

## Documentos contrastados

El inventario `migration-inventory.json` identifica diez HTML únicos por SHA-256. Las copias repetidas no se consideran encargos distintos.

| Documento | Aplicación en el proyecto |
| --- | --- |
| Contenidos Modo Crisis Survival | Recuperación de nueve piezas, reutilizando slugs existentes. Dos piezas que faltaban tienen URL nueva. La pieza de plantas se integra con el lote posterior. Los diez titulares propuestos no se publican como artículos vacíos. |
| Reestructuración | Portada editorial, página propia de app, biblioteca de guías, buscador, comparativas y conservación de rutas. |
| Reestructuración revisada | Separación entre contenidos web y funciones nativas; afiliación identificada, sin precios ni valoraciones inventados. |
| Especificación maestra | SEO, inventario por ID, herramientas funcionales, exclusiones comerciales, comprobaciones y pendientes explícitos. El corpus repetido se importa una sola vez. |
| Artículos 01–05, 06–10, 11–15, 16–20, 21–25 y 26–30 | Treinta artículos completos, con tablas, preguntas y enlaces a fuentes. No se publican las notas internas dirigidas a Codex. |

## Cambios aplicados

- 38 URL reciben el cuerpo completo de los HTML; dos son nuevas. El resto conserva el texto existente, con la nueva presentación común.
- Artículos con jerarquía de títulos, índice de navegación, lectura de ancho limitado, tablas desplazables, autoría de la redacción, fecha cuando existe, tiempo de lectura calculado y contenidos relacionados.
- Biblioteca con búsqueda por texto y filtros temáticos. Los enlaces de todos los artículos están presentes en HTML inicial.
- Guías organizadas por necesidad en la URL existente `/guias-supervivencia`.
- Seis calculadoras web en sus URL existentes: agua, energía, lluvia (con inversos), velocidad, sensación térmica y horas de luz (manual/solar).
- Checklist local imprimible y descargable, sin capturar correos ni datos personales.
- Canonical del dominio definitivo, Article y BreadcrumbList coherentes con el contenido, URL externa del APK corregida en JSON-LD, sin precio placeholder ni SearchAction inexistente.
- Sitemap sin fechas inventadas en cada compilación. Solo se declaran fechas conocidas.
- Afiliación centralizada en `src/content/affiliate.ts`. Política conservadora en `src/lib/monetization.ts`: ninguna publicidad activada; no afiliación en calculadoras, protocolos críticos, intoxicaciones, descargas, app, donaciones ni checklist.
- Tres fotografías editoriales nuevas generadas con IA para hogares, mochilas y lluvia; nueve artículos utilizan las nuevas portadas. Se conservan los originales y sus URL.

## Material de la app localizado

Se ha leído exclusivamente el directorio de datos de `SV/mobile`. No se ha modificado ni compilado la app.

El inventario identifica **322 artículos, 16 escenarios y 90 fichas de plantas**. Cada registro tiene ID, título, destino previsto y estado de revisión. Encontrar esos archivos no equivale a tener 428 páginas web publicables y contrastadas.

Quedan pendientes la revisión y migración individual de ese corpus. Hay datos sanitarios sin fuente por ficha, instrucciones de preparación/consumo de plantas y material gráfico cuya licencia no está documentada en esos registros. No se han creado páginas vacías ni publicado automáticamente esas afirmaciones. Las rutas previstas del inventario NO entran todavía en el sitemap.

## Funciones pendientes

| Elemento | Motivo y siguiente paso |
| --- | --- |
| 322 guías, 16 protocolos y 90 plantas de la app | Contrastar afirmaciones e imágenes por pieza; incorporar fuentes y mapear equivalentes antes de publicar. Las páginas existentes siguen disponibles. |
| Fichas individuales de fauna, nudos y aprendizaje | Revisión editorial del material localizado y asignación de fuentes/medios. No se anuncian como migradas. |
| Dosificación química, cruce de ríos e hipotermia | Conservan documentación; no se implementa un dosificador genérico, autorización de cruce ni diagnóstico automático. |
| Inventario/plan familiar persistentes y quizzes | Se mantiene la app y sus páginas informativas; la checklist web es una primera utilidad, no una réplica de esos módulos. |
| AdSense y medición de ingresos | No hay cuenta/slots/CMP configurados. La política excluye las rutas sensibles y la publicidad permanece desactivada. No se afirman ingresos ni mejoras de posicionamiento medidas. |
| Captación de email | No hay proveedor ni credenciales: descarga directa sin formulario ficticio ni almacenamiento de emails. |
| Search Console | Actualizar la propiedad real y enviar el sitemap tras desplegar. No se ha accedido a la cuenta. |
| GitHub / Cloudflare | Cambios locales; no se ha hecho push ni deploy en esta revisión. |

## Resultado de las comprobaciones locales

- Compilación Next completada: 96 páginas generadas estáticamente, además de rutas dinámicas.
- 27 pruebas aprobadas en seis archivos, incluida la prioridad de enlaces relacionados sin modificar el orden de la biblioteca.
- Rastreo de 110 rutas: sin errores de respuesta, canonical, H1 o imágenes locales en las comprobaciones automatizadas.
- Portada y artículo comprobados con Playwright a 1440 y 390 píxeles: sin imágenes rotas ni desbordamiento horizontal.
- Vista previa autocontenida actualizada: `public/inicio-editorial-revisado.html`. Sus enlaces llevan al dominio público, que puede mostrar todavía la versión anterior.
- Estas comprobaciones son locales; no confirman despliegue en Cloudflare ni resultados de posicionamiento.

## Comandos de reproducción

- `node scripts/import-editorial-articles.cjs`: importa y limpia el corpus, conserva fuentes y genera el índice. Necesita los adjuntos originales.
- `node scripts/audit-migration.cjs`: inventario de documentos y datos de la app; admite ruta de origen como argumento.
- `node scripts/preview-editorial.cjs`: exporta una portada HTML autocontenida desde el servidor local y comprueba imágenes y desbordamientos.
- `node scripts/check-editorial-site.cjs`: comprobación de rutas, canonical, títulos, imágenes y enlaces locales.
- `node node_modules/vitest/vitest.mjs run`: incluye casos numéricos, dominios de fórmulas, saneamiento y exclusiones de monetización.

## Fuentes técnicas

- Wind Chill: https://www.weather.gov/epz/wxcalc_windchill y https://www.weather.gov/media/epz/wxcalc/windChill.pdf
- Heat Index: https://www.weather.gov/media/epz/wxcalc/heatIndex.pdf
- SunCalc 1.9.0: https://github.com/mourner/suncalc/tree/v1.9.0 (código y licencia conservados en `src/lib/vendor`).
- Google Search: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

Los ajustes matemáticos de ruta son supuestos orientativos visibles, no una certificación de seguridad. Los artículos conservan sus propias fuentes; importar un texto no acredita una nueva revisión especializada de todas sus afirmaciones.
