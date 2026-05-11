'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function PercentageCalc() {
  const { tc } = useToolI18n('percentage-calc');
  const [mode, setMode] = useState<'basic'|'change'|'of'>('basic');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const result = useMemo(() => {
    const na = Number(a), nb = Number(b);
    if (isNaN(na) || isNaN(nb)) return '';
    switch(mode) {
      case 'basic': return `${na} 的 ${nb}% = ${(na * nb / 100).toFixed(2)}`;
      case 'change': return na === 0 ? '除数不能为零' : `${na} → ${nb}，变化率 = ${((nb - na) / na * 100).toFixed(2)}%`;
      case 'of': return nb === 0 ? '除数不能为零' : `${na} 是 ${nb} 的 ${(na / nb * 100).toFixed(2)}%`;
    }
  }, [a, b, mode]);
  return (
    <div className={s.toolContainer}>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${mode==='basic'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMode('basic')}>X 的 Y%</button>
        <button className={`${s.btn} ${mode==='change'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMode('change')}>变化率</button>
        <button className={`${s.btn} ${mode==='of'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMode('of')}>X 是 Y 的 %</button>
      </div>
      <div className={s.row}>
        <div className={s.col}>
          <label className={s.label}>{mode==='change'?'原始值':'数值 A'}</label>
          <input type="number" className={s.input} value={a} onChange={e=>setA(e.target.value)} />
        </div>
        <div className={s.col}>
          <label className={s.label}>{mode==='change'?'新值':'数值 B'}</label>
          <input type="number" className={s.input} value={b} onChange={e=>setB(e.target.value)} />
        </div>
      </div>
      {result && <div className={s.card} style={{textAlign:'center',fontSize:'1.125rem',fontWeight:600,color:'var(--accent)'}}>{result}</div>}
    </div>
  );
}
