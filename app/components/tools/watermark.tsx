'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function Watermark() {
  const { tc } = useToolI18n('watermark');
  const [file, setFile] = useState<File|null>(null);
  const [watermarkText, setWatermarkText] = useState('水印文字');
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(32);
  const [result, setResult] = useState<string|null>(null);
  const addWatermark = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        ctx.globalAlpha = opacity;
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate((-30 * Math.PI) / 180);
        for (let y = -canvas.height; y < canvas.height; y += fontSize * 3) {
          for (let x = -canvas.width; x < canvas.width; x += watermarkText.length * fontSize + 40) {
            ctx.fillText(watermarkText, x, y);
          }
        }
        setResult(canvas.toDataURL('image/png'));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.col}><label className={s.label}>选择图片</label><input type="file" accept="image/*" onChange={e=>{setFile(e.target.files?.[0]??null);setResult(null);}} /></div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>水印文字</label><input className={s.input} value={watermarkText} onChange={e=>setWatermarkText(e.target.value)} /></div>
        <div className={s.col}><label className={s.label}>透明度 ({opacity})</label><input type="range" className={s.slider} min="0.05" max="0.8" step="0.05" value={opacity} onChange={e=>setOpacity(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>字号 ({fontSize}px)</label><input type="range" className={s.slider} min="12" max="80" value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} /></div>
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={addWatermark} disabled={!file}>添加水印</button>
      {result && <div className={s.card} style={{textAlign:'center'}}><img src={result} alt="watermarked" style={{maxWidth:'100%',borderRadius:'var(--radius-md)'}} /><div style={{marginTop:12}}><a href={result} download="watermarked.png" className={`${s.btn} ${s.btnSecondary}`}>下载</a></div></div>}
    </div>
  );
}
