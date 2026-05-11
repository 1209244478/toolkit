'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function ColorConverter() {
  const { tc } = useToolI18n('color-converter');
  const [hex, setHex] = useState('#0071e3');
  const [r, setR] = useState(0);
  const [g, setG] = useState(113);
  const [b, setB] = useState(227);
  const [h, setH] = useState(212);
  const [sat, setSat] = useState(100);
  const [l, setL] = useState(44);
  const hexToRgb = (hex: string) => {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : null;
  };
  const rgbToHsl = (r:number,g:number,b:number) => {
    r/=255;g/=255;b/=255;
    const max=Math.max(r,g,b),min=Math.min(r,g,b),l=(max+min)/2;
    let h=0,s=0;
    if(max!==min){const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);
      if(max===r)h=((g-b)/d+(g<b?6:0))/6;else if(max===g)h=((b-r)/d+2)/6;else h=((r-g)/d+4)/6;
    }
    return {h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};
  };
  const updateFromHex = (v:string) => {
    setHex(v);
    const rgb = hexToRgb(v);
    if(rgb){setR(rgb.r);setG(rgb.g);setB(rgb.b);const hsl=rgbToHsl(rgb.r,rgb.g,rgb.b);setH(hsl.h);setSat(hsl.s);setL(hsl.l);}
  };
  const updateFromRgb = (newR:number, newG:number, newB:number) => {
    setR(newR); setG(newG); setB(newB);
    const hsl = rgbToHsl(newR, newG, newB);
    setH(hsl.h); setSat(hsl.s); setL(hsl.l);
    setHex('#' + [newR,newG,newB].map(v=>v.toString(16).padStart(2,'0')).join(''));
  };
  const rgbStr = `rgb(${r}, ${g}, ${b})`;
  const hslStr = `hsl(${h}, ${sat}%, ${l}%)`;
  return (
    <div className={s.toolContainer}>
      <div style={{height:80,borderRadius:'var(--radius-lg)',background:hex,border:'1px solid var(--border-soft)',marginBottom:8}} />
      <div className={s.col}>
        <label className={s.label}>HEX</label>
        <input className={s.input} value={hex} onChange={e=>updateFromHex(e.target.value)} placeholder="#0071e3" />
      </div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>R ({r})</label><input type="range" className={s.slider} min="0" max="255" value={r} onChange={e=>updateFromRgb(Number(e.target.value),g,b)} /></div>
        <div className={s.col}><label className={s.label}>G ({g})</label><input type="range" className={s.slider} min="0" max="255" value={g} onChange={e=>updateFromRgb(r,Number(e.target.value),b)} /></div>
        <div className={s.col}><label className={s.label}>B ({b})</label><input type="range" className={s.slider} min="0" max="255" value={b} onChange={e=>updateFromRgb(r,g,Number(e.target.value))} /></div>
      </div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>RGB</label><div className={s.outputWrap}><div className={s.output}>{rgbStr}</div><button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(rgbStr)}>复制</button></div></div>
        <div className={s.col}><label className={s.label}>HSL</label><div className={s.outputWrap}><div className={s.output}>{hslStr}</div><button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(hslStr)}>复制</button></div></div>
      </div>
    </div>
  );
}
