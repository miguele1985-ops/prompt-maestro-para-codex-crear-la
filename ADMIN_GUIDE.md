# Administración local

La zona de administración está en:

`/administracion`

Si no hay sesión, redirige a:

`/admin-login`

## Acceso

En desarrollo local, si no configuras variables, puedes entrar con:

- Usuario: `admin`
- Contraseña: `modo-crisis-local`

Antes de publicar configura credenciales reales en `.env`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=usa-una-contrasena-larga
ADMIN_TOKEN=usa-un-token-largo-y-privado
ADMIN_SESSION_SECRET=usa-otro-secreto-largo
```

## Medidas de seguridad añadidas

- Middleware bloqueando `/administracion`.
- Middleware bloqueando `/api/admin/*`.
- Login separado en `/admin-login`.
- Cookie de sesión `HttpOnly`.
- `SameSite=Strict`.
- `Secure` automático en producción.
- Comparación segura de credenciales.
- Límite básico de intentos de login.
- `X-Robots-Tag: noindex, nofollow, noarchive`.
- `Cache-Control: no-store`.
- `robots.txt` bloquea administración y API.
- La administración ya no está enlazada desde el footer público.

## Qué permite editar

- Configuración principal del sitio.
- Datos de descarga.
- APK oficial.
- Tamaño del APK.
- Hash SHA-256.
- Fecha de actualización.
- Changelog.
- Páginas existentes.
- Nuevas páginas.
- Secciones con imagen, pasos, consejos y advertencias.

## Cómo se guardan los cambios

Los cambios se escriben en:

`src/content/admin-overrides.json`

El APK se guarda en:

`public/downloads/modo-crisis-survival.apk`

## Publicación

En hosting estático o serverless, los cambios no deben tratarse como un CMS en vivo. El flujo recomendado es:

1. Entrar en `/administracion` en local.
2. Editar textos, páginas, changelog o subir APK.
3. Guardar cambios.
4. Ejecutar `npm run build`.
5. Publicar en Vercel, Netlify o Cloudflare Pages.

## Aviso importante

No uses las credenciales por defecto en producción. Usa HTTPS, contraseñas largas y variables de entorno privadas. No subas `.env` al repositorio.
