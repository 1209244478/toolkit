'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export default function UuidGenerator() {
  const { tc } = useToolI18n('uuid-generator');
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(false);
  const [noDash, setNoDash] = useState(false);
  const [result, setResult] = useState('');
  const generate = () => {
    const list = Array.from({length: count}, () => {
      let u = uuidv4();
      if (upper) u = u.toUpperCase();
      if (noDash) u = u.replace(/-/g, '');
      return u;
    });
    setResult(list.join('\n'));
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>数量</label><input type="number" className={s.input} min={1} max={100} value={count} onChange={e=>setCount(Number(e.target.value))} /></div>
        <div className={s.col} style={{display:'flex',flexDirection:'column',gap:8,justifyContent:'flex-end'}}>
          <label style={{display:'flex',alignItems:'center',gap:6,fontSize:'.8125rem',cursor:'pointer'}}><input type="checkbox" className={s.checkbox} checked={upper} onChange={e=>setUpper(e.target.checked)} /> 大写</label>
          <label style={{display:'flex',alignItems:'center',gap:6,fontSize:'.8125rem',cursor:'pointer'}}><input type="checkbox" className={s.checkbox} checked={noDash} onChange={e=>setNoDash(e.target.checked)} /> 无连字符</label>
        </div>
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={generate}>生成</button>
      <div className={s.col}>
        <label className={s.label}>结果</label>
        <div className={s.outputWrap}><div className={s.output}>{result}</div>
        {result && <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(result)}>复制</button>}</div>
      </div>
    </div>
  );
}
