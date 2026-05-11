'use client';
import { useState, useRef, useEffect } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function PlaceholderImage() {
  const { tc } = useToolI18n('placeholder-image');
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [bgColor, setBgColor] = useState('#cccccc');
  const [textColor, setTextColor] = useState('#666666');
  const [text, setText] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = bgColor; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.min(width,height)/8}px Inter, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text || `${width}×${height}`, width/2, height/2);
    setImgUrl(canvas.toDataURL('image/png'));
  };
  useEffect(() => { generate(); }, []);
  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>宽度</label><input type="number" className={s.input} value={width} onChange={e=>setWidth(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>高度</label><input type="number" className={s.input} value={height} onChange={e=>setHeight(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>背景色</label><input type="color" value={bgColor} onChange={e=>setBgColor(e.target.value)} style={{width:'100%',height:36}} /></div>
        <div className={s.col}><label className={s.label}>文字色</label><input type="color" value={textColor} onChange={e=>setTextColor(e.target.value)} style={{width:'100%',height:36}} /></div>
      </div>
      <div className={s.col}><label className={s.label}>自定义文字（留空显示尺寸）</label><input className={s.input} value={text} onChange={e=>setText(e.target.value)} /></div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={generate}>生成</button>
      <canvas ref={canvasRef} style={{display:'none'}} />
      {imgUrl && <div className={s.card} style={{textAlign:'center'}}><img src={imgUrl} alt="placeholder" style={{maxWidth:'100%',borderRadius:'var(--radius-sm)'}} /><div style={{marginTop:12}}><a href={imgUrl} download="placeholder.png" className={`${s.btn} ${s.btnSecondary}`}>下载</a></div></div>}
    </div>
  );
}
