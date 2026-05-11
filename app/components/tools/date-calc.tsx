'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function DateCalc() {
  const { tc } = useToolI18n('date-calc');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const result = useMemo(() => {
    if (!start || !end) return null;
    const d1 = new Date(start), d2 = new Date(end);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.floor(diffMs / 86400000);
    const weeks = Math.floor(days / 7);
    const workDays = (() => {
      let count = 0;
      const from = new Date(Math.min(d1.getTime(), d2.getTime()));
      const to = new Date(Math.max(d1.getTime(), d2.getTime()));
      while (from <= to) {
        const dow = from.getDay();
        if (dow !== 0 && dow !== 6) count++;
        from.setDate(from.getDate() + 1);
      }
      return count - 1;
    })();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor(diffMs / 60000);
    return { days, weeks, workDays, hours, minutes };
  }, [start, end]);
  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>开始日期</label><input type="date" className={s.input} value={start} onChange={e=>setStart(e.target.value)} /></div>
        <div className={s.col}><label className={s.label}>结束日期</label><input type="date" className={s.input} value={end} onChange={e=>setEnd(e.target.value)} /></div>
      </div>
      {result && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:12}}>
          {[
            {label:'天数',value:result.days},{label:'周数',value:result.weeks},
            {label:'工作日',value:result.workDays},{label:'小时',value:result.hours},
            {label:'分钟',value:result.minutes},
          ].map(item=>(
            <div key={item.label} className={s.card} style={{textAlign:'center'}}>
              <div style={{fontSize:'1.5rem',fontWeight:600,color:'var(--accent)'}}>{item.value.toLocaleString()}</div>
              <div style={{fontSize:'.75rem',color:'var(--text-sec)',marginTop:4}}>{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
