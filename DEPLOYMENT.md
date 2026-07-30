# Despliegue

## Vercel

1. Sube el repositorio.
2. Configura `NEXT_PUBLIC_SITE_URL` con el dominio definitivo.
3. Ejecuta build command `npm run build`.

## Netlify

1. Usa build command `npm run build`.
2. Publica con el adaptador de Next.js de Netlify.
3. Configura variables de entorno.

## Cloudflare Pages

1. Usa framework Next.js.
2. Configura `NEXT_PUBLIC_SITE_URL` con el dominio definitivo cuando ya lo tengas.
3. Revisa compatibilidad si anades funciones server avanzadas.

No se requiere base de datos para mostrar el contenido principal.

## Si el dominio cambia

1. Cambia solo `NEXT_PUBLIC_SITE_URL` en el hosting.
2. Vuelve a ejecutar el despliegue.
3. Comprueba `/sitemap.xml`, `/robots.txt` y el canonical de la portada.
4. Envia de nuevo el sitemap en Google Search Console.
