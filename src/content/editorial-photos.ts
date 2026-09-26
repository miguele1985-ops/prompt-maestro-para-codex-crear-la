const photos = {
  backpack: { name: "mochila-natural", alt: "Revisión de las correas de una mochila junto a abrigo y una botella." },
  filter: { name: "filtro-natural", alt: "Filtro portátil genérico junto a una bolsa de agua y un folleto; no representa un modelo probado." },
  rope: { name: "practica-cuerda-natural", alt: "Práctica con cuerda suelta sobre una mesa, sin carga ni maniobra técnica." },
  home: { name: "familia-preparada-natural", alt: "Dos personas preparando una mochila, agua y radio en casa." },
  water: { name: "reserva-agua-natural", alt: "Revisión de recipientes de agua en una cocina doméstica." },
  energy: { name: "energia-comunicacion-natural", alt: "Carga de un teléfono junto a una radio y una linterna frontal." },
  nature: { name: "aprendizaje-campo-natural", alt: "Excursionistas observando el entorno sin recolectar en un sendero." },
  car: { name: "equipo-coche-natural", alt: "Organización de agua, mochila y abrigo en un coche estacionado." },
  heat: { name: "hogar-calor-natural", alt: "Preparación de una vivienda para el calor con persianas y agua." },
  firstaid: { name: "botiquin-natural", alt: "Revisión de material de un botiquín doméstico sin abrir los envases." },
  pets: { name: "mascota-plan-natural", alt: "Preparación de un transportín y suministros junto a una mascota." },
  rain: { name: "lluvia-prevencion-editorial", alt: "Una calle residencial bajo la lluvia; no representa un episodio real." },
};
export function editorialPhoto(slug: string) {
  const key = /mascotas/.test(slug) ? "pets"
    : /mochilas|evacuacion/.test(slug) ? "backpack"
    : /filtros/.test(slug) ? "filter"
    : /nudos/.test(slug) ? "rope"
    : /botiquin/.test(slug) ? "firstaid"
    : /dana/.test(slug) ? "rain"
    : /calor|verano/.test(slug) ? "heat"
    : /coche|semaforos/.test(slug) ? "car"
    : /plantas|setas|animales|nudos|eclipse|forestal/.test(slug) ? "nature"
    : /agua|depositos/.test(slug) ? "water"
    : /radio|powerbank|generador|linterna|cobertura|es-alert/.test(slug) ? "energy" : "home";
  return { image: `/images/blog/${photos[key].name}.jpg`, alt: `${photos[key].alt} Imagen ilustrativa generada con IA.` };
}
