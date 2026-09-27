import { describe, expect, it } from "vitest";
import { MORSE, translateMorse } from "../src/lib/morse";
describe("Morse", () => {
  it("round trips every supported symbol", () => {
    for (const letter of Object.keys(MORSE)) expect(translateMorse(translateMorse(letter).output, true).output).toBe(letter);
    expect(new Set(Object.values(MORSE)).size).toBe(36);
  });
  it("preserves words and normalizes whitespace", () => {
    expect(translateMorse(' hola  123 ').output).toBe('.... --- .-.. .- / .---- ..--- ...--');
    expect(translateMorse('.... --- .-.. .-/ .----', true).output).toBe('HOLA 1');
    expect(translateMorse('   ', true).output).toBe('');
  });
  it("does not silently discard unsupported characters", () => {
    expect(translateMorse('Ñ').unknown).toEqual(['Ñ']);
    expect(translateMorse('.......', true).unknown).toEqual(['.......']);
    expect(MORSE['7']).toBe('--...');
    expect(MORSE.O).toBe('---');
  });
});
