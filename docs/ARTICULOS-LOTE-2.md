# Incorporacion del lote 2

Archivo facilitado: `1-articulos-lote-2-modocrisis.md`, adjunto del usuario.

Los cinco temas ya estaban publicados en el codigo. Se integra el lote como revision de las paginas existentes, no como cinco duplicados. Las cinco rutas solicitadas redirigen permanentemente a las canonicas; sitemap, relacionados y enlaces internos usan estas ultimas. Mapeo reproducible en `src/content/batch-two.ts`.

Se conserva el formato editorial, imagen ilustrativa optimizada, indice, enlaces internos, fuentes y bloque final de Amazon. No se activan anuncios automaticos ni se copian instrucciones editoriales del archivo al texto visible.

## Revision de datos

- Apagon: se corrige la insinuacion de que no hay informe final. ENTSO-E lo publico el 20 de marzo de 2026. Se omiten porcentaje de encuesta y jornada parlamentaria no comprobados.
- Avisos: se usa la terminologia actual de AEMET y se distingue peligro meteorologico de instrucciones de proteccion.
- Generadores: se concreta la distancia orientativa de CDC y se remite la instalacion a la ITC-BT-40 y profesionales. Sin instrucciones de cableado.
- Calor: media peninsular, periodo y referencia explicitos. No se convierte el acumulado anual en una unica ola ni se repiten cifras de mortalidad sin fuente especifica.
- Coche: V16 conectada para vehiculos obligados, no triangulos como requisito general vigente. Lista oficial enlazada.

Fuentes consultadas y enlazadas en cada articulo: ENTSO-E, AEMET, CDC, BOE y DGT. Imagenes existentes de la biblioteca editorial, etiquetadas como ilustrativas, no fotografias de sucesos reales.

La revision reemplaza el cuerpo importado anterior de estas cinco paginas al renderizar, sin borrar los HTML originales. Los tiempos de lectura se recalculan sobre el contenido revisado.
