// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { existsSync } from 'node:fs';
import { growthArticles } from '../src/content/growth-articles';
import { growthRevisions } from '../src/content/growth-revisions';
import { blogPosts, getBlogPost } from '../src/content/blog';
import ArticlePage, { generateMetadata } from '../app/supervivencia/[slug]/page';
import { ArticleActions, readSavedArticles, savedArticlesKey } from '../src/components/ArticleActions';
import { LearningRoute } from '../src/components/LearningRoute';
import sitemap from '../app/sitemap';
import LibraryPage from '../app/mi-biblioteca/page';
import { metadata as libraryMetadata } from '../app/mi-biblioteca/page';
import { monetizationPolicy } from '../src/lib/monetization';
import { allContentPages } from '../src/content/pages';
import { articleWordCount } from '../src/lib/article-body';
import WorkbookPage from '../app/cuaderno-de-campo/page';
import { stepTwoRevisions } from '../src/content/step-two-revisions';

const words = (post: typeof blogPosts[number]) => [...post.sections.map(section => [section.heading, section.body, ...(section.bullets || []), ...(section.steps || []), ...(section.table?.rows.flat() || [])].join(' ')), ...(post.faq || []).map(item => `${item.question} ${item.answer}`)].join(' ').split(/\s+/).filter(Boolean).length;
afterEach(() => { cleanup(); localStorage.clear(); vi.unstubAllGlobals(); });
describe('original growth content', () => {
  it('adds fifteen distinct long guides and preserves the previous 86 URLs', () => {
    expect(growthArticles).toHaveLength(15);
    expect(blogPosts).toHaveLength(101);
    expect(new Set(blogPosts.map(post => post.slug)).size).toBe(101);
    for (const post of growthArticles) {
      expect(words(post), post.slug).toBeGreaterThanOrEqual(1200);
      expect(words(post), post.slug).toBeLessThanOrEqual(2000);
      expect(post.metaDescription!.length, post.slug).toBeLessThanOrEqual(155);
      expect(post.warning).toBeTruthy(); expect(post.sources!.length).toBeGreaterThan(0);
      for (const link of post.relatedLinks!) expect(getBlogPost(link.href.split('/').at(-1)!)).toBeDefined();
    }
  });
  it('expands existing guides without renaming them', () => {
    expect(Object.keys(growthRevisions)).toHaveLength(24 + Object.keys(stepTwoRevisions).length);
    for (const slug of Object.keys(growthRevisions)) {
      const post = getBlogPost(slug)!;
      expect(articleWordCount(post), slug).toBeGreaterThanOrEqual(1200);
      expect(articleWordCount(post), slug).toBeLessThanOrEqual(2000);
      expect(post.updatedAt).toBe('2026-10-14');
      expect(post.metaDescription!.length).toBeLessThanOrEqual(155);
    }
  });
  it('replaces legacy summaries and recalculates reading time for rewritten guides', async () => {
    for (const slug of ['gps-movil-sin-internet-mapas-offline', 'bateria-10000-mah-cargas-reales', 'peso-reserva-familiar-emergencias']) {
      const post = getBlogPost(slug)!;
      const markup = renderToStaticMarkup(await ArticlePage({ params: Promise.resolve({ slug }) }));
      const doc = new DOMParser().parseFromString(markup, 'text/html');
      expect(doc.querySelector('.article-original')).toBeNull();
      expect(doc.querySelectorAll('.editorial-text-section')).toHaveLength(post.sections.length);
      for (const link of doc.querySelectorAll('.editorial-toc a[href^="#"]')) expect(doc.getElementById(link.getAttribute('href')!.slice(1))).not.toBeNull();
      expect(doc.querySelectorAll('.article-faq details')).toHaveLength(3);
      expect(post.sources!.length).toBeGreaterThan(0);
    }
  });
  it('renders legacy improvements once, with valid anchors and accurate wordCount', async () => {
    const slug = 'agua-sin-electricidad-metodos-limites';
    const post = getBlogPost(slug)!;
    const doc = new DOMParser().parseFromString(renderToStaticMarkup(await ArticlePage({ params: Promise.resolve({ slug }) })), 'text/html');
    expect(doc.querySelector('.article-original')).not.toBeNull();
    expect(doc.querySelectorAll('.editorial-text-section')).toHaveLength(growthRevisions[slug].sections.length);
    for (const link of doc.querySelectorAll('.editorial-toc a[href^="#"]')) expect(doc.getElementById(link.getAttribute('href')!.slice(1))).not.toBeNull();
    const schema = [...doc.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent!));
    expect(schema.find(item => item['@type'] === 'Article').wordCount).toBe(articleWordCount(post));
    expect(doc.querySelectorAll('.article-faq details')).toHaveLength(3);
  });
  it('keeps every article outline and short metadata usable after the revisions', async () => {
    for (const post of blogPosts) {
      const doc = new DOMParser().parseFromString(renderToStaticMarkup(await ArticlePage({ params: Promise.resolve({ slug: post.slug }) })), 'text/html');
      expect(doc.querySelectorAll('h1'), post.slug).toHaveLength(1);
      for (const link of doc.querySelectorAll('.editorial-toc a[href^="#"]')) expect(doc.getElementById(link.getAttribute('href')!.slice(1)), `${post.slug}: ${link.getAttribute('href')}`).not.toBeNull();
      const metadata = await generateMetadata({ params: Promise.resolve({ slug: post.slug }) });
      expect(metadata.description!.length, post.slug).toBeLessThanOrEqual(155);
    }
  }, 15000);
  it('publishes each step-two FAQ with matching answers, headings and unchanged canonical paths', async () => {
    for (const slug of Object.keys(stepTwoRevisions)) {
      const post = getBlogPost(slug)!;
      const doc = new DOMParser().parseFromString(renderToStaticMarkup(await ArticlePage({ params: Promise.resolve({ slug }) })), 'text/html');
      const schema = [...doc.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent!));
      const faq = schema.find(item => item['@type'] === 'FAQPage');
      expect(faq.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => ({ question: item.name, answer: item.acceptedAnswer.text })), slug).toEqual(post.faq);
      expect([...doc.querySelectorAll('.article-faq summary h3')].map(node => node.textContent), slug).toEqual(post.faq!.map(item => item.question));
      if (stepTwoRevisions[slug].preferOriginal) {
        expect(doc.querySelector('.article-original'), slug).not.toBeNull();
        expect(doc.querySelectorAll('.editorial-text-section'), slug).toHaveLength(stepTwoRevisions[slug].sections.length);
      }
      for (const item of post.faq!) expect(doc.querySelector('.article-faq')!.textContent, slug).toContain(item.answer);
      const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });
      expect(metadata.alternates?.canonical, slug).toBe(`https://www.modocrisissurvival.com/supervivencia/${slug}`);
      for (const section of stepTwoRevisions[slug].sections) {
        for (const link of section.links || []) {
          if (link.href.startsWith('/supervivencia/')) expect(getBlogPost(link.href.split('/').at(-1)!), `${slug}: ${link.href}`).toBeDefined();
        }
      }
    }
  });
  it('renders visible FAQ, matching schema, Article, Breadcrumb and licensed responsive images', async () => {
    for (const data of growthArticles) {
      const post = getBlogPost(data.slug)!;
      const markup = renderToStaticMarkup(await ArticlePage({ params: Promise.resolve({ slug: post.slug }) }));
      const doc = new DOMParser().parseFromString(markup, 'text/html');
      expect(doc.querySelectorAll('h1')).toHaveLength(1);
      const schema = [...doc.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent!));
      const faq = schema.find(item => item['@type'] === 'FAQPage');
      expect(faq.mainEntity.map((item: {name: string}) => item.name)).toEqual(post.faq!.map(item => item.question));
      for (const item of post.faq!) expect(doc.body.textContent).toContain(item.answer);
      expect(schema.some(item => item['@type'] === 'Article')).toBe(true);
      expect(schema.some(item => item['@type'] === 'BreadcrumbList')).toBe(true);
      expect(post.imageCredit?.license).toBe('CC BY 4.0');
      expect(existsSync(`public${post.imageCredit!.source}`)).toBe(true);
      expect(markup).toContain(`href="${post.imageCredit!.source}"`);
      const metadata = await generateMetadata({ params: Promise.resolve({ slug: post.slug }) });
      expect(metadata.description!.length).toBeLessThanOrEqual(155);
    }
  });
  it('keeps useful entry points indexable but excludes the personal local library', () => {
    const urls = new Set(sitemap().map(item => item.url));
    expect(urls.has('https://www.modocrisissurvival.com/empieza-aqui')).toBe(true);
    expect(urls.has('https://www.modocrisissurvival.com/cuaderno-de-campo')).toBe(true);
    expect(urls.has('https://www.modocrisissurvival.com/mi-biblioteca')).toBe(false);
    expect(libraryMetadata.robots).toEqual({ index: false, follow: true });
    expect(renderToStaticMarkup(<LibraryPage />)).toContain('Mi biblioteca');
    const workbook = renderToStaticMarkup(<WorkbookPage />);
    expect(workbook).toContain('href="/downloads/cuaderno-modo-crisis-survival.pdf"');
    expect(existsSync('public/downloads/cuaderno-modo-crisis-survival.pdf')).toBe(true);
    for (const slug of ['tormenta-electrica-montana', 'hornillo-camping-monoxido-carbono', 'ampollas-senderismo-prevencion', 'terremoto-plan-familiar']) expect(monetizationPolicy('/supervivencia/' + slug).affiliate).toBe(false);
  });
});
describe('reader retention without a tracking account', () => {
  it('disables actions before hydration and reflects storage updates from another tab', () => {
    expect(renderToStaticMarkup(<ArticleActions slug="hora-retorno-montana" title="Hora de retorno" />)).toContain('disabled');
    render(<ArticleActions slug="hora-retorno-montana" title="Hora de retorno" />);
    localStorage.setItem(savedArticlesKey, JSON.stringify(['hora-retorno-montana']));
    fireEvent(window, new StorageEvent('storage', { key: savedArticlesKey }));
    expect(screen.getByRole('button', { name: 'Guardado' }).getAttribute('aria-pressed')).toBe('true');
  });
  it('stores and removes a selected article only after the reader chooses it', () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    render(<ArticleActions slug="hora-retorno-montana" title="Hora de retorno" />);
    expect(localStorage.getItem(savedArticlesKey)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(readSavedArticles()).toEqual(['hora-retorno-montana']);
    fireEvent.click(screen.getByRole('button', { name: 'Guardado' }));
    expect(readSavedArticles()).toEqual([]); expect(fetch).not.toHaveBeenCalled();
  });
  it('ignores invalid storage and reports unavailable persistence', () => {
    localStorage.setItem(savedArticlesKey, JSON.stringify(['valid-slug', '<script>', 1, 'valid-slug']));
    expect(readSavedArticles()).toEqual(['valid-slug']);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Unavailable'); });
    render(<ArticleActions slug="hora-retorno-montana" title="Hora de retorno" />);
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.getByRole('status').textContent).toContain('no permite guardar');
    vi.restoreAllMocks();
  });
  it('only persists progress after activation and does not mix the two routes', () => {
    render(<LearningRoute />);
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    expect(localStorage.getItem('mcs-learning-progress')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Recordar mi progreso en este navegador' }));
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(JSON.parse(localStorage.getItem('mcs-learning-progress')!)).toEqual(['casa-0']);
    fireEvent.click(screen.getByRole('button', { name: 'Senderismo' }));
    expect(screen.getByRole('progressbar').getAttribute('value')).toBe('0');
    expect(screen.getAllByRole('checkbox')[0].getAttribute('checked')).toBeNull();
    expect(allContentPages.find(page => page.slug === 'cookies')!.sections?.some(section => section.body.includes('mcs-learning-progress'))).toBe(true);
  });
});
