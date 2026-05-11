'use client';
import { useState, useRef } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function ImageConvert() {
  const { tc } = useToolI18n('image-convert');
  const [file, setFile] = useState<File|null>(null);
  const [format, setFormat] = useState<string>('image/png');
  const [result, setResult] = useState<{url:string}|null>(null);
  const prevUrl = useRef<string|null>(null);
  const setResultSafe = (val: {url:string}|null) => {
    if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
    setResult(val);
    prevUrl.current = val?.url ?? null;
  };
  const convert = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) setResultSafe({ url: URL.createObjectURL(blob) });
        }, format, 0.9);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  const ext = format.split('/')[1];
  return (
    <div className={s.toolContainer}>
      <div className={s.col}><label className={s.label}>选择图片</label><input type="file" accept="image/*" onChange={e=>{setFile(e.target.files?.[0]??null);setResultSafe(null);}} /></div>
      <div className={s.col}><label className={s.label}>目标格式</label>
        <select className={s.select} value={format} onChange={e=>setFormat(e.target.value)}>
          <option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option>
        </select>
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={convert} disabled={!file}>转换</button>
      {result && <div className={s.card}><img src={result.url} alt="converted" style={{maxWidth:'100%',borderRadius:'var(--radius-md)'}} /><div style={{marginTop:12}}><a href={result.url} download={`converted.${ext}`} className={`${s.btn} ${s.btnPrimary}`}>下载</a></div></div>}
    </div>
  );
}
