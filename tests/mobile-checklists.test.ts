import { describe, expect, it } from "vitest";
import lists from "../src/content/mobile-checklists.json";
import review from "../docs/mobile-checklists-review.json";

describe("reviewed mobile checklists", () => {
  it("imports sixteen complete lists with unique task IDs", () => {
    expect(lists).toHaveLength(16);
    const tasks = lists.flatMap(list => list.items);
    expect(tasks).toHaveLength(review.tasks);
    expect(new Set(tasks.map(task => task.id)).size).toBe(tasks.length);
    for (const list of lists) expect(list.items.length).toBeGreaterThan(5);
  });
  it("removes blanket medication and unsafe electrical advice", () => {
    const tasks = lists.flatMap(list => list.items);
    expect(tasks.some(task => task.id === 'fa-10')).toBe(false);
    expect(tasks.find(task => task.id === 'fl-1')?.text).toContain('no tocar');
    expect(tasks.find(task => task.id === 'ck-1')?.text).toContain('V16');
    expect(review.sha256).toMatch(/^[a-f0-9]{64}$/);
  });
});
