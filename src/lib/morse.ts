// A-Z and digits reused from MorseOfflineBlock.jsx; ITU-R M.1677-1.
export const MORSE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
  H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
  O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-',
  V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
};
const reverse = Object.fromEntries(Object.entries(MORSE).map(([text, code]) => [code, text]));
export function translateMorse(input: string, decode = false) {
  const unknown = new Set<string>();
  const normalized = input.trim().toUpperCase();
  const output = decode
    ? normalized.split(/\s*\/\s*/).map(word => word.split(/\s+/).filter(Boolean).map(code => {
        if (reverse[code]) return reverse[code];
        unknown.add(code); return '?';
      }).join('')).join(' ')
    : normalized.split(/\s+/).filter(Boolean).map(word => Array.from(word).map(char => {
        if (MORSE[char]) return MORSE[char];
        unknown.add(char); return '?';
      }).join(' ')).join(' / ');
  return { output, unknown: [...unknown] };
}
