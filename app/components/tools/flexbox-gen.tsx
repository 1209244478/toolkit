'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function FlexboxGen() {
  const { tc } = useToolI18n('flexbox-gen');
  const [direction, setDirection] = useState('row');
  const [justify, setJustify] = useState('flex-start');
  const [align, setAlign] = useState('stretch');
  const [wrap, setWrap] = useState('nowrap');
  const [gap, setGap] = useState(8);
  const [items, setItems] = useState(3);
  const css = useMemo(() => `display: flex;\nflex-direction: ${direction};\njustify-content: ${justify};\nalign-items: ${align};\nflex-wrap: ${wrap};\ngap: ${gap}px;`, [direction,justify,align,wrap,gap]);
  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>方向</label><select className={s.select} value={direction} onChange={e=>setDirection(e.target.value)}><option value="row">row</option><option value="row-reverse">row-reverse</option><option value="column">column</option><option value="column-reverse">column-reverse</option></select></div>
        <div className={s.col}><label className={s.label}>主轴对齐</label><select className={s.select} value={justify} onChange={e=>setJustify(e.target.value)}><option value="flex-start">flex-start</option><option value="center">center</option><option value="flex-end">flex-end</option><option value="space-between">space-between</option><option value="space-around">space-around</option><option value="space-evenly">space-evenly</option></select></div>
        <div className={s.col}><label className={s.label}>交叉轴对齐</label><select className={s.select} value={align} onChange={e=>setAlign(e.target.value)}><option value="stretch">stretch</option><option value="flex-start">flex-start</option><option value="center">center</option><option value="flex-end">flex-end</option><option value="baseline">baseline</option></select></div>
      </div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>换行</label><select className={s.select} value={wrap} onChange={e=>setWrap(e.target.value)}><option value="nowrap">nowrap</option><option value="wrap">wrap</option><option value="wrap-reverse">wrap-reverse</option></select></div>
        <div className={s.col}><label className={s.label}>间距 ({gap}px)</label><input type="range" className={s.slider} min="0" max="32" value={gap} onChange={e=>setGap(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>子项数 ({items})</label><input type="range" className={s.slider} min="1" max="8" value={items} onChange={e=>setItems(Number(e.target.value))} /></div>
      </div>
      <div className={s.card} style={{padding:16}}>
        <div style={{display:'flex',flexDirection:direction as 'row',justifyContent:justify as 'flex-start',alignItems:align as 'stretch',flexWrap:wrap as 'nowrap',gap:`${gap}px`,minHeight:200,border:'2px dashed var(--border-mid)',borderRadius:'var(--radius-md)',padding:12}}>
          {Array.from({length:items},(_,i)=>(
            <div key={i} style={{padding:'12px 20px',background:'var(--accent)',color:'var(--white)',borderRadius:'var(--radius-sm)',fontSize:'.8125rem',fontWeight:600,minWidth:50,textAlign:'center'}}>Item {i+1}</div>
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
