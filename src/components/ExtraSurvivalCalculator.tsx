'use client';
import { useState } from 'react';
import { Calculator, RotateCcw, Undo2, Wind } from 'lucide-react';
import { convertUnit, labelDose, solarYield, unitGroups } from '@/lib/extra-calculators';

const fmt = (n: number) => n.toLocaleString('es-ES', {maximumFractionDigits: 3});
export function ExtraSurvivalCalculator({ kind }: { kind: string }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [checks, setChecks] = useState<string[]>([]);
  const [group, setGroup] = useState('Volumen');
  const [pulses, setPulses] = useState('');
  const [columns, setColumns] = useState('3');
  const [wind, setWind] = useState('0');
  const [error, setError] = useState('');
  function reset() { setValues({}); setResult(''); setChecks([]); setPulses(''); setColumns('3'); setWind('0'); setGroup('Volumen'); setError(''); }
  const change = (key: string, value: string) => { setValues(v => ({...v, [key]: value})); setResult(''); setError(''); };
  const fields: [string, string, string, number, number][] = kind === 'solar' ? [
    ['area','Superficie captadora (m²)','0.5',.001,10000], ['sun','Irradiancia supuesta (W/m²)','650',0,1500], ['hours','Horas de sol equivalentes','6',0,24], ['eff','Eficiencia supuesta (%)','33',.1,100],
  ] : kind === 'chemical' ? [
    ['litres','Agua a tratar (L)','2',.001,10000], ['batch','Litros indicados en la etiqueta','1',.001,10000], ['dose','Cantidad indicada en la etiqueta','1',.001,10000], ['wait','Tiempo de contacto indicado (min)','30',1,10080],
  ] : kind === 'river' ? [['distance','Distancia del ejemplo (m)','10',.01,10000],['seconds','Tiempo del ejemplo (s)','20',.01,10000]] : [];
  const get = (key: string) => values[key] ?? fields.find(f => f[0] === key)?.[2] ?? '';
  function number(key: string) { const raw = get(key); if (!raw.trim() || !Number.isFinite(Number(raw))) throw new Error('Completa los campos con números válidos.'); return Number(raw); }
  const numeric = ['solar','chemical','river','converter'].includes(kind);
  const symptoms = ['Temblores, piel muy fría o palidez', 'Confusión, somnolencia o habla arrastrada', 'Respiración lenta o deterioro del estado', 'No responde o no respira normalmente'];
  return <section className="survival-calculator extra-tool" id="calculadora">
    <h2>{kind === 'hypothermia' ? 'Signos observables' : kind === 'smoke' ? 'Simulador visual' : kind === 'whistle' ? 'Pulsos de silbato' : 'Calcula con tus datos'}</h2>
    {kind === 'chemical' && <p>Traslada únicamente la pauta del producto autorizado para agua de bebida. No hay una dosis universal. No uses esta operación para contaminación química ni cambies el tiempo o condiciones de la etiqueta. <a href="https://www.cdc.gov/water-emergency/about/index.html">Consultar recomendaciones de CDC</a>.</p>}
    {kind === 'solar' && <p>Modelo energético idealizado, no una predicción de agua potable. La irradiancia se introduce como supuesto: no se deduce de la temperatura ambiente.</p>}
    {kind === 'river' && <p>No cruces una corriente o zona inundada. Esta operación solo ilustra distancia ÷ tiempo; no evalúa si un vadeo es seguro. No entres en el agua ni te acerques para medir. <a href="https://www.weather.gov/safety/flood-turn-around-dont-drown">Seguridad ante inundaciones, NWS</a>.</p>}
    {numeric && <form onSubmit={e => {e.preventDefault(); setError(''); setResult(''); try {
      if (kind === 'solar') setResult(`${fmt(solarYield(number('area'), number('sun'), number('hours'), number('eff')))} L teóricos. No garantiza rendimiento, disponibilidad ni potabilidad. Modelo: W/m² × m² × horas × 3600 × eficiencia ÷ 2.260.000 J/kg; densidad aproximada 1 kg/L.`);
      if (kind === 'chemical') { if (!checks.includes('label')) throw new Error('Confirma que has leído y comprobado la etiqueta.'); const dose = labelDose(number('litres'),number('batch'),number('dose')); setResult(`${fmt(dose)} ${values.unit || 'mL'} según la proporción introducida. Tiempo mínimo introducido: ${fmt(number('wait'))} min. No es una pauta sanitaria validada. No fracciones pastillas si el fabricante no lo permite ni interpretes el resultado como autorización para beber.`); }
      if (kind === 'river') { if(number('seconds')<=0 || number('distance')<0) throw new Error('Revisa distancia y tiempo.'); setResult(`${fmt(number('distance')/number('seconds'))} m/s en el ejemplo. No determina profundidad, estabilidad, caudal ni seguridad. Busca una alternativa autorizada o retrocede.`); }
      if (kind === 'converter') { const units = Object.keys(unitGroups[group]); const raw = values.amount ?? '1'; if(!raw.trim()) throw new Error('Introduce una cantidad.'); const to=values.to || units[1]; setResult(`${fmt(convertUnit(Number(raw),group,values.from || units[0],to))} ${to}`); }
    } catch(err) {setError(err instanceof Error ? err.message : 'Revisa los datos.');}}}>
      <div className="calculator-fields">{fields.map(([key,label,initial,min,max])=><label key={key}>{label}<input type="number" required min={min} max={max} step="any" value={values[key] ?? initial} onChange={e=>change(key,e.target.value)} /></label>)}
      {kind === 'chemical' && <label>Unidad de la etiqueta<select value={values.unit || 'mL'} onChange={e=>change('unit',e.target.value)}><option>mL</option><option>pastillas</option></select></label>}
      {kind === 'converter' && <><label>Magnitud<select value={group} onChange={e=>{setGroup(e.target.value);setValues({});setResult('');setError('');}}>{Object.keys(unitGroups).map(g=><option key={g}>{g}</option>)}</select></label><label>Cantidad<input type="number" step="any" required value={values.amount ?? '1'} onChange={e=>change('amount',e.target.value)} /></label>{(['from','to'] as const).map((key,i)=><label key={key}>{i ? 'A' : 'De'}<select value={values[key] || Object.keys(unitGroups[group])[i]} onChange={e=>change(key,e.target.value)}>{Object.keys(unitGroups[group]).map(u=><option key={u}>{u}</option>)}</select></label>)}</>}
      </div>
      {kind === 'chemical' && <label className="tool-check"><input type="checkbox" checked={checks.includes('label')} onChange={e=>{setChecks(e.target.checked?['label']:[]);setResult('');}} /> He comprobado producto, dosis, tiempo y condiciones en la etiqueta.</label>}
      <div className="calculator-buttons"><button type="submit"><Calculator size={18} aria-hidden /> Calcular</button></div>
    </form>}
    {kind === 'hypothermia' && <>
      <p>Si sospechas hipotermia, solicita ayuda al 112. No esperes a completar la lista. Si no responde o no respira normalmente, llama de inmediato y sigue las instrucciones del operador.</p>
      {symptoms.map(s=><label className="tool-check" key={s}><input type="checkbox" checked={checks.includes(s)} onChange={e=>setChecks(c=>e.target.checked?[...c,s]:c.filter(v=>v!==s))} />{s}</label>)}
      <div className="calculator-result" role="status">{checks.length ? `${checks.length} signos anotados para comunicar a emergencias. No permiten clasificar la gravedad ni confirmar un diagnóstico.` : 'Sin signos seleccionados. Esto no descarta hipotermia.'}</div>
      <p>Busca abrigo seguro, retira ropa mojada y cubre con material seco. No frotes extremidades, no uses calor intenso directo y no des alcohol. <a href="https://www.nhs.uk/conditions/hypothermia/">Referencia sanitaria: NHS</a>.</p>
    </>}
    {kind === 'whistle' && <><p>Introduce cortos y largos para comparar el patrón. No graba audio ni avisa a rescate.</p><div className="calculator-buttons"><button type="button" disabled={pulses.length>=9} onClick={()=>setPulses(p=>p+'.')}>· Corto</button><button type="button" disabled={pulses.length>=9} onClick={()=>setPulses(p=>p+'-')}>− Largo</button><button type="button" aria-label="Quitar último pulso" title="Quitar último pulso" onClick={()=>setPulses(p=>p.slice(0,-1))}><Undo2 size={18} /></button></div><output className="pulse-output">{pulses || 'Sin pulsos'}</output><p role="status">{pulses==='...---...' ? 'Coincide con SOS en Morse. La interpretación exige reconocer también el ritmo y las pausas.' : pulses ? 'No se identifica un mensaje universal solo con esta secuencia. Los códigos del grupo deben acordarse antes.' : 'Corto: una unidad. Largo: tres unidades.'}</p><p>No practiques señales de socorro audibles en lugares donde puedan confundirse con una emergencia. <a href="/codigo-morse">Consultar el código Morse</a>.</p></>}
    {kind === 'smoke' && <><p>Práctica en pantalla, sin encender fuego. Las columnas no garantizan un significado universal ni que alguien reciba el mensaje.</p><div className="calculator-fields"><label>Columnas<select value={columns} onChange={e=>setColumns(e.target.value)}>{[1,2,3,4].map(n=><option key={n} value={n}>{n}</option>)}</select></label><label>Viento ilustrativo<select value={wind} onChange={e=>setWind(e.target.value)}><option value="0">Sin viento</option><option value="12">Suave</option><option value="25">Fuerte</option></select></label></div><div className="smoke-practice" aria-label={`${columns} columnas de humo, simulación`} role="img">{Array.from({length:Number(columns)},(_,i)=><Wind key={i} size={64} style={{transform:`skewX(-${wind}deg)`}} aria-hidden />)}</div><p>No quemes neumáticos, aceites, plásticos ni otros residuos para hacer señales. Evita generar un incendio; utiliza medios seguros y contacta con emergencias cuando sea posible.</p></>}
    {error && <p role="alert" className="calculator-error">{error}</p>}
    {result && <div role="status" className="calculator-result">{result}</div>}
    <div className="calculator-buttons"><button type="button" onClick={reset}><RotateCcw size={18} aria-hidden /> Restablecer</button></div>
  </section>;
}
