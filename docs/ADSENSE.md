# Verificacion de AdSense

Cuenta: `ca-pub-7330652876943268`.

Se publica en el HTML del layout global la etiqueta oficial `google-adsense-account`.
Este metodo verifica la cuenta sin cargar `adsbygoogle.js`, solicitar anuncios ni crear cookies publicitarias.

Tras desplegar, seleccionar en AdSense el metodo de verificacion **Etiqueta meta**, no **Fragmento de codigo de AdSense**, y solicitar la comprobacion del sitio.
La etiqueta no garantiza la aprobacion: Google debe revisar el sitio.

Los anuncios siguen desactivados. Antes de activarlos, configurar una CMP certificada por Google compatible con TCF para el EEE, Reino Unido y Suiza. El banner local existente no sustituye esa CMP.

Documentacion oficial:
- https://support.google.com/adsense/answer/7584263?hl=es
- https://support.google.com/adsense/answer/13554020?hl=es

El script facilitado por el propietario no se carga por ahora; no se interpreta la aceptacion del banner local como consentimiento TCF.
