// These older introductions are covered by the complete destination guides.
export const articleAliases: Record<string, string> = {
  "diferencias-alertas-oficiales-avisos-meteorologicos": "dana-aviso-naranja-o-rojo-que-debes-hacer",
  "como-preparar-coche-averia": "kit-de-emergencia-para-el-coche-que-llevar-en-2026",
  "botiquin-emergencia-casa": "botiquin-para-casa-comprarlo-hecho-o-montarlo-tu",
  "preparar-mascotas-emergencia": "mascotas-en-emergencias-apagon-calor-y-evacuacion",
  "como-utilizar-mapas-offline": "gps-movil-sin-internet-mapas-offline",
  "que-hacer-cuando-no-hay-cobertura": "sin-cobertura-movil-como-comunicarte-de-verdad",
  "que-guardar-mochila-72-horas": "mochila-emergencia-72-horas-peso-realista",
  "mochila-emergencia-trabajo-oficina": "emergencia-trabajo-volver-casa",
  "checklist-evacuacion-incendio-vivienda": "evacuacion-de-vivienda-checklist-paso-a-paso",
  "potabilizar-agua-emergencia-metodos-seguros": "agua-sin-electricidad-metodos-limites",
  "documentos-medicos-offline-emergencias": "documentacion-conviene-tener-disponible",
  "app-supervivencia-android-sin-internet": "que-debe-incluir-aplicacion-supervivencia-offline",
};

export function canonicalArticleHref(href: string) {
  const match = href.match(/^\/(?:blog|supervivencia)\/([^/?#]+)(.*)$/);
  if (!match) return href;
  return `/supervivencia/${articleAliases[match[1]] ?? match[1]}${match[2]}`;
}
