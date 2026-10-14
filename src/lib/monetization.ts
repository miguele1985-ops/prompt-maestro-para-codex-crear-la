const critical =
  /(?:sos|primeros-auxilios|hipotermia|cruce-rios|intoxicacion|plantas-comestibles|setas|animales-venenosos|agua-sin|potabiliza|dana|evacuacion|semaforos|calor-extremo|generador-en-casa-normativa|medicamentos|tratamientos|personas-mayores|gestion-alimentos|confinamiento|que-hacer-si-te-pierdes)/;
export function monetizationPolicy(path: string) {
  const excluded =
    /(?:tormenta-electrica|terremoto|fuego-bushcraft|hornillo|ampollas|higiene|cuchillo-bushcraft|vivac-emergencia)/.test(path) ||
    /^\/(?:api|administracion|admin-login|descargar|centro-descargas|aplicacion-supervivencia-offline|donaciones|sos|modo-crisis|checklists)(?:\/|$)/.test(
      path,
    ) || critical.test(path);
  return {
    // A single preparatory block after the article, never inside urgent instructions or tool results.
    affiliate: !excluded && /^\/(?:supervivencia|preparacion-practica)\/[^/]+$/.test(path),
    displayEligible: !excluded && path.startsWith("/supervivencia/"),
    displayEnabled: false,
  };
}
