import { orderedBlogPosts } from '@/content/blog';
import { pageMetadata } from '@/lib/seo';
import { articleTopic, readingMinutes, topics } from '@/lib/editorial';
import { ArticleExplorer } from '@/components/ArticleExplorer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
export const metadata=pageMetadata({title:'Guías y artículos de supervivencia y preparación',description:'Aprende a preparar tu hogar, elegir equipo y organizar una salida. Artículos completos sobre agua, energía, naturaleza y planes familiares.',slug:'blog'});
export default function BlogPage(){return <div className="editorial-library"><div className="journal-section"><Breadcrumbs items={[{label:'Inicio',href:'/'},{label:'Artículos',href:'/blog'}]} /><header className="editorial-library-heading"><p className="journal-kicker">La biblioteca de Modo Crisis Survival</p><h1>Conocimiento para estar mejor preparado</h1><p>Consejos prácticos, explicaciones completas y criterios para elegir tu equipo. Encuentra lo que necesitas por tema.</p></header><ArticleExplorer topics={topics} posts={orderedBlogPosts.map(p=>({slug:p.slug,title:p.title,excerpt:p.excerpt,image:p.image,imageAlt:p.imageAlt,topic:articleTopic(p),minutes:readingMinutes(p)}))} /></div></div>;}
