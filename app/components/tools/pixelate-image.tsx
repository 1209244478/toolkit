'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function PixelateImage() {
  const { tc } = useToolI18n('pixelate-image');
  const [file, setFile] = useState<File|null>(null);
  const [pixelSize, setPixelSize] = useState(10);
  const [result, setResult] = useState<string|null>(null);
  const pixelate = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const w = img.width, h = img.height;
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let y = 0; y < h; y += pixelSize) {
          for (let x = 0; x < w; x += pixelSize) {
            let r = 0, g = 0, b = 0, count = 0;
            for (let dy = 0; dy < pixelSize && y + dy < h; dy++) {
              for (let dx = 0; dx < pixelSize && x + dx < w; dx++) {
                const i = ((y + dy) * w + (x + dx)) * 4;
                r += data[i]; g += data[i+1]; b += data[i+2]; count++;
              }
            }
            r = Math.round(r/count); g = Math.round(g/count); b = Math.round(b/count);
            for (let dy = 0; dy < pixelSize && y + dy < h; dy++) {
              for (let dx = 0; dx < pixelSize && x + dx < w; dx++) {
                const i = ((y + dy) * w + (x + dx)) * 4;
                data[i] = r; data[i+1] = g; data[i+2] = b;
              }
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
        setResult(canvas.toDataURL('image/png'));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.col}><label className={s.label}>选择图片</label><input type="file" accept="image/*" onChange={e=>{setFile(e.target.files?.[0]??null);setResult(null);}} /></div>
      <div className={s.col}><label className={s.label}>像素大小 ({pixelSize}px)</label><input type="range" className={s.slider} min="2" max="40" value={pixelSize} onChange={e=>setPixelSize(Number(e.target.value))} /></div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={pixelate} disabled={!file}>像素化</button>
      {result && <div className={s.card} style={{textAlign:'center'}}><img src={result} alt="pixelated" style={{maxWidth:'100%',borderRadius:'var(--radius-md)'}} /><div style={{marginTop:12}}><a href={result} download="pixelated.png" className={`${s.btn} ${s.btnSecondary}`}>下载</a></div></div>}
    </div>
  );
}
