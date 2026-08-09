export const donationFaqs = [
  {
    question: "¿Tengo que donar para usar la app?",
    answer: "No. Supervivencia Offline es gratuita y puede usarse completa sin realizar ninguna aportación.",
  },
  {
    question: "¿Donar desbloquea funciones?",
    answer: "No. Donar no desbloquea funciones adicionales. Es una forma voluntaria de apoyar el proyecto.",
  },
  {
    question: "¿Para qué se usa el dinero?",
    answer: "El dinero ayuda a mantener la web, mejorar la app, corregir errores, crear nuevas guías y preparar actualizaciones.",
  },
  {
    question: "¿Puedo seguir usando la app si no dono?",
    answer: "Sí. Puedes seguir usando la app completa aunque no dones.",
  },
  {
    question: "¿Es una compra?",
    answer: "No. Es una aportación voluntaria de apoyo al proyecto.",
  },
];

export function donationFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: donationFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
