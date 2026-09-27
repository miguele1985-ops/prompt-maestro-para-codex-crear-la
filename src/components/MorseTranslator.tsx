"use client";
import { useState } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { MORSE, translateMorse } from "@/lib/morse";

export function MorseTranslator() {
  const [decode, setDecode] = useState(false);
  const [input, setInput] = useState("HOLA 123");
  const [status, setStatus] = useState("");
  const result = translateMorse(input, decode);
  return <section className="morse-workbench" aria-label="Traductor Morse">
    <div className="morse-modes" role="group" aria-label="Conversión">
      {[false, true].map(mode => <button key={String(mode)} type="button" aria-pressed={decode === mode} onClick={() => { setDecode(mode); setInput(""); setStatus(""); }}>{mode ? "Morse a texto" : "Texto a Morse"}</button>)}
    </div>
    <label htmlFor="morse-input">{decode ? "Código Morse" : "Texto (A-Z y 0-9)"}</label>
    <textarea id="morse-input" rows={4} maxLength={2000} value={input} spellCheck={false} onChange={e => { setInput(e.target.value); setStatus(""); }} />
    <h2>Resultado</h2>
    <output className="morse-output" aria-live="polite">{result.output || "—"}</output>
    {result.unknown.length > 0 && <p role="alert">Símbolos no reconocidos: {result.unknown.join(", ")}. Aparecen como ? en el resultado.</p>}
    <div className="morse-actions">
      <button type="button" aria-label="Copiar resultado" title="Copiar resultado" disabled={!result.output || !!result.unknown.length} onClick={async () => {
        try { await navigator.clipboard.writeText(result.output); setStatus("Resultado copiado."); }
        catch { setStatus("No se pudo copiar. Puedes seleccionar el resultado."); }
      }}><Copy aria-hidden size={20} /></button>
      <button type="button" aria-label="Limpiar" title="Limpiar" onClick={() => { setInput(""); setStatus(""); }}><RotateCcw aria-hidden size={20} /></button>
    </div>
    <p role="status">{status}</p>
    <h2>Alfabeto y números</h2>
    <dl className="morse-alphabet">{Object.entries(MORSE).map(([letter, code]) => <div key={letter}><dt>{letter}</dt><dd>{code}</dd></div>)}</dl>
  </section>;
}
