'use client';
import { useState, useRef } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function ImageCompress() {
  const { tc } = useToolI18n('image-compress');
  const [file, setFile] = useState<File|null>(null);
  const [quality, setQuality] = useState(0.85);
  const [outFormat, setOutFormat] = useState<'auto'|'jpeg'|'png'|'webp'>('auto');
  const [result, setResult] = useState<{url:string,size:number,ext:string}|null>(null);
  const [origSize, setOrigSize] = useState(0);
  const imgRef = useRef<HTMLImageElement|null>(null);
  const prevUrl = useRef<string|null>(null);
  const setResultSafe = (val: {url:string,size:number,ext:string}|null) => {
    if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
    setResult(val);
    prevUrl.current = val?.url ?? null;
  };
  const compress = () => {
    if (!file) return;
    const reader = new FileReader();
    const mimeType = outFormat === 'auto'
      ? (file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg')
      : `image/${outFormat}`;
    const ext = mimeType.split('/')[1];
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        if (mimeType === 'image/png') {
          canvas.width = img.width; canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        } else {
          canvas.width = img.width; canvas.height = img.height;
          ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
        canvas.toBlob((blob) => {
          if (blob) setResultSafe({ url: URL.createObjectURL(blob), size: blob.size, ext });
        }, mimeType, quality);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    setOrigSize(file.size);
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.col}>
        <label className={s.label}>选择图片</label>
        <input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f){setFile(f);setOrigSize(f.size);setResultSafe(null);}}} />
      </div>
      <div className={s.row}>
        <div className={s.col}>
          <label className={s.label}>输出格式</label>
          <select className={s.select} value={outFormat} onChange={e=>setOutFormat(e.target.value as 'auto'|'jpeg'|'png'|'webp')}>
            <option value="auto">自动（保持原格式）</option><option value="jpeg">JPEG</option><option value="png">PNG</option><option value="webp">WebP</option>
          </select>
        </div>
        <div className={s.col}>
          <label className={s.label}>压缩质量 ({Math.round(quality*100)}%)</label>
          <input type="range" className={s.slider} min="0.3" max="1" step="0.05" value={quality} onChange={e=>setQuality(Number(e.target.value))} />
          <div style={{display:'flex',gap:6,marginTop:6}}>
            {[
              { label:'高画质', q:0.95 },
              { label:'平衡', q:0.75 },
              { label:'高压缩', q:0.5 },
            ].map(p=>(
              <button key={p.q} className={`${s.btn} ${s.btnOutline}`} style={{fontSize:'.75rem',padding:'2px 10px'}}
                onClick={()=>setQuality(p.q)}>{p.label}</button>
            ))}
          </div>
        </div>
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={compress} disabled={!file}>压缩</button>
      {result && (
        <div className={s.card}>
          <div style={{display:'flex',gap:20,alignItems:'center',marginBottom:12}}>
            <span className={`${s.tag} ${s.tagGreen}`}>原始: {(origSize/1024).toFixed(1)} KB</span>
            <span className={`${s.tag} ${s.tagBlue}`}>压缩后: {(result.size/1024).toFixed(1)} KB</span>
            <span className={`${s.tag} ${s.tagYellow}`}>节省: {((1-result.size/origSize)*100).toFixed(1)}%</span>
          </div>
          <img ref={imgRef} src={result.url} alt="compressed" style={{maxWidth:'100%',borderRadius:'var(--radius-md)'}} />
          <div style={{marginTop:12}}><a href={result.url} download={`compressed.${result.ext}`} className={`${s.btn} ${s.btnPrimary}`}>下载</a></div>
        </div>
      )}
    </div>
  );
}
