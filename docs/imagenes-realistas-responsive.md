# Portadas realistas y adaptabilidad

Fecha: 15 de octubre de 2026.

## Alcance

- 88 portadas fotograficas diferentes para los 88 articulos que no son calculadoras.
- 35 escenas nuevas generadas con la herramienta integrada de imagenes, una por archivo, incluidas las quince guias recientes.
- 53 selecciones del archivo existente, sin compartir una portada entre articulos.
- Las trece calculadoras conservan su interfaz y los recursos educativos internos no se sustituyen por fotos decorativas.
- Se mantienen los slugs, textos, encabezados, enlaces comerciales y advertencias de seguridad.

Las escenas de IA son ilustrativas: no documentan sucesos ni pruebas de productos. Las imagenes del archivo no reciben automaticamente una licencia Creative Commons. La fotografia de NASA mantiene su atribucion y contexto de 2017.

## Archivos y reproduccion

- Imagenes finales: `public/images/editorial/realistic/`.
- Seleccion y metadatos usados por la web: `src/content/realistic-cover-credits.json`.
- Prompts exactos de las 35 generaciones: `docs/generated-realistic-photos.json`.
- Procedencia, huellas SHA-256 y tamanos: `docs/realistic-photo-provenance.json`.
- Seleccion del archivo anterior: `docs/realistic-cover-plan.json`.
- Optimizacion local: `node scripts/build-realistic-covers.cjs`.

Cada portada dispone de variantes de 240, 360, 576, 960 y 1200 pixeles, ademas de su base WebP. El optimizador puede usar los originales de la herramienta cuando existen; la copia final del proyecto permite reconstruir variantes sin depender de esa carpeta externa. No genera nuevas imagenes ni requiere una clave de API.

## Adaptabilidad

- Las tarjetas mantienen proporciones estables y no deforman las fotos.
- La portada del articulo muestra la imagen completa; sus dimensiones estan acotadas.
- La destacada del inicio solicita resolucion suficiente para su ancho real.
- El indice pasa encima del texto en pantallas de hasta 900 pixeles.
- Las tablas de dos o tres columnas se ajustan al articulo. Las mas anchas conservan desplazamiento horizontal dentro de su contenedor.
- Laminas, capturas, figuras y texto tienen limites de ancho propios.

## Verificacion

- 108 pruebas unitarias y de integracion correctas, en 31 archivos.
- ESLint correcto y compilacion Next.js correcta, con 199 paginas estaticas generadas.
- 392 comprobaciones responsive: 88 articulos y otras diez paginas, a 360, 414, 768 y 1440 pixeles.
- Pruebas de carga, resolucion de portadas, ausencia de desbordamiento, tablas y cambio de disposicion del indice.
- Enlaces revisados: 208 paginas y 319 destinos internos, sin enlaces rotos.
- Revision visual de capturas de tarjetas, portadas, inicio y tablas.

Estas comprobaciones locales no son una medicion de Core Web Vitals de usuarios reales, ni garantizan trafico, indexacion o aprobacion de AdSense.

Vista previa local: `http://127.0.0.1:3027/`. La publicacion requiere integrar esta rama en master y subirla a GitHub.
