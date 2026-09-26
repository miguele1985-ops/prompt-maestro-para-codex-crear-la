const critical =
  /(?:sos|primeros-auxilios|hipotermia|cruce-rios|intoxicacion|plantas-comestibles|setas|animales-venenosos|agua-sin|potabiliza|dana|evacuacion|semaforos|calor-extremo|generador-en-casa-normativa)/;
export function monetizationPolicy(path: string) {
  const excluded =
    /^\/(?:api|administracion|admin-login|descargar|centro-descargas|aplicacion-supervivencia-offline|donaciones|sos|modo-crisis|checklists)(?:\/|$)/.test(
      path,
    ) || critical.test(path);
  return {
    // A single preparatory block after the article, never inside urgent instructions or tool results.
    affiliate: /^\/(?:blog|preparacion-practica)\/[^/]+$/.test(path),
    displayEligible: !excluded && path.startsWith("/blog/"),
    displayEnabled: false,
  };
}
