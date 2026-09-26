# Revisión de los 30 artículos entregados

Fecha: 26 de septiembre de 2026.

## Alcance aplicado

- Los 30 artículos de los seis lotes HTML reciben una introducción nueva, tres claves específicas y una tarea final concreta. No se sustituyen las tablas, las advertencias ni las fuentes por un resumen genérico.
- Las revisiones se mantienen en `src/content/article-upgrades.json` y se aplican desde el importador después de combinar los originales. Reimportar no elimina la revisión ni duplica los bloques.
- Se eliminan los rótulos internos de número de artículo. Se recalculan los índices, las palabras y los tiempos de lectura.
- Cada artículo incorpora un enlace de continuación elegido por tema. Los extractos públicos y descripciones utilizan las claves de la revisión; la fecha de modificación refleja esta edición, no una revisión técnica exhaustiva de todos los datos.
- Once imágenes nuevas con estética fotográfica cotidiana sustituyen las portadas mediante grupos temáticos. Son imágenes compartidas cuando el tema coincide, no treinta fotografías únicas ni fotografías documentales reales.
- La portada destaca una lectura principal, dos complementarias y tres recorridos con nueve lecturas seleccionadas. Conserva la aplicación y los enlaces de afiliación identificados.

## Imágenes generadas

Origen: `C:/Users/Valeria/.codex/generated_images/01a035c4-c371-7aa1-ba2b-b2bfc2041af3/`.

| Archivo de origen | Activo local | Escena |
| --- | --- | --- |
| exec-95492844-865c-4835-a22a-0e2c1d02fe06.png | familia-preparada-natural | Preparación familiar en casa |
| exec-9c683d94-7cc7-4fcb-93dd-0292ba9f4a89.png | reserva-agua-natural | Revisión de recipientes de agua |
| exec-86dd76a7-5591-4617-bcab-cc7ce88e1bd7.png | energia-comunicacion-natural | Teléfono, batería, radio y frontal |
| exec-330a9094-e034-46a1-b7e4-fa10439117fe.png | aprendizaje-campo-natural | Observación del entorno en sendero |
| exec-5a0fb1ac-a42a-43c1-890d-da561d41602c.png | equipo-coche-natural | Material en un vehículo estacionado |
| exec-5e319774-82fa-4375-b2e2-4a6a87e8f055.png | hogar-calor-natural | Preparación doméstica frente al calor |
| exec-d8702249-c3b5-41a6-bfa0-72880f88f471.png | botiquin-natural | Revisión de material sin tratar lesiones |
| exec-4d188074-f2aa-45ae-aba9-e3521e2ebed9.png | mascota-plan-natural | Transportín y suministros |
| exec-a2d183ad-a12b-43ac-88f2-0d3f5158bba5.png | mochila-natural | Revisión de una mochila |
| exec-72b7a886-3c96-490b-94b5-21f308138ee5.png | filtro-natural | Filtro genérico, no modelo ensayado |
| exec-afa6f55d-07bf-4dc6-8cbb-c3c50afacf49.png | practica-cuerda-natural | Práctica sin cargas |

Los archivos están en `public/images/blog`, con JPEG de respaldo y WebP a 240, 360, 576, 960, 1200 y 1600 píxeles. La escena de lluvia de la revisión anterior se conserva para el artículo de DANA. Las imágenes no representan modelos ensayados, sucesos históricos ni referencias para identificar especies.

## Verificación local

- Compilación Next completada y ESLint sin errores.
- 28 pruebas aprobadas, incluidas cobertura de los 30 textos, imágenes responsive y enlaces de continuación.
- Playwright revisó los 30 artículos a 390 píxeles: tres claves y tarea final presentes, sin imágenes rotas, desbordamiento horizontal ni errores de página.
- Rastreo de 110 rutas sin errores detectados.
- Portada revisada a 1440 y 390 píxeles. Vista previa autocontenida: `public/inicio-editorial-revisado.html`.
- Sin commit ni despliegue en esta revisión. Las comprobaciones son locales, no mediciones en producción.

## Fuentes consultadas

Se han consultado fuentes primarias sobre datos sensibles presentes en los originales:

- AEMET: https://www.aemet.es/es/noticias/2026/09/olas_de_calor_2026
- DGT: https://www.dgt.es/muevete-con-seguridad/tecnologia-e-innovacion-en-carretera/Dispositivos-de-presenalizacion-V16/
- CDC, agua: https://www.cdc.gov/water-emergency/about/index.html
- CDC, apagones: https://www.cdc.gov/natural-disasters/response/what-to-do-protect-yourself-during-a-power-outage.html

La edición mejora claridad, navegación y presentación; no acredita una revisión médica/jurídica completa ni resultados medidos en SEO o retención. No se ha activado publicidad ni enviado información de lectores a terceros.
