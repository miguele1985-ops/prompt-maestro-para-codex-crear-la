# Actualizar APK

1. Copia el APK real a `public/downloads/modo-crisis-survival.apk`.
2. Actualiza version en `src/content/site-config.ts`.
3. Actualiza tamano.
4. Calcula el hash SHA-256.
5. Actualiza fecha.
6. Actualiza `changelog` en `src/content/downloads.ts`.
7. Prueba la descarga desde `/descargar`.
8. Publica la web.

PowerShell para hash:

```powershell
Get-FileHash public\downloads\modo-crisis-survival.apk -Algorithm SHA256
```
