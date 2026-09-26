# Material de la aplicación incorporado a la web

Origen autorizado por el usuario: `C:/Users/Valeria/Documents/Codex/SV/mobile`.
Fecha: 26 de septiembre de 2026. Acceso solo de lectura; no se modifica ni compila la app.

## Publicado en el proyecto web

- `/nudos`: 19 fichas con los mismos identificadores del catálogo móvil, nombres corregidos, función educativa y límites explícitos. Incluye búsqueda y filtro por función. No incorpora maniobras de rescate, cargas humanas ni secuencias técnicas sin validar.
- `/plantas-y-fauna`: sustituye la antigua presentación genérica por tres imágenes seleccionadas de la app, observación, límites, ejercicios y fuentes botánicas. Mantiene enlaces a artículos de fauna y hongos; no anuncia una migración de toda esa colección.
- Galería de las tres plantas dentro del artículo sobre confusiones botánicas.
- Accesos desde inicio, guías, recursos y el artículo de cinco nudos.
- Copias optimizadas locales; el despliegue no necesita acceso a la carpeta móvil. El original de cada imagen permanece intacto.

## Trazabilidad

`scripts/import-mobile-field-assets.cjs` procesa una lista explícita de tres imágenes, sin recorrer secretos ni dependencias de la aplicación. Analiza los metadatos de nudos mediante el AST de TypeScript: no ejecuta código de la app.

`mobile-field-provenance.json` conserva rutas de origen y hashes SHA-256. Las imágenes fueron facilitadas por el responsable para reutilizarlas en la web; no se presentan como dominio público, material Creative Commons, fotografía certificada ni identificación botánica validada.

## Material excluido tras inspección visual

- `nudo-ocho-1.png`: lámina que mezcla ocho doble, vuelta redonda y tensor; numeración repetida y contenido distinto del ocho simple del registro.
- `vuelta-escota-1.png`: el texto de la imagen la llama nudo cuadrado; no coincide con el registro de vuelta de escota.
- `nudo-simple-tope-1.png`: secuencia de varias vueltas, distinta del nudo simple, con recomendaciones de altura no adecuadas para la ficha web.
- `nudo-palomar-1.png`: no se valida la secuencia mostrada como ejecución del Palomar.
- Otras láminas revisadas (ballestrinque, llano, leñador): no se publican como instrucciones certificadas; requieren revisión técnica consistente de dibujo, nombre y uso.
- `romero_custom_1.jpg`: contiene afirmaciones medicinales y recetas; no se incorpora como ficha sanitaria.

Estos hallazgos no modifican los originales móviles. Se conservan para revisión del responsable. La web utiliza por ahora una imagen editorial de práctica sin carga en el catálogo de nudos y las tres imágenes de plantas sin instrucciones superpuestas.

## Pendiente

### Ampliación: comunicación en grupo

`/senales-en-grupo` incorpora cuatro láminas originales seleccionadas de `assets/reference-photos/hand-signals`: alto, silencio, mirar y espera. Se inspeccionaron visualmente y se conservan completas, con descarga y variantes WebP. No se presentan como fotografías documentales ni código universal. La ficha de espera advierte expresamente de su parecido con alto. Incluye ejercicios de acuerdo y comprobación, alternativas accesibles y enlaces al plan familiar. Accesible desde inicio, guías y recursos. Trazabilidad en `mobile-signals-provenance.json`.

Se mantiene el acceso de solo lectura a la aplicación. Las restantes láminas no se incorporan automáticamente: algunas contienen indicaciones para escenarios peligrosos que necesitan revisión específica.

Revisar el resto de fotografías, procedencia, correspondencia botánica y textos antes de ampliar la colección. No se ha migrado automáticamente el corpus completo de la aplicación ni se ha desplegado este cambio.
