"use client";
import Link from 'next/link';
import { House, Mountain, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { learningRoutes } from '@/content/growth-routes';
const key = 'mcs-learning-progress';
export function LearningRoute() {
  const [routeId, setRouteId] = useState('casa');
  const [checked, setChecked] = useState<string[]>([]);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('');
  const route = learningRoutes.find(item => item.id === routeId)!;
  function activate() {
    try { const saved = JSON.parse(localStorage.getItem(key) || '[]'); const allowed = new Set(learningRoutes.flatMap(item => item.steps.map((_, i) => `${item.id}-${i}`))); setChecked(Array.isArray(saved) ? [...new Set(saved.filter(item => typeof item === 'string' && allowed.has(item)))] : []); setActive(true); }
    catch { setActive(true); setStatus('Puedes marcar pasos durante esta visita, pero el navegador no permite recordarlos.'); }
  }
  function toggle(id: string) {
    const next = checked.includes(id) ? checked.filter(item => item !== id) : [...checked, id];
    setChecked(next);
    try { localStorage.setItem(key, JSON.stringify(next)); }
    catch { setStatus('La selección solo se conservará durante esta visita.'); }
  }
  const done = route.steps.filter((_, i) => checked.includes(`${route.id}-${i}`)).length;
  return <section className="learning-route"><div className="learning-tabs" role="group" aria-label="Elegir recorrido"><button type="button" aria-pressed={routeId === 'casa'} onClick={() => setRouteId('casa')}><House size={20} aria-hidden />Casa y familia</button><button type="button" aria-pressed={routeId === 'sendero'} onClick={() => setRouteId('sendero')}><Mountain size={20} aria-hidden />Senderismo</button></div><h2>{route.title}</h2><p>{route.intro}</p>{active ? <><p>{done} de 7 pasos completados</p><progress max={7} value={done} aria-label="Progreso del recorrido" /></> : <button type="button" className="learning-save" onClick={activate}>Recordar mi progreso en este navegador</button>}<ol>{route.steps.map((step, i) => <li key={step.href}><span className="learning-day">Día {i + 1}</span><div><h3><Link href={step.href}>{step.title}</Link></h3><p>{step.task}</p></div>{active ? <label><input type="checkbox" checked={checked.includes(`${route.id}-${i}`)} onChange={() => toggle(`${route.id}-${i}`)} />Completado</label> : null}</li>)}</ol>{active ? <button type="button" title="Reiniciar este recorrido" onClick={() => { const next = checked.filter(item => !item.startsWith(route.id + '-')); setChecked(next); try { localStorage.setItem(key, JSON.stringify(next)); } catch { setStatus('No se pudo guardar el cambio.'); } }}><RotateCcw size={17} aria-hidden />Reiniciar recorrido</button> : null}<p role="status">{status}</p><p>Estos ejercicios son preventivos. No los realices durante una emergencia activa ni pongas en riesgo comunicaciones, suministros o personas.</p></section>;
}
