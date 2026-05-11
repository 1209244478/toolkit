'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

const categories = [
  { label:'长度', units: [{name:'米',factor:1},{name:'厘米',factor:0.01},{name:'毫米',factor:0.001},{name:'千米',factor:1000},{name:'英寸',factor:0.0254},{name:'英尺',factor:0.3048},{name:'英里',factor:1609.344}]},
  { label:'重量', units: [{name:'千克',factor:1},{name:'克',factor:0.001},{name:'毫克',factor:0.000001},{name:'磅',factor:0.453592},{name:'盎司',factor:0.0283495}]},
  { label:'温度', units: [{name:'摄氏度',factor:1},{name:'华氏度',factor:1},{name:'开尔文',factor:1}]},
  { label:'面积', units: [{name:'平方米',factor:1},{name:'平方千米',factor:1e6},{name:'平方厘米',factor:1e-4},{name:'公顷',factor:1e4},{name:'亩',factor:666.667}]},
  { label:'体积', units: [{name:'升',factor:1},{name:'毫升',factor:0.001},{name:'立方米',factor:1000},{name:'加仑',factor:3.78541},{name:'品脱',factor:0.473176},{name:'杯',factor:0.236588}]},
];

export default function UnitConverter() {
  const { tc } = useToolI18n('unit-converter');
  const [catIdx, setCatIdx] = useState(0);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [value, setValue] = useState('');
  const cat = categories[catIdx];
  const result = useMemo(() => {
    const n = Number(value);
    if (isNaN(n)) return '';
    if (cat.label === '温度') {
      let celsius = n;
      if (fromIdx === 1) celsius = (n - 32) * 5/9;
      else if (fromIdx === 2) celsius = n - 273.15;
      if (toIdx === 0) return celsius.toFixed(4);
      if (toIdx === 1) return (celsius * 9/5 + 32).toFixed(4);
      return (celsius + 273.15).toFixed(4);
    }
    const base = n * cat.units[fromIdx].factor;
    return (base / cat.units[toIdx].factor).toFixed(6);
  }, [value, fromIdx, toIdx, catIdx]);
  return (
    <div className={s.toolContainer}>
      <div className={s.btnGroup}>
        {categories.map((c,i) => (
          <button key={c.label} className={`${s.btn} ${i===catIdx?s.btnPrimary:s.btnOutline}`} onClick={()=>{setCatIdx(i);setFromIdx(0);setToIdx(1);}}>{c.label}</button>
        ))}
      </div>
      <div className={s.row}>
        <div className={s.col}>
          <label className={s.label}>从</label>
          <select className={s.select} value={fromIdx} onChange={e=>setFromIdx(Number(e.target.value))}>
            {cat.units.map((u,i) => <option key={i} value={i}>{u.name}</option>)}
          </select>
          <input className={s.input} style={{marginTop:8}} type="number" value={value} onChange={e=>setValue(e.target.value)} placeholder="输入数值" />
        </div>
        <div style={{display:'flex',alignItems:'center',fontSize:'1.5rem',color:'var(--text-sec)',paddingTop:24}}>→</div>
        <div className={s.col}>
          <label className={s.label}>到</label>
          <select className={s.select} value={toIdx} onChange={e=>setToIdx(Number(e.target.value))}>
            {cat.units.map((u,i) => <option key={i} value={i}>{u.name}</option>)}
          </select>
          <div className={s.output} style={{marginTop:8}}>{result}</div>
        </div>
      </div>
    </div>
  );
}
