# Distribucion de escritorio

Fecha: 15 de octubre de 2026.

## Cambios

- Inicio y bibliotecas dejan de estar limitados a un bloque fijo de 1184 px.
- Margenes fluidos: el contenido ocupa un 92 % del ancho en 1280, 1440 y 1920 px, y mas del 92 % en pantallas superiores.
- Tres lecturas destacadas de igual ancho, con fotos completas en su espacio de tarjeta y sin miniaturas laterales diminutas.
- Distribucion de las rutas de lectura, herramientas y acceso a la app alineada con el nuevo ancho.
- Catalogos de cuatro columnas a partir de 1600 px y cinco a partir de 2400 px.
- Fuentes de escritorio con tamanos fijos legibles, sin escalado de fuente en funcion del viewport.
- Variantes de imagen seleccionadas segun el ancho real de la nueva distribucion.
- Se mantienen la paleta, los textos, los encabezados y las URL. El ancho de lectura de un articulo individual no se fuerza a ocupar todo el monitor.

## Verificacion

- 108 pruebas correctas, ESLint correcto y compilacion de 199 paginas estaticas correcta.
- Comprobacion de inicio, articulos y temas en 360, 414, 768, 1024, 1280, 1440, 1920, 2560 y 3840 px.
- Sin desbordamiento lateral ni recorte de la navegacion de escritorio.
- Comprobacion de igualdad de tarjetas y resolucion de sus imagenes.
- Informe: `docs/desktop-layout-check.json`.
- Captura de escritorio: `docs/preview-escritorio-ampliado.png`.

Las capturas del usuario parecen mostrar zoom reducido, pero no se ha medido ese ajuste. El sitio no cambia el zoom del navegador. Ctrl+0 permite volver al zoom normal del navegador en Windows; la adaptacion de ancho funciona independientemente de ese ajuste.
