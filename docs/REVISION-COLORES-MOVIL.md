# Revision editorial y contenido de la app

- Las vistas editoriales heredan papel, verde y naranja del sitio. No se modifica la administracion.
- Tarjetas de articulos en una columna hasta 700 px, imagen proporcionada y texto sin recortes.
- Botones comerciales: Ver en Amazon. Se conserva el identificador cociesfaci-21 y rel sponsored; la informacion comercial permanece en el aviso legal.
- 16 listas y 170 tareas adaptadas de la app: seleccion, marcado independiente, progreso, descarga de texto e impresion. Las marcas no se guardan al cerrar la pagina.
- Origen, hash y adaptaciones: mobile-checklists-review.json. La carpeta movil se lee, no se modifica ni compila.
- Se mantienen las bibliotecas de nudos y plantas incorporadas previamente. No se publica automaticamente el resto del contenido medico, botanico o tecnico sin revision.

## Verificacion local

- Next build correcto: 98 paginas estaticas.
- Vitest: 33 pruebas correctas. ESLint correcto.
- 24 comprobaciones de viewport: 320, 390, 768 y 1440 px en inicio, blog, comparativas, nudos, plantas y checklists.
- Seleccion de listas, conservacion de marcas al cambiar, reinicio independiente y descarga comprobados con navegador.
- Rastreo de 111 rutas sin errores.
- Vista previa actualizada: public/inicio-editorial-revisado.html.
- No se ha realizado commit, push ni despliegue en esta revision.
