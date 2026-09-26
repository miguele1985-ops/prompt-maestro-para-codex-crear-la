"use client";
import { useState } from "react";
import { Download, Printer, RotateCcw } from "lucide-react";
import lists from "@/content/mobile-checklists.json";
export function PreparationChecklist() {
  const [selected, setSelected] = useState("family-plan");
  const [checked, setChecked] = useState<string[]>([]);
  const list = lists.find((entry) => entry.id === selected)!;
  const items = list.items;
  const completed = items.filter((item) => checked.includes(item.id)).length;
  function download() {
    const text =
      list.title + "\nPreparación previa: adapta la lista a tus necesidades.\n\n" +
      items.map((t) => `${checked.includes(t.id) ? "[x]" : "[ ]"} ${t.text}`).join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `checklist-${list.id}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="preparation-checklist">
      <label className="checklist-select">Lista de preparación
        <select value={selected} onChange={(event) => setSelected(event.target.value)}>
          {lists.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}
        </select>
      </label>
      <h2>{list.title}</h2>
      <p role="status">
        {completed} de {items.length} tareas revisadas
      </p>
      <progress className="checklist-progress" value={completed} max={items.length} aria-label="Tareas revisadas" />
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={checked.includes(item.id)}
                onChange={(e) =>
                  setChecked(
                    e.target.checked ? [...checked, item.id] : checked.filter((t) => t !== item.id),
                  )
                }
              />
              {item.text}
            </label>
          </li>
        ))}
      </ul>
      <div className="calculator-buttons">
        <button onClick={download}>
          <Download size={18} aria-hidden /> Descargar lista
        </button>
        <button onClick={() => window.print()}>
          <Printer size={18} aria-hidden /> Imprimir
        </button>
        <button onClick={() => setChecked(checked.filter((id) => !items.some((item) => item.id === id)))}>
          <RotateCcw size={18} aria-hidden /> Desmarcar
        </button>
      </div>
      <p>
        Las marcas solo se mantienen mientras esta página está abierta. Descarga tu copia antes de
        cerrar.
      </p>
    </section>
  );
}
