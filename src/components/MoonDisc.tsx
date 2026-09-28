'use client';
import { useEffect, useRef } from 'react';

export function MoonDisc({ fraction, waning, label }: { fraction: number; waning: boolean; label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;
    const size = 240;
    const pixels = ctx.createImageData(size, size);
    const zLight = 2 * fraction - 1;
    const xLight = Math.sqrt(Math.max(0, 1 - zLight * zLight)) * (waning ? -1 : 1);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const nx = (x + .5 - size / 2) / (size / 2), ny = (y + .5 - size / 2) / (size / 2);
      const radius = nx * nx + ny * ny;
      if (radius > 1) continue;
      const lit = nx * xLight + Math.sqrt(1 - radius) * zLight > 0;
      const value = lit ? Math.round(220 + 20 * Math.sqrt(1 - radius)) : 28;
      const i = (y * size + x) * 4;
      pixels.data.set([value, value, lit ? value - 10 : value + 4, 255], i);
    }
    ctx.putImageData(pixels, 0, 0);
  }, [fraction, waning]);
  return <canvas className="moon-disc" ref={canvas} width={240} height={240} role="img" aria-label={label}>{label}</canvas>;
}
