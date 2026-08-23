# Sistema de licencias, mensajes remotos y bloqueo

Este proyecto deja preparada la infraestructura para que Modo Crisis Survival pueda seguir siendo gratis ahora y, si en el futuro lo decides, activar licencias desde el panel.

Estado inicial obligatorio:

```json
{
  "app_mode": "FREE",
  "licensing_enabled": false,
  "global_lock_enabled": false
}
```

Con ese estado, ningún usuario necesita licencia y la app no debe bloquearse.

## Qué se ha creado

- Migración D1 en `migrations/0001_licensing.sql`.
- API pública para Android:
  - `/api/v1/config`
  - `/api/v1/messages`
  - `/api/v1/license/activate`
  - `/api/v1/license/status`
- API administrativa protegida:
  - `/api/admin/licensing`
  - `/api/admin/licensing/config`
  - `/api/admin/licensing/licenses`
  - `/api/admin/licensing/messages`
- Panel nuevo dentro de `/administracion`, pestaña `Licencias`.
- Firma offline de licencia mediante ECDSA P-256/SHA-256.
- Registro de auditoría para acciones críticas.

## Crear la base D1

En Cloudflare:

1. Entra en `Workers & Pages`.
2. Abre `D1 SQL Database`.
3. Crea una base, por ejemplo:

```text
modo-crisis-licensing
```

4. Copia el `Database ID`.

## Aplicar la migración

Puedes hacerlo desde el panel de Cloudflare D1 pegando el contenido de:

```text
migrations/0001_licensing.sql
```

También puedes usar Wrangler si lo tienes configurado:

```bash
npx wrangler d1 execute modo-crisis-licensing --file=migrations/0001_licensing.sql --remote
```

## Variables y secretos necesarios

En Cloudflare Pages, entra en tu proyecto:

```text
Configuración -> Variables y secretos
```

Añade estas variables como `Secret`:

```text
LICENSES_D1_ACCOUNT_ID
LICENSES_D1_DATABASE_ID
LICENSES_D1_API_TOKEN
LICENSE_PRIVATE_KEY_JWK
```

Opcional para documentación/pruebas:

```text
LICENSE_PUBLIC_KEY_JWK
```

No pegues estos valores en el código público.

## Crear el API Token para D1

En Cloudflare:

1. Ve a `Mi perfil -> API Tokens`.
2. Crea un token personalizado.
3. Permisos recomendados:
   - `Account -> D1 -> Edit`
4. Recursos:
   - Tu cuenta de Cloudflare.
5. Guarda el token y úsalo como:

```text
LICENSES_D1_API_TOKEN
```

## Generar claves de firma

Genera una clave ECDSA P-256. La clave privada va en Cloudflare como `LICENSE_PRIVATE_KEY_JWK`. La clave pública es la que se debe incorporar a Android para comprobar licencias offline.

Ejemplo local con Node:

```js
const { subtle } = globalThis.crypto;

const keyPair = await subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-256" },
  true,
  ["sign", "verify"]
);

console.log("PRIVATE JWK");
console.log(JSON.stringify(await subtle.exportKey("jwk", keyPair.privateKey)));

console.log("PUBLIC JWK");
console.log(JSON.stringify(await subtle.exportKey("jwk", keyPair.publicKey)));
```

La clave privada no debe ir nunca en Android, GitHub ni JavaScript de cliente.

## URL del panel

El panel sigue estando en:

```text
https://tu-dominio.com/administracion
```

Dentro verás la pestaña:

```text
Licencias
```

## Cómo generar una licencia de prueba

1. Entra en `/administracion`.
2. Abre `Licencias`.
3. Deja la app en `Gratis`.
4. En `Generar licencias`, crea 1 código con 2 dispositivos.
5. Copia el código inmediatamente.

El código completo solo aparece al generarlo. En D1 se guarda el hash y los últimos 4 caracteres.

## Cómo probar sin afectar a usuarios reales

Mientras:

```text
app_mode = FREE
licensing_enabled = false
global_lock_enabled = false
```

Android no debe pedir código.

Para probar activación de licencia, usa un entorno de pruebas de la app o una versión interna que llame a:

```text
POST /api/v1/license/activate
```

No cambies a `LICENSE_REQUIRED` hasta que la app Android ya tenga implementada la verificación offline con la clave pública.

## Cómo activar licencias en el futuro

Cuando quieras exigir licencia:

1. Entra en `/administracion`.
2. Pestaña `Licencias`.
3. Cambia el modo a `LICENCIA OBLIGATORIA`.
4. Activa `Activar comprobación de licencias`.
5. Escribe exactamente:

```text
ACTIVAR LICENCIAS
```

6. Guarda.

Este paso bloquea a usuarios sin licencia válida cuando Android reciba la configuración.

## Botón de emergencia para volver a gratis

En la pestaña `Licencias` existe:

```text
Restablecer modo gratis
```

Ese botón fuerza:

```text
licensing_enabled = false
global_lock_enabled = false
app_mode = FREE
```

## Mensajes remotos

Puedes crear mensajes para Android con:

- título,
- texto,
- botón,
- URL,
- tipo,
- permitir cerrar,
- activo/inactivo,
- bloqueante/no bloqueante.

La API pública es:

```text
GET /api/v1/messages
GET /api/v1/messages?appVersion=1
```

## Configuración que lee Android

Android debe consultar:

```text
GET /api/v1/config
```

Respuesta esperada en modo gratis:

```json
{
  "schemaVersion": 1,
  "appMode": "FREE",
  "licensingEnabled": false,
  "globalLockEnabled": false,
  "minimumSupportedVersion": 1,
  "latestVersion": 1,
  "purchaseUrl": "https://modo-crisis-survival.pages.dev/donaciones",
  "supportUrl": "https://modo-crisis-survival.pages.dev/contacto",
  "configurationVersion": 1
}
```

## Certificado offline

Cuando una licencia se activa correctamente, el servidor devuelve un certificado firmado.

Android debe:

1. Guardar el certificado localmente.
2. Verificarlo con la clave pública.
3. Comprobar que el `installationIdHash` corresponde a esa instalación.
4. Comprobar caducidad si existe.

No debe desbloquearse solo porque la API responda `valid: true`.

## Backup de D1

Haz exportaciones periódicas de D1 desde Cloudflare o con Wrangler.

Ejemplo:

```bash
npx wrangler d1 export modo-crisis-licensing --remote --output=backup.sql
```

## Pasarela de pago futura

No se ha creado una tienda ni un backend de pago.

La arquitectura queda preparada para que en el futuro un webhook verificado pueda:

```text
Pago confirmado -> servidor verifica -> genera licencia -> entrega código
```

No generes licencias solo por una página de “pago correcto” del navegador.
