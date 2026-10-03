# Portadas sin repeticiones

Revisión final: 2 de octubre de 2026.

- 98 artículos revisados, con una imagen diferente por artículo.
- 46 asignaciones de portada sustituidas mediante `src/content/article-covers.json`.
- 10 imágenes nuevas generadas con la herramienta integrada de imágenes.
- 4 imágenes incorporadas de la colección aportada por la usuaria.
- Una fotografía de eclipse de NASA incorporada con crédito y fecha de archivo.
- Las demás sustituciones recuperan imágenes propias del proyecto correspondientes a su contenido.
- Las guías prácticas y las tarjetas de nudos, plantas y señales tienen imágenes específicas y no reutilizan las portadas de artículos.

Los archivos finales se encuentran en `public/images/blog/`, junto con sus versiones WebP de 240, 360, 576, 960 y 1200 píxeles. La selección se aplica después de las antiguas reglas por tema para que estas no vuelvan a sobrescribirla.

## Imágenes generadas

Modo utilizado: herramienta integrada `image_gen`, sin API ni CLI externo. Los nombres finales llevan el prefijo `cover-`.

Brief común: fotografía editorial realista horizontal 3:2, texturas naturales, proporciones creíbles, sujeto claro y composición propia para cada tema; sin tipografía añadida, marcas de agua ni collages.

Resumen de los encargos visuales usados en la generación:

| Archivo | Encargo visual |
| --- | --- |
| cover-psicologia.jpg | Mujer revisando con calma una checklist y un plano en una mesa doméstica, teléfono boca abajo, luz natural. |
| cover-ciberataque.jpg | Ordenador en un escritorio con cable de red desconectado, llave de seguridad y libreta. |
| cover-pagos.jpg | Caja de un comercio con terminal de pago, monedas y cesta de compra. |
| cover-confinamiento.jpg | Persona cerrando una ventana, con una radio a mano dentro de la vivienda. |
| cover-apagon-historico.jpg | Ciudad española al anochecer sin iluminación urbana; escena ilustrativa, no documento de un apagón real. |
| cover-hogares-preparados.jpg | Armario abierto con suministros domésticos organizados. |
| cover-mitos-cine.jpg | Equipo de senderismo, brújula y botella frente a una aventura desenfocada en televisión. |
| cover-tormenta-solar.jpg | Antena y tendido eléctrico bajo una aurora tenue al anochecer. |
| cover-generador-compra.jpg | Inspección de un generador apagado en una exposición. |
| cover-generador-normativa.jpg | Generador desconectado en exterior, casa distante y detector de monóxido de carbono en primer plano. |

Prompt completo conservado para psicología:

> Create a photorealistic editorial landscape 3:2 photograph for a Spanish emergency-preparedness article about psychological decision-making under stress. A woman seated calmly at a modest apartment dining table comparing a short handwritten checklist with a simple floor plan, phone face down, natural daylight, unposed documentary realism, rich natural textures, clean clear composition. No tactical equipment, no panic, no disaster, no brands, no readable text, no overlays. This is a unique article cover, not a collage.

## Foto de eclipse

Archivo: `public/images/blog/cover-eclipse-nasa.jpg`.

Autor: NASA/Aubrey Gemignani. Eclipse de 21 de agosto de 2017, Oregón; no muestra el eclipse de 2026. La fecha y el crédito figuran en el artículo.

[Fuente y ficha de dominio público](https://commons.wikimedia.org/wiki/File:2017_Total_Solar_Eclipse_(NHQ201708210100)_-_square_crop.jpg).

## Comprobaciones

- Pruebas de unicidad de rutas, contenido de archivos y píxeles normalizados: correctas.
- Catálogo de artículos y guías: sin rutas de imagen repetidas.
- Versiones responsive de las 46 sustituciones: respuesta HTTP 200.
- Portada en navegador a 360, 414, 768 y 1440 píxeles: carga y anchura correctas.
- Capturas de comprobación: `docs/unique-covers-360.png`, `docs/unique-covers-414.png`, `docs/unique-covers-768.png` y `docs/unique-covers-1440.png`.

Esta revisión no publica un despliegue en Cloudflare.
