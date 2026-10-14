import type { BlogPost, BlogSection } from '@/content/blog';
import { batchTwoRevisions } from '@/content/batch-two';
import { everydayUpdates } from '@/content/everyday-survival';
import { articleQualityRevisions } from '@/content/article-quality-revisions';
import { distinctGuideRevisions } from '@/content/distinct-guide-revisions';
import { growthRevisions } from '@/content/growth-revisions';
import originalWords from '@/content/editorial-original-word-counts.json';

export function usesOriginalBody(slug: string) {
  if (growthRevisions[slug]?.preferOriginal) return true;
  return !Boolean(batchTwoRevisions[slug] || everydayUpdates.has(slug) || articleQualityRevisions[slug] || distinctGuideRevisions[slug] || growthRevisions[slug]?.replace);
}
export function sectionWords(sections: BlogSection[]) {
  return sections.map(s => [s.heading, s.body, ...(s.bullets || []), ...(s.steps || []), ...(s.table?.headers || []), ...(s.table?.rows.flat() || [])].join(' ')).join(' ').split(/\s+/).filter(Boolean).length;
}
export function articleWordCount(post: BlogPost) {
  const original = usesOriginalBody(post.slug) ? (originalWords as Record<string, number>)[post.slug] : undefined;
  const body = original === undefined ? sectionWords(post.sections) : original + sectionWords(growthRevisions[post.slug]?.sections || []);
  return body + (post.faq || []).map(item => `${item.question} ${item.answer}`).join(' ').split(/\s+/).filter(Boolean).length;
}
