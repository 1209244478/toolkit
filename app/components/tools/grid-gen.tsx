'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function GridGen() {
  const { tc } = useToolI18n('grid-gen');
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const [gap, setGap] = useState(12);
  const [colUnit, setColUnit] = useState<'fr'|'px'|'%'>('fr');
  const [colSize, setColSize] = useState(1);
  const css = useMemo(() => {
    const c = Array(cols).fill(colUnit==='fr'?`${colSize}fr`:`${colSize}${colUnit}`).join(' ');
    return `display: grid;\ngrid-template-columns: ${c};\ngrid-template-rows: repeat(${rows}, 1fr);\ngap: ${gap}px;`;
  }, [cols,rows,gap,colUnit,colSize]);
  const total = cols * rows;
  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>列数 ({cols})</label><input type="range" className={s.slider} min="1" max="6" value={cols} onChange={e=>setCols(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>行数 ({rows})</label><input type="range" className={s.slider} min="1" max="6" value={rows} onChange={e=>setRows(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>间距 ({gap}px)</label><input type="range" className={s.slider} min="0" max="32" value={gap} onChange={e=>setGap(Number(e.target.value))} /></div>
      </div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>列单位</label><select className={s.select} value={colUnit} onChange={e=>setColUnit(e.target.value as 'fr'|'px'|'%')}><option value="fr">fr</option><option value="px">px</option><option value="%">%</option></select></div>
        <div className={s.col}><label className={s.label}>列大小 ({colSize})</label><input type="range" className={s.slider} min="1" max="200" value={colSize} onChange={e=>setColSize(Number(e.target.value))} /></div>
      </div>
      <div className={s.card} style={{padding:16}}>
        <div style={{display:'grid',gridTemplateColumns:`${Array(cols).fill(colUnit==='fr'?`${colSize}fr`:`${colSize}${colUnit}`).join(' ')}`,gridTemplateRows:`repeat(${rows},1fr)`,gap:`${gap}px`,minHeight:200,border:'2px dashed var(--border-mid)',borderRadius:'var(--radius-md)',padding:12}}>
          {Array.from({length:total},(_,i)=>(
            <div key={i} style={{padding:'12px',background:'var(--accent)',color:'var(--white)',borderRadius:'var(--radius-sm)',fontSize:'.75rem',fontWeight:600,textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center'}}>{i+1}</div>
          ))}
        </div>
      </div>
      <div className={s.col}>
        <label className={s.label}>CSS 代码</label>
        <div className={s.outputWrap}><div className={s.output}>{css}</div>
        <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(css)}>复制</button></div>
      </div>
    </div>
  );
}
