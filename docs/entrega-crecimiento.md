# Entrega de crecimiento editorial

Fecha: 14 de octubre de 2026. Rama: `codex/crecimiento-editorial-supervivencia`.

## Alcance real

Esta entrega no completa la reescritura de todo el catálogo. Se han revisado 24 artículos y creado 15 guías. Quedan 48 piezas pendientes de edición profunda, identificadas individualmente en `inventario-editorial-actual.md`. No se han cambiado sus fechas para fingir una revisión ni borrado sus URLs.

El inventario inicial tiene 86 artículos: 14 para conservar, 48 para mejorar y 24 para reescribir. La clasificación por longitud es una señal de priorización, no una certificación de calidad. Las calculadoras no necesitan 1.200 palabras de relleno para cumplir su función. No hay exportación de consultas, visitas o conversiones de Search Console disponible.

## Artículos existentes trabajados

Las siguientes URLs conservan su dirección. Las piezas trabajadas tienen entre 1.200 y 2.000 palabras de contenido visible, incluidos pasos, tablas y FAQ; se excluyen navegación, avisos comunes y pie de página.

| Grupo | Artículos |
|---|---|
| Familia | Plan familiar, revisar el kit, documentación, preparar a niños sin alarmismo, preparación doméstica para principiantes |
| Cartografía y energía | MBTiles, GPS sin Internet, cargas reales de una batería de 10000 mAh |
| Reservas y respaldo | Peso de la reserva familiar, apagón general, mochila de 72 horas con peso realista, tratar agua sin electricidad, lluvia/autoconsumo/generadores |
| Elegir equipo | Mochilas de emergencia, radios, powerbanks solares, depósitos de agua y las dos guías de filtros (selección por riesgo y diferencias tecnológicas) |
| Campo y decisiones | Perderse durante una salida, trampas mentales, sin mochila, nudos y mitos del cine |

GPS, batería y peso familiar sustituyen el cuerpo anterior completo. Otras guías conservan su núcleo útil y añaden casos, fichas y preguntas específicas. El renderizado distingue HTML importado, revisiones estructuradas y ampliaciones: no sustituye accidentalmente un artículo largo por su resumen. Tiempo de lectura y `wordCount` reflejan el cuerpo publicado.

## Quince guías nuevas

1. Senderismo para principiantes: preparar una ruta.
2. Hora de retorno en montaña.
3. Ropa por capas para frío, viento y lluvia.
4. Mochila de senderismo de un día.
5. Orientación básica con mapa y brújula.
6. Comida para senderismo sin cocinar.
7. Revisión mensual de preparación familiar.
8. Preparación familiar para terremotos.
9. Tormenta eléctrica en montaña.
10. Fuego responsable en bushcraft.
11. Hornillo y monóxido de carbono.
12. Vivac de emergencia y manta térmica.
13. Higiene durante un corte de agua.
14. Uso responsable del cuchillo de bushcraft.
15. Prevención de ampollas y cuándo consultar.

Son guías educativas con advertencias, fuentes primarias y ejercicios preventivos. No se presentan como experiencia personal de campo, ensayos de productos o contenido revisado por profesionales sanitarios. El marcado FAQ corresponde a preguntas visibles; no promete resultados enriquecidos de Google.

## Experiencia y medios

- Portada orientada a supervivencia y senderismo, con imagen de campo, un CTA principal y acceso inmediato a las cuatro rutas de contenido.
- `/empieza-aqui`: dos recorridos de siete pasos, para casa y sendero, con progreso local activado por el lector.
- `/mi-biblioteca`: guardar y retirar lecturas; hasta 100 referencias locales. Noindex, fuera del sitemap y sin cuentas o sincronización.
- `/cuaderno-de-campo`: tres fichas imprimibles y descarga PDF real. No se exige correo.
- Guardado y compartir en los artículos; tablas accesibles, párrafos legibles, FAQ desplegables, fuentes y lecturas relacionadas.
- Diagramas originales distintos para los 101 artículos, SVG fuente, licencia CC BY 4.0 y seis tamaños WebP. No son fotografías de productos ni sirven para identificar especies. Los recursos visuales previos se conservan en el proyecto.
- Buscador, filtros, categorías, mapa del sitio y 13 calculadoras existentes reutilizados, sin dependencias nuevas.
- Política web actualizada para explicar almacenamiento voluntario de biblioteca y progreso; no se modifica la política Android proporcionada por el titular.

