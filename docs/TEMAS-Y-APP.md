# Organización por temas y adaptación de la app

## Reutilizado, sin duplicar
- Comunicación y frecuencias: artículo existente ampliado, Morse y señales.
- Plantas y animales / plantas de España: biblioteca existente, fotografías ya incorporadas y artículos sobre límites de identificación.
- Huerto: guía práctica ya existente.
- Comparativas: catálogo y guía de elección existentes.
- Mitos: artículos existentes de mitos y desinformación.
- Cosas de casa: objetos, inventario y revisión existentes.

## Añadido
- `/temas` y 22 páginas temáticas: reúnen guías, artículos, comparativas, herramientas y recursos de Android. Un contenido puede relacionarse con varios temas, sin copiarlo a una URL nueva.
- `/calendario-lunar`: mes seleccionable, navegación, fases aproximadas e iluminación a las 12 UTC. SunCalc ya incluido en el proyecto. No copia de la app sus horas fijas de luz ni su clasificación de riesgo.
- Dos guías nuevas de caza/observación y preparación de pesca. Enfoque previo a la salida, sin instrucciones de trampas, armas o consumo. Referencia al MAPA para comprobar requisitos territoriales.
- Capturas reales de la app en las guías de frecuencias, caza y pesca. Se conservan enteras, con altura proporcional; no se presentan como fotografías documentales del campo.

## Archivos de la app consultados
- `src/data/frequencyGuideData.js`
- `src/data/huntingFishingData.js`
- `src/app/tools/lunar-calendar.jsx`
- Inventario previo en `APROVECHAMIENTO-COMPLETO-APP.md`.

No se ha modificado la app móvil ni copiado información privada. Las láminas pendientes de verificación de especies y mecanismos no se han publicado como instrucciones.
