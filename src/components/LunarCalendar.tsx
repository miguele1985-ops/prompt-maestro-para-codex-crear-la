'use client';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { lunarMonth, nextLunarPhases } from '@/lib/lunar';
import { MoonDisc } from './MoonDisc';
export function LunarCalendar() {
  const [month, setMonth] = useState('');
  const [selected, setSelected] = useState(1);
  useEffect(() => { const now = new Date(); setMonth(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`); setSelected(now.getDate()); }, []);
  const days = lunarMonth(month);
  const active = days.find(d=>d.day===selected) || days[0];
  function move(delta:number) { const [y,m]=month.split('-').map(Number); const d=new Date(Date.UTC(y,m-1+delta,1)); setMonth(`${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`); setSelected(1); }
  return <section className="lunar-tool" aria-label="Calendario lunar">
    <div className="lunar-toolbar"><button type="button" aria-label="Mes anterior" title="Mes anterior" disabled={!days.length || month==='1900-01'} onClick={()=>move(-1)}><ChevronLeft aria-hidden /></button>
      <label>Mes<input type="month" min="1900-01" max="2100-12" value={month} onChange={e=>{setMonth(e.target.value);setSelected(1);}} /></label>
      <button type="button" aria-label="Mes siguiente" title="Mes siguiente" disabled={!days.length || month==='2100-12'} onClick={()=>move(1)}><ChevronRight aria-hidden /></button></div>
    {month && !days.length && <p role="alert">Selecciona un mes entre 1900 y 2100.</p>}
    <div className="lunar-days">{['L','M','X','J','V','S','D'].map(d=><span key={d} aria-hidden>{d}</span>)}
      {days.map(d=><button type="button" key={d.day} style={d.day===1?{gridColumnStart:d.weekday+1}:undefined} aria-pressed={active?.day===d.day} aria-label={`${d.day}: ${d.phase}, ${d.illumination}% iluminada`} onClick={()=>setSelected(d.day)}><strong>{d.day}</strong><span>{d.illumination}%</span></button>)}
    </div>
    {active ? <div className="lunar-detail" aria-live="polite">
      <div className="lunar-phase-heading"><MoonDisc fraction={active.fraction} waning={active.phaseValue > .5} label={`Luna ${active.phase.toLowerCase()}, ${active.illumination}% iluminada`} /><div><time dateTime={active.date}>{new Date(active.date).toLocaleDateString('es-ES', {dateStyle:'long',timeZone:'UTC'})}</time><h2>Luna {active.phase.toLowerCase()}</h2><p>{active.phaseValue < .5 ? 'En fase creciente' : 'En fase menguante'}</p></div></div>
      <dl className="lunar-facts"><div><dt>Iluminación</dt><dd>{active.illumination}%</dd></div><div><dt>Edad lunar aproximada</dt><dd>{active.age.toFixed(1).replace('.',',')} días</dd></div></dl>
      <div className="lunar-next">{nextLunarPhases(active.date).map(p=><div key={p.name}><h3>Próxima {p.name.toLowerCase()}</h3><strong>En unos {p.days} días</strong><p>{new Date(p.date).toLocaleDateString('es-ES',{day:'numeric',month:'long',timeZone:'UTC'})}</p></div>)}</div>
      <p className="lunar-caveat">Esquema orientado al hemisferio norte, no una fotografía. Datos aproximados a las 12:00 UTC. No indican horas de luz nocturna ni salida de la Luna: dependen del lugar, el horizonte y el tiempo.</p>
    </div> : <p role="status">Preparando calendario…</p>}
  </section>;
}
