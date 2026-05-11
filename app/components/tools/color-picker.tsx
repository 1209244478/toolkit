'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

const LOUPE_RADIUS = 10;
const ZOOM = 5;
const LOUPE_SIZE = LOUPE_RADIUS * 2 * ZOOM;

export default function ColorPicker() {
  const { tc } = useToolI18n('color-picker');
  const [imgSrc, setImgSrc] = useState<string|null>(null);
  const [color, setColor] = useState<{hex:string;rgb:string}|null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loupeCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevUrl = useRef<string|null>(null);
  const [cursorPos, setCursorPos] = useState<{x:number;y:number}|null>(null);
  const [loupePos, setLoupePos] = useState<{x:number;y:number}|null>(null);

  useEffect(() => {
    if (!imgSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imgSrc;
    return () => { if (prevUrl.current) URL.revokeObjectURL(prevUrl.current); prevUrl.current = imgSrc; };
  }, [imgSrc]);

  const renderLoupe = useCallback((imgX: number, imgY: number) => {
    const mainCanvas = canvasRef.current;
    const loupeCanvas = loupeCanvasRef.current;
    if (!mainCanvas || !loupeCanvas) return;
    const mainCtx = mainCanvas.getContext('2d')!;
    const loupeCtx = loupeCanvas.getContext('2d')!;
    loupeCanvas.width = LOUPE_SIZE;
    loupeCanvas.height = LOUPE_SIZE;

    const sx = Math.max(0, Math.min(imgX - LOUPE_RADIUS, mainCanvas.width - LOUPE_RADIUS * 2));
    const sy = Math.max(0, Math.min(imgY - LOUPE_RADIUS, mainCanvas.height - LOUPE_RADIUS * 2));
    const sw = LOUPE_RADIUS * 2;
    const sh = LOUPE_RADIUS * 2;

    loupeCtx.imageSmoothingEnabled = false;
    loupeCtx.drawImage(mainCanvas, sx, sy, sw, sh, 0, 0, LOUPE_SIZE, LOUPE_SIZE);

    const cx = Math.round((imgX - sx) * ZOOM);
    const cy = Math.round((imgY - sy) * ZOOM);
    loupeCtx.strokeStyle = '#ff0000';
    loupeCtx.lineWidth = 1;
    loupeCtx.setLineDash([2, 2]);
    loupeCtx.strokeRect(cx - ZOOM / 2, cy - ZOOM / 2, ZOOM, ZOOM);

    const crossLen = LOUPE_SIZE * 0.3;
    loupeCtx.setLineDash([0]);
    loupeCtx.strokeStyle = 'rgba(255,255,255,0.8)';
    loupeCtx.lineWidth = 0.5;
    loupeCtx.beginPath();
    loupeCtx.moveTo(LOUPE_SIZE / 2, cy - crossLen);
    loupeCtx.lineTo(LOUPE_SIZE / 2, cy + crossLen);
    loupeCtx.moveTo(cx - crossLen, LOUPE_SIZE / 2);
    loupeCtx.lineTo(cx + crossLen, LOUPE_SIZE / 2);
    loupeCtx.stroke();
    loupeCtx.strokeStyle = 'rgba(0,0,0,0.5)';
    loupeCtx.beginPath();
    loupeCtx.moveTo(LOUPE_SIZE / 2 + 0.5, cy - crossLen);
    loupeCtx.lineTo(LOUPE_SIZE / 2 + 0.5, cy + crossLen);
    loupeCtx.moveTo(cx - crossLen, LOUPE_SIZE / 2 + 0.5);
    loupeCtx.lineTo(cx + crossLen, LOUPE_SIZE / 2 + 0.5);
    loupeCtx.stroke();
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImgSrc(URL.createObjectURL(f));
    setColor(null);
    setCursorPos(null);
    setLoupePos(null);
  };

  const pick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    const ctx = canvas.getContext('2d')!;
    const [r,g,b] = ctx.getImageData(x, y, 1, 1).data;
    const hex = '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
    setColor({ hex, rgb: `rgb(${r}, ${g}, ${b})` });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = canvas.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const imgX = Math.round((e.clientX - rect.left) * scaleX);
    const imgY = Math.round((e.clientY - rect.top) * scaleY);
    setCursorPos({ x: imgX, y: imgY });
    const dx = e.clientX - containerRect.left;
    const dy = e.clientY - containerRect.top;
    setLoupePos({
      x: dx + LOUPE_SIZE / 2 + 16 > containerRect.width ? dx - LOUPE_SIZE - 16 : dx + 16,
      y: dy - LOUPE_SIZE / 2 < 0 ? 8 : dy - LOUPE_SIZE / 2,
    });
    renderLoupe(imgX, imgY);
  };

  const handleMouseLeave = () => {
    setCursorPos(null);
    setLoupePos(null);
  };

  return (
    <div className={s.toolContainer}>
      <div className={s.col}><label className={s.label}>上传图片</label><input type="file" accept="image/*" onChange={handleFile} /></div>
      {imgSrc && (
        <>
          <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
            <canvas
              ref={canvasRef}
              onClick={pick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', cursor: 'crosshair', border: '1px solid var(--border-soft)' }}
            />
            {cursorPos && loupePos && (
              <canvas
                ref={loupeCanvasRef}
                style={{
                  position: 'absolute',
                  left: loupePos.x,
                  top: loupePos.y,
                  width: LOUPE_SIZE,
                  height: LOUPE_SIZE,
                  borderRadius: '50%',
                  border: '2px solid var(--ink)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  pointerEvents: 'none',
                  zIndex: 10,
                  background: '#fff',
                }}
              />
            )}
            {cursorPos && (
              <div style={{
                position: 'absolute',
                left: loupePos ? loupePos.x + LOUPE_SIZE + 12 : 12,
                top: loupePos ? loupePos.y : 12,
                background: 'rgba(0,0,0,0.75)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '.75rem',
                fontWeight: 600,
                fontFamily: 'monospace',
                pointerEvents: 'none',
                zIndex: 10,
              }}>
                ({cursorPos.x}, {cursorPos.y})
              </div>
            )}
            {color && (
              <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                border: '1px solid var(--border-soft)',
                zIndex: 10,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: color.hex, border: '1px solid var(--border-soft)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '.875rem' }}>{color.hex}</div>
                  <div style={{ color: 'var(--text-sec)', fontSize: '.75rem' }}>{color.rgb}</div>
                </div>
                <button
                  className={`${s.btn} ${s.btnOutline}`}
                  style={{ padding: '4px 10px', fontSize: '.6875rem', flexShrink: 0 }}
                  onClick={(ev) => { ev.stopPropagation(); navigator.clipboard.writeText(color.hex); }}
                >
                  复制
                </button>
              </div>
            )}
          </div>
          <p style={{ fontSize: '.8125rem', color: 'var(--text-sec)' }}>移动鼠标预览放大像素，点击图片任意位置取色</p>
        </>
      )}
    </div>
  );
}
