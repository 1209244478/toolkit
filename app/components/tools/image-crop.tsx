'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function ImageCrop() {
  const { tc } = useToolI18n('image-crop');
  const [file, setFile] = useState<File|null>(null);
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string|null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement|null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [dragStart, setDragStart] = useState<{x:number,y:number}|null>(null);
  const [cropRect, setCropRect] = useState<{x:number,y:number,w:number,h:number}|null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('free');

  useEffect(() => {
    if (!file || !canvasRef.current) return;
    if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setImgLoaded(true);
        render();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [file]);

  const prevUrl = useRef<string|null>(null);

  const render = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = img.width * scale / 100;
    canvas.height = img.height * scale / 100;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img, -img.width * scale / 200, -img.height * scale / 200, img.width * scale / 100, img.height * scale / 100);
    ctx.restore();
  }, [scale, rotation]);

  useEffect(() => {
    if (imgLoaded) render();
  }, [render, imgLoaded]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    setDragStart({x,y});
  };
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragStart) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    let x2 = (e.clientX - rect.left) * (canvas.width / rect.width);
    let y2 = (e.clientY - rect.top) * (canvas.height / rect.height);
    x2 = Math.max(0, Math.min(x2, canvas.width));
    y2 = Math.max(0, Math.min(y2, canvas.height));
    let x1 = Math.max(0, Math.min(dragStart.x, canvas.width));
    let y1 = Math.max(0, Math.min(dragStart.y, canvas.height));
    const w = Math.abs(x2 - x1);
    const h = Math.abs(y2 - y1);
    if (w < 5 || h < 5) { setCropRect(null); setDragStart(null); return; }
    let cropX = Math.min(x1, x2), cropY = Math.min(y1, y2), cropW = w, cropH = h;

    if (aspectRatio !== 'free' && aspectRatio !== 'custom') {
      const [rw, rh] = aspectRatio.split(':').map(Number);
      const ratio = rw / rh;
      if (cropW / cropH > ratio) cropW = cropH * ratio;
      else cropH = cropW / ratio;
    }
    setCropRect({x:cropX, y:cropY, w:cropW, h:cropH});
    setDragStart(null);
  };

  const doCrop = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !cropRect) return;
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = cropRect.w;
    cropCanvas.height = cropRect.h;
    const ctx = cropCanvas.getContext('2d')!;
    ctx.drawImage(canvas, cropRect.x, cropRect.y, cropRect.w, cropRect.h, 0, 0, cropRect.w, cropRect.h);
    setResult(cropCanvas.toDataURL('image/png'));
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (cropRect) {
      doCrop();
    } else {
      setResult(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className={s.toolContainer}>
      <div className={s.col}><label className={s.label}>选择图片</label><input type="file" accept="image/*" onChange={e=>{setFile(e.target.files?.[0]??null);setScale(100);setRotation(0);setCropRect(null);setResult(null);setImgLoaded(false);}} /></div>
      {file && (<>
        <div className={s.row}>
          <div className={s.col}><label className={s.label}>缩放 ({scale}%)</label><input type="range" className={s.slider} min="10" max="200" value={scale} onChange={e=>setScale(Number(e.target.value))} /></div>
          <div className={s.col}><label className={s.label}>旋转 ({rotation}°)</label><input type="range" className={s.slider} min="0" max="360" value={rotation} onChange={e=>setRotation(Number(e.target.value))} /></div>
        </div>
        <div className={s.row}>
          <div className={s.col}>
            <label className={s.label}>裁剪比例</label>
            <select className={s.select} value={aspectRatio} onChange={e=>setAspectRatio(e.target.value)}>
              <option value="free">自由</option><option value="1:1">1:1 正方形</option>
              <option value="4:3">4:3</option><option value="16:9">16:9</option>
              <option value="3:2">3:2</option>
            </select>
          </div>
          <div className={s.col} style={{alignSelf:'flex-end'}}>
            {cropRect && <button className={`${s.btn} ${s.btnOutline}`} style={{marginTop:4}} onClick={()=>setCropRect(null)}>清除选区</button>}
          </div>
        </div>
        <p style={{fontSize:'.8125rem',color:'var(--text-sec)'}}>在图片上拖拽鼠标选择裁剪区域</p>
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          style={{maxWidth:'100%',borderRadius:'var(--radius-md)',border:'1px solid var(--border-soft)',cursor:'crosshair'}}
        />
        <div className={s.btnGroup}>
          <button className={`${s.btn} ${s.btnPrimary}`} onClick={download}>
            {cropRect ? '裁剪并下载' : '下载调整结果'}
          </button>
        </div>
      </>)}
      {result && <a href={result} download="edited.png" className={`${s.btn} ${s.btnSecondary}`}>保存图片</a>}
    </div>
  );
}
