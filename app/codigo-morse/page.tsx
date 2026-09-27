import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MorseTranslator } from "@/components/MorseTranslator";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({title: "Código Morse: traductor y alfabeto", description: "Convierte texto a Morse y descifra puntos y rayas. Alfabeto, números y práctica de comunicación.", slug: "codigo-morse"});
export default function MorsePage() {
  return <div className="editorial-library"><div className="journal-section">
    <Breadcrumbs items={[{label: "Inicio", href: "/"}, {label: "Herramientas", href: "/herramientas-supervivencia"}, {label: "Código Morse", href: "/codigo-morse"}]} />
    <header className="editorial-library-heading"><h1>Código Morse</h1><p>Puntos, rayas y mensajes para practicar la comunicación.</p></header>
    <MorseTranslator />
    <section className="morse-notes"><h2>Aprender el ritmo</h2><p>Una raya dura tres puntos. La separación dentro de una letra dura un punto; entre letras, tres; entre palabras, siete. En la escritura usamos espacios entre letras y / entre palabras.</p>
      <h2>Práctica en pareja</h2><p>Empieza con tres letras y acuerda el mensaje con otra persona. Alternad quién escribe y quién interpreta. Comprueba el resultado antes de aumentar la longitud. Las letras acentuadas, la ñ y la puntuación no se convierten en esta versión.</p>
      <h2>No es una llamada de emergencia</h2><p>Este traductor no transmite mensajes, no emite alertas y no contacta con rescate. No hagas pruebas de socorro que puedan confundirse con una emergencia real.</p>
      <p>Referencia: <a href="https://www.itu.int/rec/R-REC-M.1677/es">Código Morse internacional, UIT-R M.1677</a>.</p>
      <p><Link href="/senales-en-grupo">Practicar señales en grupo</Link> · <Link href="/aplicacion-supervivencia-offline">Recursos de comunicación en la app</Link></p>
    </section>
  </div></div>;
}
