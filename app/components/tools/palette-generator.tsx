'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const modes = [
  { label: '互补色', generate: (h: number) => [h, (h + 180) % 360] },
  { label: '类似色', generate: (h: number) => [h, (h + 30) % 360, (h + 330) % 360] },
  { label: '三等分', generate: (h: number) => [h, (h + 120) % 360, (h + 240) % 360] },
  { label: '分裂互补', generate: (h: number) => [h, (h + 150) % 360, (h + 210) % 360] },
  { label: '四等分', generate: (h: number) => [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360] },
];

export default function PaletteGenerator() {
  const { tc } = useToolI18n('palette-generator');
  const [baseHue, setBaseHue] = useState(210);
  const [sat, setSat] = useState(70);
  const [light, setLight] = useState(50);
  const [modeIdx, setModeIdx] = useState(0);
  const hues = modes[modeIdx].generate(baseHue);
  const colors = hues.map(h => ({ hex: hslToHex(h, sat, light), h }));
  return (
    <div className={s.toolContainer}>
      <div className={s.col}>
        <label className={s.label}>基础色相 ({baseHue}°)</label>
        <input type="range" className={s.slider} min="0" max="360" value={baseHue} onChange={e=>setBaseHue(Number(e.target.value))} />
      </div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>饱和度 ({sat}%)</label><input type="range" className={s.slider} min="10" max="100" value={sat} onChange={e=>setSat(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>亮度 ({light}%)</label><input type="range" className={s.slider} min="10" max="90" value={light} onChange={e=>setLight(Number(e.target.value))} /></div>
      </div>
      <div className={s.btnGroup}>
        {modes.map((m,i) => <button key={m.label} className={`${s.btn} ${i===modeIdx?s.btnPrimary:s.btnOutline}`} onClick={()=>setModeIdx(i)}>{m.label}</button>)}
      </div>
      <div style={{display:'flex',gap:8,borderRadius:'var(--radius-lg)',overflow:'hidden',height:120}}>
        {colors.map((c,i) => (
          <div key={i} style={{flex:1,background:c.hex,display:'flex',alignItems:'flex-end',justifyContent:'center',paddingBottom:8,cursor:'pointer'}} onClick={()=>navigator.clipboard.writeText(c.hex)} title="点击复制">
            <span style={{fontSize:'.6875rem',fontWeight:600,color:light>60?'#1d1d1f':'#ffffff',textShadow:light>60?'none':'0 1px 2px rgba(0,0,0,0.3)'}}>{c.hex}</span>
          </div>
        ))}
      </div>
      <div className={s.col}>
        <label className={s.label}>CSS 变量</label>
        <div className={s.outputWrap}><div className={s.output}>{colors.map((c,i) => `--color-${i+1}: ${c.hex};`).join('\n')}</div>
        <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(colors.map((c,i)=>`--color-${i+1}: ${c.hex};`).join('\n'))}>复制</button></div>
      </div>
    </div>
  );
}
