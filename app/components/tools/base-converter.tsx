'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

const bases: {label:string;base:number}[] = [
  {label:'二进制',base:2},{label:'八进制',base:8},{label:'十进制',base:10},{label:'十六进制',base:16},
];

function getBaseLabel(b: number): string {
  switch(b) { case 2: return '二进制'; case 8: return '八进制'; case 10: return '十进制'; case 16: return '十六进制'; default: return `${b}进制`; }
}

export default function BaseConverter() {
  const { tc } = useToolI18n('base-converter');
  const [inputBase, setInputBase] = useState(10);
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string,string>>({});
  const convert = () => {
    const val = input.trim();
    if (!val) { setResults({}); return; }
    const n = parseInt(val, inputBase);
    if (isNaN(n)) { setResults({}); return; }
    const r: Record<string,string> = {};
    for (const b of bases) {
      r[b.label] = n.toString(b.base).toUpperCase();
    }
    setResults(r);
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div className={s.col}>
          <label className={s.label}>输入进制</label>
          <select className={s.select} value={inputBase} onChange={e=>{setInputBase(Number(e.target.value));setResults({});}}>
            {bases.map(b=><option key={b.base} value={b.base}>{b.label}</option>)}
          </select>
        </div>
        <div className={s.col} style={{flex:3}}>
          <label className={s.label}>输入数值（{getBaseLabel(inputBase)}）</label>
          <input className={s.input} value={input} onChange={e=>{setInput(e.target.value);}} placeholder={`输入${getBaseLabel(inputBase)}数值...`} />
        </div>
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={convert}>转换</button>
      {Object.keys(results).length > 0 && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
          {Object.entries(results).map(([label, val]) => (
            <div key={label} className={s.card}>
              <div style={{fontSize:'.75rem',color:'var(--text-sec)',marginBottom:4}}>{label}</div>
              <div style={{fontFamily:'monospace',fontWeight:600,wordBreak:'break-all'}}>{val}</div>
              <button className={`${s.btn} ${s.btnOutline}`} style={{marginTop:8,padding:'4px 10px',fontSize:'.6875rem'}} onClick={()=>navigator.clipboard.writeText(val)}>复制</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
