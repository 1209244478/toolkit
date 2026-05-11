'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function BorderRadiusGen() {
  const { tc } = useToolI18n('border-radius-gen');
  const [tl, setTl] = useState(12);
  const [tr, setTr] = useState(12);
  const [br, setBr] = useState(12);
  const [bl, setBl] = useState(12);
  const [unit, setUnit] = useState<'px'|'%'>('px');
  const [linked, setLinked] = useState(true);
  const css = useMemo(() => {
    const v = (n:number) => `${n}${unit}`;
    if (tl === tr && tr === br && br === bl) return `border-radius: ${v(tl)};`;
    if (tl === br && tr === bl) return `border-radius: ${v(tl)} ${v(tr)};`;
    return `border-radius: ${v(tl)} ${v(tr)} ${v(br)} ${v(bl)};`;
  }, [tl,tr,br,bl,unit]);
  const setAll = (v: number) => { setTl(v); setTr(v); setBr(v); setBl(v); };
  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>左上 ({tl}{unit})</label><input type="range" className={s.slider} min="0" max="100" value={tl} onChange={e=>linked?setAll(Number(e.target.value)):setTl(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>右上 ({tr}{unit})</label><input type="range" className={s.slider} min="0" max="100" value={tr} onChange={e=>linked?setAll(Number(e.target.value)):setTr(Number(e.target.value))} /></div>
      </div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>左下 ({bl}{unit})</label><input type="range" className={s.slider} min="0" max="100" value={bl} onChange={e=>linked?setAll(Number(e.target.value)):setBl(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>右下 ({br}{unit})</label><input type="range" className={s.slider} min="0" max="100" value={br} onChange={e=>linked?setAll(Number(e.target.value)):setBr(Number(e.target.value))} /></div>
      </div>
      <div className={s.btnGroup}>
        <select className={s.select} value={unit} onChange={e=>setUnit(e.target.value as 'px'|'%')}><option value="px">px</option><option value="%">%</option></select>
        <button className={`${s.btn} ${linked?s.btnPrimary:s.btnOutline}`} onClick={()=>{if(!linked){setAll(tl)};setLinked(!linked);}} title={linked?'已链接':'独立调整'}>
          {linked ? '🔗 联动' : '🔓 独立'}
        </button>
        <button className={`${s.btn} ${s.btnOutline}`} onClick={()=>setAll(12)}>重置</button>
      </div>
      <div style={{display:'flex',justifyContent:'center',padding:40}}>
        <div style={{width:160,height:160,background:'var(--accent)',borderRadius:`${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit}`}} />
      </div>
      <div className={s.col}>
        <label className={s.label}>CSS 代码</label>
        <div className={s.outputWrap}><div className={s.output}>{css}</div>
        <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(css)}>复制</button></div>
      </div>
    </div>
  );
}
