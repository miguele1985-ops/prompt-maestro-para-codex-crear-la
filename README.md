# Modo Crisis Survival Web

Web oficial en Next.js para presentar y descargar la aplicacion Android Modo Crisis Survival.

## Comandos

- Instalar: `npm install`
- Desarrollo: `npm run dev`
- Validar tipos: `npm run typecheck`
- Pruebas: `npm run test`
- Compilar: `npm run build`

## Estructura

- `app/`: rutas, layout, metadata, sitemap, robots y paginas de error.
- `src/content/`: textos, SEO, descargas, FAQ, funciones, guias y legales.
- `src/components/`: componentes reutilizables.
- `public/downloads/`: APK real y guia de sustitucion.
- `/administracion`: panel local para editar contenidos, changelog y subir APK.

Consulta `ADMIN_GUIDE.md` para usar la zona de administracion.
- `public/images/`, `public/screenshots/`, `public/videos/`, `public/icons/`: recursos sustituibles.

## Cambiar contenidos

Edita `src/content/site-config.ts` para nombre, slogan, APK, version, tamano, hash, correos, dominio, colores, metadatos y redes. Edita los archivos vecinos para funciones, guias, FAQ, changelog y paginas legales.

## Cambiar APK

Sigue `APK_UPDATE_GUIDE.md`. No publiques sin version, tamano, fecha y hash SHA-256 reales.

## Dominio

El dominio no esta fijado en el codigo. Cuando tengas el dominio definitivo, configura:

`NEXT_PUBLIC_SITE_URL=https://tu-dominio-final.com`

Ese valor alimenta canonical, sitemap, robots, Open Graph, Twitter Cards y datos estructurados. Si lo cambias en el hosting, vuelve a publicar la web para regenerar los metadatos.

## Despliegue

Compatible con Vercel, Netlify y Cloudflare Pages. Configura `NEXT_PUBLIC_SITE_URL` con el dominio final antes de publicar oficialmente.
