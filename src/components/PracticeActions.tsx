"use client";
import { useState } from "react";
import { Download, Printer, RotateCcw } from "lucide-react";
export function PracticeActions({title,tasks,slug}:{title:string;tasks:string[];slug:string}) {
  const [done,setDone]=useState<number[]>([]);
  function download() {
    const text=`${title}\nLista de preparación, no certificación de seguridad.\n\n${tasks.map((task,i)=>`${done.includes(i)?'[x]':'[ ]'} ${task}`).join('\n')}`;
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download=`${slug}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <section className="preparation-checklist"><h2>Tu próxima acción</h2>
    <p role="status">{done.length} de {tasks.length} acciones revisadas</p>
    <ul>{tasks.map((task,i)=><li key={task}><label><input type="checkbox" checked={done.includes(i)} onChange={event=>setDone(previous=>event.target.checked?[...previous,i]:previous.filter(value=>value!==i))} />{task}</label></li>)}</ul>
    <div className="calculator-buttons"><button onClick={download}><Download size={18} aria-hidden /> Descargar lista</button><button onClick={()=>window.print()}><Printer size={18} aria-hidden /> Imprimir</button><button onClick={()=>setDone([])}><RotateCcw size={18} aria-hidden /> Desmarcar</button></div>
    <p>Las marcas se mantienen solo mientras esta página está abierta. Descarga tu copia antes de salir.</p>
  </section>;
}
