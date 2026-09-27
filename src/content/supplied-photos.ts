// Selected from the user's image pack; never use synthetic species pictures for identification.
export const suppliedPhotos = [
  { file: "01-mochila-emergencia-72-horas", match: "mochila", alt: "Mochila con equipo de excursionismo" },
  { file: "03-almacenamiento-agua", match: "guardar-agua|depositos-de-agua", alt: "Recipientes de almacenamiento de agua" },
  { file: "04-alimentos-emergencia", match: "alimentos|cadena-suministro", alt: "Despensa con alimentos secos y conservas" },
  { file: "05-botiquin-emergencia", match: "botiquin", alt: "Material organizado en un botiquín" },
  { file: "06-radio-emergencia", match: "radio", alt: "Radio portátil con linterna" },
  { file: "09-energia-solar", match: "powerbanks-solares", alt: "Paneles solares portátiles y estación de energía" },
  { file: "11-navegacion-orientacion", match: "mapas-offline|gps-movil", alt: "Mapa, brújula y receptor de navegación" },
  { file: "12-filtro-agua-portatil", match: "filtros", alt: "Equipo de filtrado portátil junto a un curso de agua" },
  { file: "22-ninos-supervivencia", match: "ninos", alt: "Mochila infantil con abrigo y material de preparación" },
  { file: "23-mascotas-emergencia", match: "mascotas", alt: "Material de preparación junto a un perro y un gato" },
  { file: "24-documentos-importantes", match: "documentacion|documentos-medicos", alt: "Documentos y libreta de contactos preparados sobre una mesa" },
  { file: "29-herramientas-supervivencia", match: "objetos-de-casa", alt: "Cuerda y herramientas manuales sobre una mesa" },
  { file: "30-comunicaciones-emergencia", match: "sin-cobertura|no-hay-cobertura|7-dias-sin-internet", alt: "Dispositivos portátiles de comunicación y orientación" },
] as const;

export function suppliedPhoto(slug: string) {
  if (/^calculadora-|^app-/.test(slug)) return undefined;
  const photo = suppliedPhotos.find(item => new RegExp(item.match).test(slug));
  return photo ? { image: `/images/blog/aportada-${photo.file}.jpg`, alt: `${photo.alt}. Imagen ilustrativa aportada; no identifica un modelo probado.` } : undefined;
}
