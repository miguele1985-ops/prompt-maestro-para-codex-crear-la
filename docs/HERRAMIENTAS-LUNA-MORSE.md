# Luna, Morse y calculadoras web

Cambios del 28 de septiembre de 2026:

- Calendario: disco lunar calculado a partir de la fraccion iluminada de SunCalc, fase creciente/menguante, edad aproximada y proximas fases. Orientacion esquematica del hemisferio norte, sin promesas de visibilidad, horas de luz o salida lunar.
- Morse: se copia assets/images/morse/morse-ai.png de la app a public/images/morse-app.png, sin modificar el original. La lamina no incluye W; se advierte junto a la imagen y permanece la tabla completa del traductor.
- Herramientas: las trece entradas del catalogo de calculadoras de Android tienen ahora una utilidad web. Se incorporan siete a las seis existentes; no se duplican articulos.
- Potabilizacion: proporcion introducida por el usuario a partir de una etiqueta autorizada, no dosis genericas de productos desconocidos.
- Destilacion: balance energetico simplificado con irradiancia explicita, sin deducirla de temperatura ni garantizar potabilidad.
- Rios: ejercicio distancia/tiempo, sin umbrales de vadeo seguro.
- Hipotermia: lista de signos para comunicar a emergencias, sin diagnosticos ni puntuacion tranquilizadora.
- Conversor: ocho magnitudes, con unidades estadounidenses identificadas y validacion de temperatura.
- Silbato: entrada de pulsos y reconocimiento de SOS, sin sonido, microfono ni transmision.
- Humo: esquema de columnas y viento, sin instrucciones para quemar residuos ni codigos de grupo presentados como universales.

La app movil solo se ha leido; no se ha modificado.

Fuentes: SunCalc (biblioteca local), CDC sobre agua en emergencias, NHS sobre hipotermia y NWS sobre inundaciones, enlazadas en cada recurso.

Verificacion: 66 pruebas unitarias, comprobacion TypeScript y ESLint; scripts/check-expanded-tools.cjs comprueba pixeles lunares, imagen Morse, trece destinos y controles a 360, 414, 768 y 1440 px.

No se ha desplegado en Cloudflare en esta entrega.
