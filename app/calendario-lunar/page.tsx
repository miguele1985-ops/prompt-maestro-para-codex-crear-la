import Link from 'next/link';
import { LunarCalendar } from '@/components/LunarCalendar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata({title:'Calendario lunar: fases e iluminación',description:'Consulta las fases aproximadas de la Luna por mes. Cálculo local de la fracción iluminada, sin confundirla con visibilidad o seguridad nocturna.',slug:'calendario-lunar'});
export default function LunarPage(){return <div className="editorial-library"><div className="journal-section">
  <Breadcrumbs items={[{label:'Todos los temas',href:'/temas'},{label:'Calendario lunar',href:'/calendario-lunar'}]} />
  <header className="editorial-library-heading"><h1>Calendario lunar</h1><p>Fases aproximadas y fracción iluminada de la Luna.</p></header><LunarCalendar />
  <section className="morse-notes"><h2>La fase no equivale a luz disponible</h2><p>La iluminación se calcula para las 12:00 UTC de cada fecha. Los nombres de fase son orientativos, no la hora exacta de luna llena o nueva. La nubosidad, el relieve y la posición de la Luna cambian lo que podrás ver desde un lugar concreto.</p><p>No estima salida o puesta lunar, mareas, capturas de pesca ni rendimientos del huerto. Lleva iluminación propia y no decidas una ruta por el porcentaje mostrado.</p><p>Cálculo con la biblioteca <a href="https://github.com/mourner/suncalc">SunCalc</a>, ya utilizada por las herramientas de la web.</p><Link href="/supervivencia/calculadora-horas-luz-ruta#calculadora">Consultar las horas de luz solar</Link></section>
</div></div>;}
