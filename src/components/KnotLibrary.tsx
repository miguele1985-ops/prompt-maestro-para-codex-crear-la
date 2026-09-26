"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { knotLibrary } from "@/content/mobile-field-library";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function KnotLibrary() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("Todos");
  const items = knotLibrary.filter((knot) => (group === "Todos" || knot.group === group) && normalize(`${knot.name} ${knot.purpose} ${knot.group}`).includes(normalize(query)));
  return <>
    <div className="editorial-filters">
      <label><Search size={20} aria-hidden /><span className="sr-only">Buscar nudo</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre o función del nudo" /></label>
      <label>Función<select value={group} onChange={(event) => setGroup(event.target.value)}>{["Todos", ...new Set(knotLibrary.map((item) => item.group))].map((value) => <option key={value}>{value}</option>)}</select></label>
    </div>
    <p className="editorial-count" role="status">{items.length} de {knotLibrary.length} fichas</p>
    {!items.length ? <p>No hay coincidencias. Prueba otro nombre o selecciona todas las funciones.</p> : null}
    <div className="knot-library-grid">{items.map((knot) => <article id={knot.id} key={knot.id}>
      <span className="journal-kicker">{knot.group}</span><h2>{knot.name}</h2><p>{knot.purpose}</p>
      <h3>Qué no debes dar por hecho</h3><p>{knot.limit}</p>
    </article>)}</div>
  </>;
}
