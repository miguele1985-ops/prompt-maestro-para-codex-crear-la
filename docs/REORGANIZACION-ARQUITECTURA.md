# Auditoría y reorganización del portal

## Estado previo (27 septiembre 2026)

Next.js App Router y Cloudflare next-on-pages. Contenido en blog.ts (81 entradas),
practical-guides.ts (12 guías) y pages.ts (páginas históricas). Los artículos
importados conservan HTML editorial, metadatos y URLs. No hay acceso a Search
Console ni datos de tráfico: se preservan conservadoramente todas las rutas.

Problemas: Guías mezclaba comparativas y artículos en listas extensas; Herramientas
era un manual Android con un pequeño bloque web. Preparación práctica usaba
capturas como portada. El pie mezclaba proyecto, herramientas y app.

No se han identificado duplicados exactos que justifiquen eliminar artículos.
Existen temas relacionados y cinco alias ya redirigidos; se mantienen.

## Criterios de implementación

- Catálogo central con tipo, tema y destino original; índices reutilizables.
- Seis calculadoras verificadas en SurvivalCalculator: agua, lluvia, energía,
  velocidad, sensación térmica y luz (SunCalc local en modo automático).
- Checklists: 16 listas y acciones descargables; no sincronizan con Android.
- Potabilización, destilación, ríos, conversión, silbato, humo e hipotermia:
  explicaciones de funciones Android, no calculadoras web implementadas.
- Manual de herramientas personales se conserva en una subpágina de App.
- Recursos, funciones, aprendizaje e IA conservan URL y reciben contexto App.
- No cambios de backend, licencias, móvil, monetización ni contenido sanitario.
- Sin nuevas dependencias ni redirecciones innecesarias.

## Resultado

- Menú de seis secciones, búsqueda global y pie en Explorar/App/Proyecto/Legal.
- Guías: 13 categorías con página propia y recuentos derivados del catálogo.
- Artículos y comparativas: índices separados, búsqueda, filtros y paginación.
- Herramientas: seis calculadoras web y checklists, con iconos, sin capturas.
- Calculadoras web abren el formulario antes del texto explicativo, sin portada Android.
- Inicio conserva el hero y añade caminos claros y últimas lecturas.
- Capturas de las 12 guías prácticas trasladadas al manual Android. Sus páginas
  conservan texto, acciones y monetización, con portadas editoriales y Article.
- Manual personal: /aplicacion-supervivencia-offline/herramientas conserva cuerpo,
  destacados, secciones, imágenes, pasos, consejos, advertencias y enlaces. Lee
  los cambios de administración con el mismo método anterior.
- Manuales históricos (recursos, funciones, aprendizaje, IA, Internet, crisis)
  mantienen URL y contenido, con contexto App; secciones plegables cuando existen.
- No se eliminaron artículos por similitud temática. No se crearon redirecciones.
- 125 URLs anteriores conservadas; sitemap ampliado a 139 páginas. Buscar es
  noindex/follow y queda fuera del sitemap para no duplicar índices.

## Archivos principales

Catálogo: src/content/portal.ts. Componentes: ContentCatalog.tsx (tarjeta,
búsqueda, filtros, paginación) y PortalLibrary.tsx. Estilo: app/portal.css.
Páginas: inicio, guías y categorías, blog, comparativas, herramientas, buscar,
preparación práctica y sus fichas, App y su nuevo manual. Integración:
Header/Footer, site-config, sitemap, layout y breadcrumbs de artículos.

## Verificación y límites

Build Next y ESLint correctos; 45 pruebas en 13 archivos. Recorrido local de
139 URLs y 19 destinos adicionales sin errores. Conservación contrastada con
el inventario anterior de 125 rutas. Pruebas Playwright a 320/390/768/1440px:
36 comprobaciones sin desbordamiento ni imágenes rotas; búsqueda sin tildes,
filtros combinados, paginación, menú móvil, seis cálculos y 404 comprobados.
Informes: portal-check.json y url-migration.json; capturas móviles en docs.

No se han implementado conversores ni las siete calculadoras exclusivas de
Android; sus guías permanecen accesibles como App. No hay categorías vacías de
pesca/fuego inventadas. Sin datos de tráfico, no se afirma una mejora medida
de posicionamiento ni uso de herramientas. La validación es local: pendiente
publicación y revisión del despliegue Cloudflare. Next avisa de la configuración
ESLint sin plugin propio y de generación dinámica para Edge; no impiden el build.
