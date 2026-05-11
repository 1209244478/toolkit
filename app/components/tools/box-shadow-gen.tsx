'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function BoxShadowGen() {
  const { tc } = useToolI18n('shadow-generator');
  const [x, setX] = useState(4);
  const [y, setY] = useState(4);
  const [blur, setBlur] = useState(12);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState('#000000');
  const [opacity, setOpacity] = useState(0.15);
  const [inset, setInset] = useState(false);
  const css = useMemo(() => {
    const rgba = `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},${opacity})`;
    return `box-shadow: ${inset?'inset ':''}${x}px ${y}px ${blur}px ${spread}px ${rgba};`;
  }, [x,y,blur,spread,color,opacity,inset]);
  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>X 偏移 ({x}px)</label><input type="range" className={s.slider} min="-50" max="50" value={x} onChange={e=>setX(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>Y 偏移 ({y}px)</label><input type="range" className={s.slider} min="-50" max="50" value={y} onChange={e=>setY(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>模糊 ({blur}px)</label><input type="range" className={s.slider} min="0" max="100" value={blur} onChange={e=>setBlur(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>扩展 ({spread}px)</label><input type="range" className={s.slider} min="-50" max="50" value={spread} onChange={e=>setSpread(Number(e.target.value))} /></div>
      </div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>颜色</label><input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{width:'100%',height:36}} /></div>
        <div className={s.col}><label className={s.label}>透明度 ({opacity})</label><input type="range" className={s.slider} min="0" max="1" step="0.05" value={opacity} onChange={e=>setOpacity(Number(e.target.value))} /></div>
        <div className={s.col}><label style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer'}}><input type="checkbox" className={s.checkbox} checked={inset} onChange={e=>setInset(e.target.checked)} /> <span className={s.label} style={{marginBottom:0}}>内阴影</span></label></div>
      </div>
      <div style={{display:'flex',justifyContent:'center',padding:40}}>
        <div style={{width:160,height:160,background:'var(--white)',borderRadius:'var(--radius-lg)',border:'1px solid var(--border-soft)',boxShadow:`${inset?'inset ':''}${x}px ${y}px ${blur}px ${spread}px rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},${opacity})`}} />
      </div>
      <div className={s.col}>
        <label className={s.label}>CSS 代码</label>
        <div className={s.outputWrap}><div className={s.output}>{css}</div>
        <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(css)}>复制</button></div>
      </div>
    </div>
  );
}
