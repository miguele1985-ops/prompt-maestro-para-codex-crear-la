# Inventario y aprovechamiento del contenido movil

## Alcance real

Inventario automatizado completo de `src` y `assets`: 518 archivos y 274 archivos de imagen, incluidos duplicados y variantes. No son 274 fotografias distintas verificadas. El listado, dimensiones, hashes y colecciones de datos estan en `mobile-complete-inventory.json`.

No se han leido bases de datos de usuarios, secretos, dependencias ni carpetas personales. No se ha ejecutado ni modificado la app. El inventario de metadatos no equivale a una validacion editorial de cada consejo.

## Incorporado a la web

- Nueve nuevas guias en `/preparacion-practica`: inventario, documentos, mapas sin conexion, luz y bateria, ensayo familiar, ocho retos, revisiones por temporadas, huerto y copias de seguridad. Cada guia identifica su modulo de origen en `src/content/practical-guides.ts`, incluye tres apartados, limites y lista interactiva descargable.
- Nueve capturas reales de la app ya disponibles en el proyecto web, inspeccionadas en `practical-covers-review.jpg`. Se muestran completas y con variantes WebP, no como supuestas fotos de campo.
- Diez laminas adicionales copiadas de `assets/reference-photos/hand-signals`; ahora hay 14 en `/senales-en-grupo`. Contacto visual, reagrupacion, necesidades, recuento, telefono, luz, negacion, confirmacion y ritmo. Fuente, hash y destinos en `mobile-signals-provenance.json`.
- Se mantienen 16 listas con 170 tareas, 19 fichas de nudos y tres imagenes de plantas incorporadas anteriormente.
- Enlaces desde inicio, guias y recursos; nuevas rutas en sitemap. La app sigue teniendo pagina propia y enlaces de descarga.

## Seleccion por familias

| Familia localizada | Aprovechamiento y decision |
| --- | --- |
| Inventario, documentos, respaldo y notas | Guias nuevas. No publicar informacion personal ni copiar consejos de almacenar claves bancarias en una lista general. |
| Mapas, ubicaciones, rutas y brujula | Guia de comprobacion previa; no copiar mapas externos sin procedencia ni prometer que una ruta es transitable. |
| Familia, simulacros, retos, certificados | Dos guias nuevas y listas previas. Sin puntuaciones que certifiquen seguridad ni simulacros con llamadas reales a emergencias. |
| Rutinas y mantenimiento | Guia estacional; periodos segun producto/manual, no caducidades universales. |
| Energia y bateria | Guia de comprobacion del equipo. No copiar la conversion de mAh con voltaje de salida como autonomia garantizada. |
| Huerto | Guia de observacion y planificacion. Calendarios regionales y produccion necesitan validacion local; no prometer autosuficiencia. |
| Gestos y comunicacion visual | 14 laminas revisadas y contextualizadas; no codigo universal ni lengua de signos. Direcciones, rescate y maniobras de riesgo no se incorporan automaticamente. |
| Nudos | 19 fichas existentes; laminas con errores tecnicos excluidas. |
| Plantas, hongos y animales | Tres imagenes existentes. Las demas requieren procedencia y correspondencia verificadas; no publicar tratamientos ni recomendaciones de consumo por parecido visual. |
| Comparativas y equipo | Ideas de revisar compatibilidad/mantenimiento usadas en las guias. No copiar puntuaciones, rendimientos o recomendaciones sanitarias sin fuentes. |
| Guias generales, crisis y desastres | Corpus localizado e inventariado; no convertir protocolos generales en instrucciones universales. Necesita revision por escenario y fuentes oficiales. |
| Agua quimica, hipotermia, salud, primeros auxilios | No traslado automatico de dosis, diagnosticos ni consejos de supervivencia extrema. |
| Aprendizaje interactivo y mitos | Adaptacion a ejercicios de preparacion; preguntas sobre dosis de lejia o plazos de supervivencia no se copian como respuestas ciertas. |
| Caza, pesca, trampas, huellas | Inventariados. Revision tecnica, sanitaria, normativa y de imagen pendiente; no son prioritarios para el portal familiar. |
| Radio, frecuencias, alertas y meteorologia | No publicar frecuencias o datos cambiantes como actuales sin verificacion. Dependencias de red requieren adaptacion especifica. |
| Calculadoras | Las ya incorporadas permanecen. Las restantes necesitan validacion matematica y de limites antes de trasladarlas. |
| Licencias, admin, pagos, servicios y almacenamiento | Funciones internas: fuera del contenido editorial. No copiar credenciales, estado de usuarios ni operaciones administrativas. |
| Audio, mapas, modelos y archivos externos | Solo inventario. No redistribuidos automaticamente ni presentados como material libre. |

## Fotos y derechos

El acceso concedido permite seleccionar material de la app, pero no demuestra una licencia libre de cada imagen externa. Las laminas reutilizadas se atribuyen como material facilitado por el responsable. No se declaran fotografias documentales, dominio publico ni Creative Commons. Las imagenes botanicas externas sin trazabilidad suficiente quedan pendientes.

## Estado

Cambios locales, sin commit, push o despliegue en esta ampliacion. El inventario permite continuar por familias sin volver a recorrer todo ni prometer que ya se ha publicado cada archivo.
