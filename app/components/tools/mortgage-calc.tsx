'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function MortgageCalc() {
  const { tc } = useToolI18n('mortgage-calc');
  const [principal, setPrincipal] = useState('1000000');
  const [rate, setRate] = useState('4.2');
  const [years, setYears] = useState('30');
  const [method, setMethod] = useState<'equal'|'principal'>('equal');
  const result = useMemo(() => {
    const p = Number(principal), r = Number(rate) / 100 / 12, n = Number(years) * 12;
    if (!p || !r || !n || isNaN(p) || isNaN(r) || isNaN(n)) return null;
    if (method === 'equal') {
      const monthly = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const total = monthly * n;
      const interest = total - p;
      return { monthly, total, interest, method: '等额本息' };
    } else {
      const firstMonth = p / n + p * r;
      const lastMonth = p / n + (p / n) * r;
      const totalInterest = (n + 1) * p * r / 2;
      return { firstMonth, lastMonth, total: p + totalInterest, interest: totalInterest, method: '等额本金' };
    }
  }, [principal, rate, years, method]);
  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>贷款金额（元）</label><input type="number" className={s.input} value={principal} onChange={e=>setPrincipal(e.target.value)} /></div>
        <div className={s.col}><label className={s.label}>年利率 (%)</label><input type="number" className={s.input} step="0.01" value={rate} onChange={e=>setRate(e.target.value)} /></div>
        <div className={s.col}><label className={s.label}>贷款年限</label><input type="number" className={s.input} value={years} onChange={e=>setYears(e.target.value)} /></div>
      </div>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${method==='equal'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMethod('equal')}>等额本息</button>
        <button className={`${s.btn} ${method==='principal'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMethod('principal')}>等额本金</button>
      </div>
      {result && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12}}>
          {[
            {label:'还款方式',value:result.method},
            {label:method==='equal'?'每月还款':'首月还款',value:`¥${(method==='equal'?result.monthly:result.firstMonth)?.toFixed(2)}`},
            ...(method==='principal' ? [{label:'末月还款',value:`¥${result.lastMonth?.toFixed(2)}`}] : []),
            {label:'还款总额',value:`¥${result.total.toFixed(2)}`},
            {label:'利息总额',value:`¥${result.interest.toFixed(2)}`},
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
