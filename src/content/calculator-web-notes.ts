import type { BlogPost } from './blog';
export const calculatorWebNotes: Record<string, Pick<BlogPost, 'excerpt' | 'sections'>> = {
  'calculadora-potabilizacion-quimica-agua': { excerpt: 'Calcula una proporción a partir de la pauta de un producto autorizado. La etiqueta y las indicaciones sanitarias siempre prevalecen.', sections: [
    { heading: 'Cómo utilizar la versión web', body: 'Introduce volumen, cantidad por lote y tiempo tal como figuran en la etiqueta. Confirma que el producto es apto para agua de bebida. El resultado es una regla de tres, no una dosis elegida por la web. No fracciones pastillas ni cambies condiciones si el fabricante no lo permite.' },
    { heading: 'Límites del tratamiento', body: 'La desinfección no elimina todos los contaminantes. Ante sospecha de combustibles, productos químicos o contaminación radiológica, busca una fuente segura y sigue las indicaciones sanitarias.', links: [{label:'Recomendaciones de CDC',href:'https://www.cdc.gov/water-emergency/about/index.html'}] },
  ] },
  'calculadora-destilacion-solar-agua': { excerpt: 'Explora un balance energético teórico con superficie, irradiancia, tiempo y eficiencia supuesta; no garantiza producción ni agua potable.', sections: [
    { heading: 'Datos del modelo', body: 'Introduce superficie captadora, irradiancia media supuesta, horas equivalentes y eficiencia. Se utiliza una energía de vaporización simplificada de 2,26 MJ/kg y densidad de 1 kg/L. El balance no modela temperatura del agua, pérdidas variables, fugas ni calidad del montaje.' },
    { heading: 'No dependas de la cifra para abastecerte', body: 'La irradiancia no puede deducirse de la temperatura ambiente. El resultado es un ejercicio con supuestos, no una medición de rendimiento ni un método certificado de potabilización. Prepara una fuente segura de agua.' },
  ] },
  'calculadora-cruce-rios-seguridad': { excerpt: 'Ejercicio de velocidad de corriente y límites de interpretación. Ningún resultado autoriza a vadear un río.', sections: [
    { heading: 'Distancia dividida entre tiempo', body: 'Usa datos de un ejemplo para obtener m/s. No te acerques a una orilla peligrosa ni entres en el agua para medir. La operación no estima fuerza sobre una persona, estabilidad, profundidad ni obstáculos.' },
    { heading: 'Sin semáforos de seguridad', body: 'No hay un resultado verde ni una categoría de río cruzable. Busca un paso autorizado y seguro o retrocede. En una inundación, sigue las instrucciones oficiales y evita cruzar zonas cubiertas de agua.', links: [{label:'NWS: no atravesar una inundación',href:'https://www.weather.gov/safety/flood-turn-around-dont-drown'}] },
  ] },
  'calculadora-conversor-survival-unidades': { excerpt: 'Convierte volumen, masa, distancia, velocidad, energía, tiempo, presión y temperatura con unidades identificadas.', sections: [
    { heading: 'Elige magnitud, origen y destino', body: 'Introduce una cantidad y selecciona las unidades. Galones y onzas fluidas son estadounidenses; onzas de masa y onzas fluidas no son intercambiables. El conversor no transforma capacidad eléctrica en energía sin conocer el voltaje.' },
    { heading: 'Revisa antes de aplicar', body: 'La equivalencia matemática no valida una dosis, una pauta médica ni una instrucción técnica. Conserva las unidades de origen y contrasta los valores con el documento o fabricante.' },
  ] },
  'calculadora-silbato-emergencia-senales': { excerpt: 'Introduce pulsos cortos y largos para reconocer SOS en Morse y practicar sin emitir sonido ni avisar a rescate.', sections: [
    { heading: 'Introducir y corregir una secuencia', body: 'Pulsa Corto o Largo. Puedes retirar el último pulso o reiniciar. Tres cortos, tres largos y tres cortos coinciden con SOS; el ritmo y las pausas también importan. Otros patrones no reciben automáticamente un significado universal.' },
    { heading: 'Una práctica, no un sistema de rescate', body: 'La web no escucha el micrófono, no transmite y no contacta con emergencias. Acuerda los códigos internos con tu grupo y no practiques socorro audible donde pueda confundirse con un incidente real.' },
  ] },
  'calculadora-senales-humo-supervivencia': { excerpt: 'Simulador en pantalla para comparar columnas y efecto visual del viento, sin encender fuego ni atribuir códigos universales.', sections: [
    { heading: 'Cambiar el esquema', body: 'Selecciona entre una y cuatro columnas y un viento ilustrativo. El dibujo cambia para comparar patrones; no simula física atmosférica ni calcula visibilidad real.' },
    { heading: 'Sin fuego real', body: 'No quemes aceites, neumáticos, plásticos o residuos. Las señales requieren interpretación y no garantizan ayuda. Prioriza medios seguros de comunicación y sigue las prohibiciones e instrucciones oficiales.' },
  ] },
  'calculadora-hipotermia-riesgo': { excerpt: 'Anota signos observables para comunicar a emergencias, sin puntuaciones ni categorías que puedan dar falsa tranquilidad.', sections: [
    { heading: 'No esperes a terminar la lista', body: 'Si sospechas hipotermia, solicita asistencia al 112. La lista ayuda a comunicar observaciones, no a confirmar o descartar un diagnóstico. Si no responde o no respira normalmente, llama inmediatamente y sigue las instrucciones.' },
    { heading: 'Mientras llega ayuda', body: 'Busca protección segura del frío y material seco. Evita frotar extremidades, calor directo intenso y alcohol. No interpretes que tener cero casillas marcadas significa estar fuera de peligro.', links: [{label:'NHS: hipotermia',href:'https://www.nhs.uk/conditions/hypothermia/'}] },
  ] },
};
