import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { amazonSearchUrl } from "@/content/affiliate";
import { equipmentForArticle } from "@/content/article-equipment";
export function ArticleEquipment({slug}:{slug:string}) {
  return <aside className="article-equipment" aria-label="Opciones de equipo en Amazon">
    <p className="equipment-disclosure">Publicidad · Enlaces de Amazon. <Link href="/aviso-legal">Información comercial</Link></p>
    <h2>Si necesitas completar tu equipo</h2>
    <p>Revisa primero lo que ya tienes. Estos enlaces abren búsquedas, no modelos probados ni compras necesarias para seguir la guía.</p>
    <ul>{equipmentForArticle(slug).map(option=><li key={option.query}><div><h3>{option.name}</h3><p>{option.check}</p></div><a href={amazonSearchUrl(option.query)} target="_blank" rel="sponsored nofollow noopener noreferrer" aria-label={`Ver en Amazon: ${option.name}`}>Ver en Amazon <ExternalLink size={16} aria-hidden /></a></li>)}</ul>
  </aside>;
}
