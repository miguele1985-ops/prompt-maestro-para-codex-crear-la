# Paso 2: revisión de artículos existentes

Revisión editorial del 14 de octubre de 2026. Rama `codex/crecimiento-editorial-supervivencia`; respaldo previo `backup/antes-paso-2-2026-10-14`.

## Alcance real

24 artículos adicionales revisados en tres bloques de ocho. El total acumulado es 48 artículos existentes trabajados y 15 nuevos. Permanecen 24 pendientes: 12 para mejorar y 12 para reescribir. El Paso 2 completo todavía no ha terminado. El inventario actual detalla cada pendiente; el inventario inicial se conserva.

Las revisiones conservan URLs y contenido útil previo. Añaden casos expresamente ficticios, comprobaciones domésticas sin exposición al peligro, tablas, límites y tres FAQ específicas. No son pruebas de campo, asesoramiento individual ni certificación profesional. Contar palabras no certifica la calidad ni garantiza tráfico.

## Artículos del Paso 2

Palabras del cuerpo visible, pasos, tablas y FAQ. No incluyen navegación o pie común. Metadescripciones de 136 a 152 caracteres.

| Artículo (slug conservado) | Palabras |
|---|---:|
| medicamentos-tratamientos-emergencias | 1299 |
| kit-emergencia-personas-mayores | 1234 |
| gestion-alimentos-sin-electricidad | 1226 |
| confinamiento-emergencia-casa-que-hacer | 1232 |
| refugio-temporal-casa-frio-calor | 1222 |
| como-guardar-agua-emergencias | 1224 |
| como-prepararse-para-un-apagon | 1243 |
| simulacro-familiar-emergencia-30-minutos | 1213 |
| ciberataque-masivo-servicios-esenciales | 1239 |
| crisis-cadena-suministro-supermercados-vacios | 1253 |
| desinformacion-emergencias-deepfakes-alertas-falsas | 1231 |
| primeras-24-horas-gran-emergencia | 1228 |
| tarjetas-cajeros-pagos-no-funcionan | 1255 |
| 7-dias-sin-internet | 1231 |
| tormenta-solar-extrema-como-prepararse | 1221 |
| emergencia-trabajo-volver-casa | 1275 |
| es-alert-por-que-a-veces-no-llega-a-tu-movil | 1359 |
| evacuacion-de-vivienda-checklist-paso-a-paso | 1288 |
| preppers-espanoles-que-aprendieron-del-gran-apagon | 1326 |
| estaban-preparados-los-hogares-espanoles-para-el-apagon | 1348 |
| espana-2030-calor-sequia-inundaciones | 1393 |
| como-hacer-mas-segura-el-agua-sin-filtro-ni-pastillas | 1384 |
| setas-comestibles-vs-toxicas-identificacion-sin-falsas-reglas | 1368 |
| objetos-de-casa-que-pueden-ayudarte-en-una-emergencia | 1352 |

## Correcciones transversales

- FAQ visibles con H3 y marcado JSON-LD correspondiente; prueba de igualdad de preguntas y respuestas.
- Canonical absoluto conservado y pruebas de enlaces entre artículos existentes.
- Dos títulos reformulados para evitar predicciones: suministro y primeras 24 horas. Sus diagramas y textos alternativos se regeneran, sin borrar los recursos anteriores.
- Enlace de equipo que apuntaba a un ancla ausente sustituido por revisión de material; eliminada una referencia que acababa enlazando al propio artículo.
- Corregida la conversión de 5.000 pies: aproximadamente 1.524 metros, no 1.000. Se mantienen las diferencias de umbral entre guías internacionales y la prioridad de instrucciones sanitarias locales.
- Eliminadas frases de instrucciones al editor que aparecían en tres cuerpos importados.
- Se distinguen objetos disponibles y funciones comprobadas, muestras voluntarias y población nacional, hipótesis y hechos confirmados.

## Fuentes y límites

Se consultan fuentes primarias, sin inventar recetas de desinfección, dosis, identificación comestible, rutas seguras ni causas de incidentes.

Referencias contrastadas para el último bloque: [Protección Civil: ES-Alert](https://www.proteccioncivil.es/coordinacion/redes/ran/public-warning-system), [Comunidad de Madrid: setas silvestres](https://www.comunidad.madrid/salud/setas-silvestres), [CDC: agua en emergencias](https://www.cdc.gov/water-emergency/es/about/how-to-make-water-safe.html) y [EEA: evaluación europea de riesgos climáticos](https://climate-adapt.eea.europa.eu/en/eu-adaptation-policy/key-eu-actions/european-climate-risk-assessment).

Las referencias originales del CIS y RTVE permanecen identificadas. Las páginas del CIS rechazaron solicitudes automatizadas con 403 en una comprobación previa: no se presenta eso como 404 ni como verificación completa de sus tablas. No se han añadido porcentajes nuevos. Debe contrastarse el documento estadístico antes de modificar cifras históricas.

## Comprobación y publicación

`tests/growth.test.tsx` comprueba longitud de las 48 revisiones, metadescripciones, anclas de los 101 artículos y correspondencia de las FAQ del Paso 2. La prueba que renderiza todo el catálogo dispone de 15 segundos, porque procesa 101 páginas y superó los cinco segundos anteriores; no se eliminan sus comprobaciones.

La compilación Next.js y ESLint terminan correctamente; pasan 106 pruebas en 30 archivos. `scripts/check-step-two.cjs` verifica las 24 páginas a 360, 414 y 768 píxeles: 72 combinaciones, imágenes visibles, anclas, un H1 y apertura de FAQ. Guarda resultados locales en `step-two-responsive-check.json`. Se inspeccionan capturas de portada, tabla y FAQ. El scroll se comprueba sobre `.site-page`, que es el contenedor real del sitio.

El rastreo local actualizado de `http://127.0.0.1:3026` valida 208 URLs del sitemap y 319 destinos internos sin enlaces rotos. El informe de indexación no encuentra URLs inaccesibles. Esto no equivale a rastreo o indexación por Google.

No se ha publicado esta rama ni se ha verificado un despliegue nuevo de Cloudflare. La vista local no equivale a producción. La aceptación de AdSense y la indexación las decide Google: estos cambios no pueden garantizarlas.
