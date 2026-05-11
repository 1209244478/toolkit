'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function AnimationGen() {
  const { tc } = useToolI18n('css-animation');
  const [prop, setProp] = useState('transform');
  const [fromVal, setFromVal] = useState('scale(0)');
  const [toVal, setToVal] = useState('scale(1)');
  const [duration, setDuration] = useState(0.3);
  const [timing, setTiming] = useState('ease');
  const [delay, setDelay] = useState(0);
  const [iterCount, setIterCount] = useState('1');
  const [direction, setDirection] = useState('normal');
  const css = useMemo(() => {
    const name = 'custom-animation';
    return `@keyframes ${name} {\n  from { ${prop}: ${fromVal}; }\n  to { ${prop}: ${toVal}; }\n}\n\nanimation: ${name} ${duration}s ${timing} ${delay}s ${iterCount} ${direction};`;
  }, [prop,fromVal,toVal,duration,timing,delay,iterCount,direction]);
  const [playing, setPlaying] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const animStyle = playing ? { animation: `custom-animation ${duration}s ${timing} ${delay}s ${iterCount} ${direction}` } : {};
  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>属性</label><select className={s.select} value={prop} onChange={e=>setProp(e.target.value)}><option value="transform">transform</option><option value="opacity">opacity</option><option value="width">width</option><option value="height">height</option><option value="background-color">background-color</option></select></div>
        <div className={s.col}><label className={s.label}>起始值</label><input className={s.input} value={fromVal} onChange={e=>setFromVal(e.target.value)} /></div>
        <div className={s.col}><label className={s.label}>结束值</label><input className={s.input} value={toVal} onChange={e=>setToVal(e.target.value)} /></div>
      </div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>时长 ({duration}s)</label><input type="range" className={s.slider} min="0.1" max="5" step="0.1" value={duration} onChange={e=>setDuration(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>缓动</label><select className={s.select} value={timing} onChange={e=>setTiming(e.target.value)}><option value="ease">ease</option><option value="linear">linear</option><option value="ease-in">ease-in</option><option value="ease-out">ease-out</option><option value="ease-in-out">ease-in-out</option></select></div>
        <div className={s.col}><label className={s.label}>延迟 ({delay}s)</label><input type="range" className={s.slider} min="0" max="3" step="0.1" value={delay} onChange={e=>setDelay(Number(e.target.value))} /></div>
      </div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>次数</label><select className={s.select} value={iterCount} onChange={e=>setIterCount(e.target.value)}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="infinite">无限</option></select></div>
        <div className={s.col}><label className={s.label}>方向</label><select className={s.select} value={direction} onChange={e=>setDirection(e.target.value)}><option value="normal">normal</option><option value="reverse">reverse</option><option value="alternate">alternate</option><option value="alternate-reverse">alternate-reverse</option></select></div>
      </div>
      <div className={s.card} style={{display:'flex',justifyContent:'center',padding:40}}>
        <style>{`@keyframes custom-animation { from { ${prop}: ${fromVal}; } to { ${prop}: ${toVal}; } }`}</style>
        <div key={animKey} style={{width:80,height:80,background:'var(--accent)',borderRadius:'var(--radius-md)',...animStyle}} />
      </div>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={()=>{setPlaying(false);setAnimKey(k=>k+1);requestAnimationFrame(()=>setPlaying(true));}}>播放</button>
        <button className={`${s.btn} ${s.btnOutline}`} onClick={()=>setPlaying(false)}>重置</button>
      </div>
      <div className={s.col}>
        <label className={s.label}>CSS 代码</label>
        <div className={s.outputWrap}><div className={s.output}>{css}</div>
        <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(css)}>复制</button></div>
      </div>
    </div>
  );
}