## Verificación y límites

La compilación Next.js y ESLint funcionan; pasan 105 pruebas en 30 archivos. Se comprobó cada índice de artículo y su metadescripción (máximo 155 caracteres). El rastreo local valida 208 URLs de sitemap, canonical, un H1 y acceso desde la portada. No certifica que Google vaya a indexarlas.

Playwright comprueba 360, 414, 768 y 1440 píxeles: 28 combinaciones de página y tamaño, carga de imágenes, ausencia de desbordamiento, progreso y guardado tras navegación. También se verifican dos primeras visitas móviles con el banner abierto: el área de contenido no se solapa y el enlace de la app queda accesible. Los resultados y capturas están en `growth-experience-check.json`. Las medidas de LCP y CLS son de laboratorio local, no Core Web Vitals de usuarios reales. El rastreo de 319 destinos internos, incluida la descarga PDF, no encuentra enlaces rotos.

El PDF tiene tres páginas A4: se validó su estructura y se renderizó para inspeccionar las tres páginas. La descarga pública y el archivo entregable contienen los mismos bytes. Para regenerarlo, sirve una compilación actual y ejecuta `node scripts/build-workbook-pdf.cjs http://127.0.0.1:3025`; vuelve a comprobar páginas y diseño.

`growth-sources-check.json` conserva el estado de solicitudes a las nuevas referencias. Un fallo de red automatizado no implica necesariamente 404; disponibilidad HTTP tampoco verifica por sí sola todas las afirmaciones. Los dos enlaces que devolvían 404 se corrigieron. Continúa contrastando fuentes y normativa al editar los pendientes.

No se ha validado el adaptador final de Cloudflare en este entorno Windows ni el resultado de un despliegue nuevo. La publicación debe comprobarse en Cloudflare antes de darla por terminada. No hay promesa de tráfico ni aprobación AdSense.

## Pendiente

- Editar las 48 piezas restantes, empezando por cuidados, alimentos, avisos, comunicación y rutas; después naturaleza y comparativas. Evitar repetición de texto y canibalización de intención.
- Revisar vigencia de especificaciones, precios históricos y disponibilidad antes de presentar cualquier oferta como actual.
- Verificar necesidades jurídicas del responsable con sus datos reales; no inventar NIF, domicilio ni credenciales.
- Una newsletter requeriría proveedor, consentimiento específico, envío y baja. No se ha añadido un formulario que finja funcionar.
- Medir tráfico real y rendimiento después de publicar; no deducir visitas del número de páginas indexadas.

## Acciones del titular

1. Revisar los commits de la rama, autenticarse en GitHub si hace falta y publicar la rama. Integrarla en la rama de producción mediante el flujo habitual después de revisión.
2. Comprobar el despliegue Cloudflare, sus logs, sitemap y páginas prioritarias con el dominio real.
3. En Search Console, enviar el sitemap correcto y solicitar rastreo de unas pocas guías prioritarias. No repetir solicitudes en masa.
4. Exportar rendimiento por consulta y página para elegir mejoras a partir de impresiones, CTR y clics reales.
5. Configurar analítica y anuncios con el consentimiento y los requisitos aplicables. No incentivar clics, comprar enlaces ni ocultar publicidad.
6. Aplicar el calendario y los canales de `../plan-de-crecimiento.md`; registrar aprendizaje y corregir contenido, no publicar solo para cumplir cuotas.
