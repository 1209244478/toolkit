'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function CssGradient() {
  const { tc } = useToolI18n('gradient-generator');
  const [type, setType] = useState<'linear'|'radial'>('linear');
  const [dir, setDir] = useState('to right');
  const [colors, setColors] = useState(['#0071e3','#34c759']);
  const [customDir, setCustomDir] = useState('');
  const [radialShape, setRadialShape] = useState('circle');
  const [radialPos, setRadialPos] = useState('center');
  const gradient = type === 'linear'
    ? `linear-gradient(${customDir || dir}, ${colors.join(', ')})`
    : `radial-gradient(${radialShape} at ${radialPos}, ${colors.join(', ')})`;
  const addColor = () => { if (colors.length < 6) setColors([...colors, '#ff9500']); };
  const removeColor = (i: number) => { if (colors.length > 2) setColors(colors.filter((_,idx) => idx !== i)); };
  const updateColor = (i: number, v: string) => { const c = [...colors]; c[i] = v; setColors(c); };
  const cssCode = `background: ${gradient};`;
  return (
    <div className={s.toolContainer}>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${type==='linear'?s.btnPrimary:s.btnOutline}`} onClick={()=>setType('linear')}>线性渐变</button>
        <button className={`${s.btn} ${type==='radial'?s.btnPrimary:s.btnOutline}`} onClick={()=>setType('radial')}>径向渐变</button>
      </div>
      {type === 'linear' ? (
        <div className={s.col}>
          <label className={s.label}>方向</label>
          <select className={s.select} value={dir} onChange={e=>{setDir(e.target.value);setCustomDir('');}}>
            <option value="to right">从左到右</option><option value="to left">从右到左</option>
            <option value="to bottom">从上到下</option><option value="to top">从下到上</option>
            <option value="45deg">45°</option><option value="135deg">135°</option>
            <option value="custom">自定义</option>
          </select>
          {dir === 'custom' && <input className={s.input} style={{marginTop:8}} value={customDir} onChange={e=>setCustomDir(e.target.value)} placeholder="如: 30deg" />}
        </div>
      ) : (
        <div className={s.row}>
          <div className={s.col}>
            <label className={s.label}>形状</label>
            <select className={s.select} value={radialShape} onChange={e=>setRadialShape(e.target.value)}>
              <option value="circle">圆形</option><option value="ellipse">椭圆</option>
            </select>
          </div>
          <div className={s.col}>
            <label className={s.label}>位置</label>
            <select className={s.select} value={radialPos} onChange={e=>setRadialPos(e.target.value)}>
              <option value="center">居中</option><option value="top">顶部</option>
              <option value="bottom">底部</option><option value="left">左侧</option>
              <option value="right">右侧</option>
              <option value="top left">左上</option><option value="top right">右上</option>
              <option value="bottom left">左下</option><option value="bottom right">右下</option>
            </select>
          </div>
        </div>
      )}
      <div className={s.col}>
        <label className={s.label}>颜色</label>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
          {colors.map((c,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:4}}>
              <input type="color" value={c} onChange={e=>updateColor(i,e.target.value)} style={{width:40,height:32}} />
              <span style={{fontSize:'.75rem',color:'var(--text-sec)'}}>{c}</span>
              {colors.length > 2 && <button onClick={()=>removeColor(i)} style={{background:'none',border:'none',cursor:'pointer',color:'#c41e3a',fontSize:'1rem'}}>×</button>}
            </div>
          ))}
          {colors.length < 6 && <button className={`${s.btn} ${s.btnOutline}`} onClick={addColor}>+ 添加</button>}
        </div>
      </div>
      <div style={{height:160,borderRadius:'var(--radius-lg)',background:gradient,border:'1px solid var(--border-soft)'}} />
      <div className={s.col}>
        <label className={s.label}>CSS 代码</label>
        <div className={s.outputWrap}><div className={s.output}>{cssCode}</div>
        <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(cssCode)}>复制</button></div>
      </div>
    </div>
  );
}
