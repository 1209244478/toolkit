'use client';
import { useState, useEffect } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function Timestamp() {
  const { tc } = useToolI18n('timestamp');
  const [tsInput, setTsInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [now, setNow] = useState(() => {
    const d = new Date();
    return { ts: Math.floor(d.getTime()/1000), tsMs: d.getTime(), date: d.toLocaleString('zh-CN') };
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNow({ ts: Math.floor(d.getTime()/1000), tsMs: d.getTime(), date: d.toLocaleString('zh-CN') });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const tsToDate = (ts: string) => {
    const n = Number(ts);
    if (isNaN(n)) return '无效时间戳';
    const d = new Date(n > 1e12 ? n : n * 1000);
    return d.toLocaleString('zh-CN', { year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false });
  };
  const dateToTs = (date: string) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '无效日期';
    return `秒: ${Math.floor(d.getTime()/1000)}\n毫秒: ${d.getTime()}`;
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.card} style={{textAlign:'center',marginBottom:8,position:'relative'}}>
        <button
          onClick={() => navigator.clipboard.writeText(String(now.ts))}
          style={{position:'absolute',top:8,right:12,background:'none',cursor:'pointer',color:'var(--text-sec)',fontSize:'.75rem',padding:'2px 8px',borderRadius:'var(--radius-xs)',border:'1px solid var(--border-soft)'}}
        >
          复制
        </button>
        <div style={{fontSize:'.75rem',color:'var(--text-sec)'}}>当前时间</div>
        <div style={{fontSize:'1.5rem',fontWeight:600,color:'var(--accent)',letterSpacing:'-0.02em'}}>{now.ts}</div>
        <div style={{fontSize:'.8125rem',color:'var(--text-sec)'}}>{now.date}</div>
      </div>
      <div className={s.col}>
        <label className={s.label}>时间戳 → 日期</label>
        <input className={s.input} value={tsInput} onChange={e=>setTsInput(e.target.value)} placeholder="输入 Unix 时间戳..." />
        {tsInput && <div className={s.output}>{tsToDate(tsInput)}</div>}
      </div>
      <div className={s.col}>
        <label className={s.label}>日期 → 时间戳</label>
        <input type="datetime-local" className={s.input} value={dateInput} onChange={e=>setDateInput(e.target.value)} />
        {dateInput && <div className={s.output}>{dateToTs(dateInput)}</div>}
      </div>
    </div>
  );
}
