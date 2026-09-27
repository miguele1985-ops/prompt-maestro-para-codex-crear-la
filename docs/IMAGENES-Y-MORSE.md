# Imágenes y Morse (27 septiembre 2026)

- Se importan 13 imágenes temáticas del directorio `imagenes web/Modo_Crisis_Survival_30_imagenes_web/Modo_Crisis_Survival`, sin modificar sus originales.
- Correspondencias centralizadas en `src/content/supplied-photos.ts`. Se aplican a los artículos existentes, sin duplicarlos. Se conservan imágenes específicas en los artículos no relacionados.
- Variantes WebP: 240, 360, 576, 960 y 1200 px. No se alteran proporciones ni se recortan los originales.
- No se presentan los productos ilustrados como modelos probados ni las plantas sintéticas como identificación botánica.
- La tabla `imagenes web/morse/morse-ai.png` presenta símbolos incorrectos (por ejemplo 7). No se publica. Se genera una tabla textual accesible desde los mismos datos que usa el traductor.
- La ilustración `mobile/assets/knots-ai/as-de-guia-1.png` no permite verificar un as de guía correcto. No se publica como instrucción; quedan pendientes de validación las láminas técnicas de nudos, trampas y especies.
- `/codigo-morse`: conversión local A-Z/0-9 en ambos sentidos, detección de caracteres no reconocidos, copiado, limpieza y alfabeto responsive. No hay transmisión, audio ni señales de socorro automáticas.
- Tabla A-Z/0-9 adaptada de `mobile/src/components/MorseOfflineBlock.jsx`, referencia UIT-R M.1677-1. No se modifica la aplicación móvil.
- Nuevo acceso en Herramientas, búsqueda del portal y sitemap.
