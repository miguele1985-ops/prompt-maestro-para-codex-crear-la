const critical = /(?:sos|primeros-auxilios|hipotermia|cruce-rios|intoxicacion|plantas-comestibles|setas|animales-venenosos|agua-sin|potabiliza|dana|evacuacion|semaforos|calor-extremo|generador-en-casa-normativa)/;
export function monetizationPolicy(path: string) {
  const excluded = /^\/(?:api|administracion|admin-login|descargar|centro-descargas|aplicacion-supervivencia-offline|donaciones|sos|modo-crisis|checklists)(?:\/|$)/.test(path) || critical.test(path);
  const calculator = path.includes('calculadora-');
  const commercial = /comparativa|mochila|powerbank|radio|botiquin|kit-de|depositos/.test(path);
  return { affiliate: !excluded && !calculator && commercial, displayEligible: !excluded && path.startsWith('/blog/'), displayEnabled: false };
}
