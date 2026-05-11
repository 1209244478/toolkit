'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

const FIELDS = [
  {label:'秒',key:'second',values:['*','0-59']},
  {label:'分',key:'minute',values:['*','0-59']},
  {label:'时',key:'hour',values:['*','0-23']},
  {label:'日',key:'day',values:['*','1-31']},
  {label:'月',key:'month',values:['*','1-12']},
  {label:'周',key:'weekday',values:['*','0-6']},
];

export default function CronGenerator() {
  const { tc } = useToolI18n('cron-generator');
  const [second, setSecond] = useState('0');
  const [minute, setMinute] = useState('*/5');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [weekday, setWeekday] = useState('*');
  const cron = `${second} ${minute} ${hour} ${day} ${month} ${weekday}`;
  const nextRuns = useMemo(() => {
    try {
      const results: Date[] = [];
      const now = new Date();
      let d = new Date(now.getTime() + 1000);
      d.setMilliseconds(0);
      const parseField = (val: string, min: number, max: number): number[] => {
        if (val === '*') return Array.from({length:max-min+1},(_,i)=>min+i);
        if (val.includes('/')) {
          const step = Number(val.split('/')[1]);
          return Array.from({length:Math.floor((max-min)/step)+1},(_,i)=>min+i*step);
        }
        if (val.includes('-')) {
          const [a,b] = val.split('-').map(Number);
          return Array.from({length:b-a+1},(_,i)=>a+i);
        }
        return [Number(val)];
      };
      const matchCron = (dt: Date) => {
        const secs = parseField(second,0,59);
        const mins = parseField(minute,0,59);
        const hours = parseField(hour,0,23);
        const days = parseField(day,1,31);
        const months = parseField(month,1,12);
        const weekdays = parseField(weekday,0,6);
        return secs.includes(dt.getSeconds()) && mins.includes(dt.getMinutes()) &&
               hours.includes(dt.getHours()) && days.includes(dt.getDate()) &&
               months.includes(dt.getMonth()+1) && weekdays.includes(dt.getDay());
      };
      let safety = 0;
      while (results.length < 5 && safety < 600) {
        if (matchCron(d)) results.push(new Date(d));
        d = new Date(d.getTime() + 1000);
        safety++;
      }
      return results;
    } catch { return []; }
  }, [cron]);
  return (
    <div className={s.toolContainer}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8}}>
        {[
          {label:'秒',val:second,set:setSecond},
          {label:'分',val:minute,set:setMinute},
          {label:'时',val:hour,set:setHour},
          {label:'日',val:day,set:setDay},
          {label:'月',val:month,set:setMonth},
          {label:'周',val:weekday,set:setWeekday},
        ].map(f=>(
          <div key={f.label} className={s.col}>
            <label className={s.label} style={{textAlign:'center'}}>{f.label}</label>
            <input className={s.input} value={f.val} onChange={e=>f.set(e.target.value)} style={{textAlign:'center'}} />
          </div>
        ))}
      </div>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${s.btnOutline}`} onClick={()=>{setSecond('0');setMinute('0');setHour('*');setDay('*');setMonth('*');setWeekday('*');}}>每时</button>
        <button className={`${s.btn} ${s.btnOutline}`} onClick={()=>{setSecond('0');setMinute('0');setHour('*/6');setDay('*');setMonth('*');setWeekday('*');}}>每6小时</button>
        <button className={`${s.btn} ${s.btnOutline}`} onClick={()=>{setSecond('0');setMinute('0');setHour('0');setDay('*');setMonth('*');setWeekday('*');}}>每天</button>
        <button className={`${s.btn} ${s.btnOutline}`} onClick={()=>{setSecond('0');setMinute('0');setHour('0');setDay('*');setMonth('*');setWeekday('1');}}>每周一</button>
      </div>
      <div className={s.col}>
        <label className={s.label}>Cron 表达式</label>
        <div className={s.outputWrap}><div className={s.output} style={{fontSize:'1.125rem',fontWeight:600,textAlign:'center',letterSpacing:2}}>{cron}</div>
        <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(cron)}>复制</button></div>
      </div>
      {nextRuns.length > 0 && (
        <div className={s.col}>
          <label className={s.label}>近 5 次执行时间</label>
          <div className={s.output}>
            {nextRuns.map((d,i) => <div key={i} style={{fontSize:'.8125rem',padding:'2px 0'}}>{i+1}. {d.toLocaleString('zh-CN')}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
