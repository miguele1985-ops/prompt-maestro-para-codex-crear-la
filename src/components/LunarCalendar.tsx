'use client';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { lunarMonth } from '@/lib/lunar';
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
    <p role="status">{active ? `Día ${active.day}: ${active.phase}. Fracción iluminada: ${active.illumination}%.` : 'Preparando calendario…'}</p>
  </section>;
}
