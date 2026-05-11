'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

const zodiac = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
const constellations = [
  {name:'摩羯座',start:[1,1],end:[1,19]},{name:'水瓶座',start:[1,20],end:[2,18]},
  {name:'双鱼座',start:[2,19],end:[3,20]},{name:'白羊座',start:[3,21],end:[4,19]},
  {name:'金牛座',start:[4,20],end:[5,20]},{name:'双子座',start:[5,21],end:[6,21]},
  {name:'巨蟹座',start:[6,22],end:[7,22]},{name:'狮子座',start:[7,23],end:[8,22]},
  {name:'处女座',start:[8,23],end:[9,22]},{name:'天秤座',start:[9,23],end:[10,23]},
  {name:'天蝎座',start:[10,24],end:[11,22]},{name:'射手座',start:[11,23],end:[12,21]},
  {name:'摩羯座',start:[12,22],end:[12,31]},
];

export default function AgeCalc() {
  const { tc } = useToolI18n('age-calc');
  const [birth, setBirth] = useState('');
  const result = useMemo(() => {
    if (!birth) return null;
    const bd = new Date(birth);
    if (isNaN(bd.getTime())) return null;
    const now = new Date();
    let years = now.getFullYear() - bd.getFullYear();
    let months = now.getMonth() - bd.getMonth();
    let days = now.getDate() - bd.getDate();
    if (days < 0) { months--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); days += prev.getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now.getTime() - bd.getTime()) / 86400000);
    const zodiacIdx = (bd.getFullYear() - 4) % 12;
    const m = bd.getMonth() + 1, d = bd.getDate();
    const constellation = constellations.find(c => {
      const [sm,sd] = c.start, [em,ed] = c.end;
      if (sm === em) return m === sm && d >= sd && d <= ed;
      return (m === sm && d >= sd) || (m === em && d <= ed);
    });
    return { years, months, days, totalDays, zodiac: zodiac[zodiacIdx >= 0 ? zodiacIdx : zodiacIdx + 12], constellation: constellation?.name ?? '' };
  }, [birth]);
  return (
    <div className={s.toolContainer}>
      <div className={s.col}><label className={s.label}>出生日期</label><input type="date" className={s.input} value={birth} onChange={e=>setBirth(e.target.value)} /></div>
      {result && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:12}}>
          {[
            {label:'年龄',value:`${result.years} 岁 ${result.months} 月 ${result.days} 天`},
            {label:'总天数',value:`${result.totalDays.toLocaleString()} 天`},
            {label:'生肖',value:result.zodiac},
            {label:'星座',value:result.constellation},
          ].map(item=>(
            <div key={item.label} className={s.card} style={{textAlign:'center'}}>
              <div style={{fontSize:'1.125rem',fontWeight:600,color:'var(--accent)'}}>{item.value}</div>
              <div style={{fontSize:'.75rem',color:'var(--text-sec)',marginTop:4}}>{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
