import Link from 'next/link';
import { LearningRoute } from '@/components/LearningRoute';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata({ title: 'Empieza aquí: preparación y senderismo en 7 pasos', description: 'Organiza tu preparación familiar o tu primera ruta de senderismo con siete acciones pequeñas, guías prácticas y un progreso guardado en tu navegador.', slug: 'empieza-aqui' });
export default function StartPage() {
  return <div className="journal-section growth-start"><header className="editorial-library-heading"><p className="eyebrow">Menos improvisar. Más comprobar.</p><h1>Empieza aquí</h1><p>No necesitas comprarlo todo ni aprenderlo todo hoy. Elige un recorrido y resuelve una tarea cada vez.</p></header><LearningRoute /><section className="growth-next"><h2>Prepara tu próxima práctica</h2><Link href="/cuaderno-de-campo">Abrir e imprimir el cuaderno de campo</Link><Link href="/herramientas-supervivencia">Calcular reservas y tiempos</Link><Link href="/mi-biblioteca">Volver a tus lecturas guardadas</Link></section></div>;
}
