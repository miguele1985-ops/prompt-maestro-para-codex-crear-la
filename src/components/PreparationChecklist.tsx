"use client";
import { useState } from "react";
import { Download, Printer, RotateCcw } from "lucide-react";
const items = [
  "Acordar un punto de encuentro y un contacto fuera de la zona",
  "Anotar teléfonos importantes en papel",
  "Localizar documentación y copias necesarias",
  "Revisar medicación personal y necesidades de cada miembro",
  "Comprobar linternas, pilas y cargadores",
  "Preparar agua potable y recipientes adecuados a tu plan",
  "Revisar alimentos habituales listos para consumir y caducidades",
  "Comprobar el botiquín y reponer lo utilizado",
  "Preparar abrigo y calzado adecuados a la estación",
  "Incluir las necesidades de menores, dependientes y mascotas",
  "Probar el peso de la mochila en un recorrido seguro",
  "Revisar mapas descargados y acordar cuándo repetir la revisión",
];
export function PreparationChecklist() {
  const [checked, setChecked] = useState<string[]>([]);
  function download() {
    const text =
      "Plan básico de preparación\n\n" +
      items.map((t) => `${checked.includes(t) ? "[x]" : "[ ]"} ${t}`).join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "checklist-preparacion.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <section className="preparation-checklist">
      <p role="status">
        {checked.length} de {items.length} tareas revisadas
      </p>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <label>
              <input
                type="checkbox"
                checked={checked.includes(item)}
                onChange={(e) =>
                  setChecked(
                    e.target.checked ? [...checked, item] : checked.filter((t) => t !== item),
                  )
                }
              />
              {item}
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
        <button onClick={() => setChecked([])}>
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
