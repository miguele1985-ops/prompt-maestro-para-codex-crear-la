# Legibilidad de portada y cabecera

## Cambios

- Portada de escritorio: titulo de 64 px, entradilla de 30 px y descripcion de 20 px. El texto no depende de unidades de ancho de pantalla.
- Altura minima de 580 px, descripcion de hasta 660 px y encuadre superior para conservar la cabeza del excursionista.
- Degradado oscuro concentrado sobre el texto; imagen mas visible a la derecha. No se cambia la imagen, su alt ni el contenido SEO.
- Cabecera con tipografia Arial, marca de 18 px, navegacion de 16 px y controles de al menos 44 px. Se mantienen todos los destinos.
- Menu compacto por debajo de 1440 px para no reducir la letra ni cortar enlaces. Busqueda siempre visible.
- Tarjetas con titulos de 26 px y resumen de 19 px; enlaces de rutas y herramientas de 18 px en escritorio.
- Se conserva el ancho fluido anterior y el diseno compacto de movil, sin forzar zoom ni bloquear la ampliacion del navegador.

## Verificacion

`scripts/check-home-legibility.cjs` comprueba 360, 414, 768, 1024, 1280, 1440, 1920, 2560 y 3840 px. Mide fuentes reales, desbordamiento, CTA, menu desplegable y navegacion. Tambien comprueba que ampliar el texto raiz no provoque desbordamiento horizontal a 768 px.

Capturas de comprobacion en `tmp/home-legibility/`, excluidas de Git. Resultados medidos en `docs/home-legibility-check.json`. Las pruebas de viewport no miden la configuracion del navegador del usuario: el usuario ha confirmado un zoom del 100 %.

No se modifican URLs, articulos, metadatos, canonicals, anuncios ni dependencias.
