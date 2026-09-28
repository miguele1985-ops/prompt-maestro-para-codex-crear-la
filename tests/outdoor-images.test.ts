import { it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { outdoorArticles } from '../src/content/outdoor-articles';
it('uses distinct generated covers and app artwork, not app screenshots',()=>{
  expect(outdoorArticles[0].image).not.toBe(outdoorArticles[1].image);
  for(const post of outdoorArticles){
    const images=[post.image,...post.sections.flatMap(s=>s.image?[s.image.src]:[])];
    expect(images).toHaveLength(2);
    for(const src of images){expect(src).not.toContain('/screenshots/');expect(existsSync(`public${src}`)).toBe(true);for(const w of [360,576,960,1200])expect(existsSync(`public${src.replace('.jpg',`-${w}.webp`)}`)).toBe(true);}
  }
});
