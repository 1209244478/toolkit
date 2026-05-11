'use client';
import { useState, useRef, useEffect } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function DrawingBoard() {
  const { tc } = useToolI18n('drawing-board');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#1d1d1f');
  const [size, setSize] = useState(4);
  const [tool, setTool] = useState<'pen'|'eraser'>('pen');
  const [history, setHistory] = useState<string[]>([]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
    saveState();
  }, []);
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory(prev => [...prev.slice(-20), canvas.toDataURL()]);
  };
  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getPos(e);
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const endDraw = () => {
    if (drawing) { setDrawing(false); saveState(); }
  };
  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };
  const undo = () => {
    if (history.length < 2) return;
    const prev = history.slice(0, -2);
    const last = history[history.length - 2];
    const img = new Image();
    img.onload = () => {
      const ctx = canvasRef.current!.getContext('2d')!;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      ctx.drawImage(img, 0, 0);
      ctx.setTransform(2, 0, 0, 2, 0, 0);
    };
    img.src = last;
    setHistory(prev => prev.slice(0, -1));
  };
  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = 'drawing.png';
    a.href = canvas.toDataURL();
    a.click();
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${tool==='pen'?s.btnPrimary:s.btnOutline}`} onClick={()=>setTool('pen')}>✏️ 画笔</button>
        <button className={`${s.btn} ${tool==='eraser'?s.btnPrimary:s.btnOutline}`} onClick={()=>setTool('eraser')}>🧹 橡皮</button>
        <input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{width:36,height:36,border:'none',cursor:'pointer'}} />
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontSize:'.75rem',color:'var(--text-sec)'}}>粗细</span>
          <input type="range" className={s.slider} min="1" max="30" value={size} onChange={e=>setSize(Number(e.target.value))} style={{width:80}} />
        </div>
        <button className={`${s.btn} ${s.btnOutline}`} onClick={undo}>↩ 撤销</button>
        <button className={`${s.btn} ${s.btnOutline}`} onClick={clear}>🗑 清空</button>
        <button className={`${s.btn} ${s.btnSecondary}`} onClick={download}>💾 下载</button>
      </div>
      <canvas
        ref={canvasRef}
        style={{width:'100%',height:500,borderRadius:'var(--radius-lg)',border:'1px solid var(--border-soft)',cursor:'crosshair',touchAction:'none'}}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
      />
    </div>
  );
}
