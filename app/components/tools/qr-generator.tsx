'use client';
import { useState, useRef } from 'react';
import QRCode from 'qrcode';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function QrGenerator() {
  const { tc } = useToolI18n('qr-generator');
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [errLevel, setErrLevel] = useState<'L'|'M'|'Q'|'H'>('M');
  const [logo, setLogo] = useState<string|null>(null);
  const [logoSize, setLogoSize] = useState(0.22);
  const [qr, setQr] = useState<string|null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(f);
  };

  const generate = async () => {
    if (!text.trim()) return;
    try {
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, text, {
        width: size,
        margin: 2,
        color: { dark: fg, light: bg },
        errorCorrectionLevel: errLevel,
      });
      if (logo) {
        const ctx = canvas.getContext('2d')!;
        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const logoW = size * logoSize;
            const logoH = logoW;
            const x = (size - logoW) / 2;
            const y = (size - logoH) / 2;
            // 白底圆角遮罩
            const padding = logoW * 0.1;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            const rx = x - padding, ry = y - padding, rw = logoW + padding * 2, rh = logoH + padding * 2;
            const r = rw * 0.15;
            ctx.moveTo(rx + r, ry);
            ctx.lineTo(rx + rw - r, ry);
            ctx.arcTo(rx + rw, ry, rx + rw, ry + r, r);
            ctx.lineTo(rx + rw, ry + rh - r);
            ctx.arcTo(rx + rw, ry + rh, rx + rw - r, ry + rh, r);
            ctx.lineTo(rx + r, ry + rh);
            ctx.arcTo(rx, ry + rh, rx, ry + rh - r, r);
            ctx.lineTo(rx, ry + r);
            ctx.arcTo(rx, ry, rx + r, ry, r);
            ctx.closePath();
            ctx.fill();
            ctx.drawImage(img, x, y, logoW, logoH);
            resolve();
          };
          img.src = logo;
        });
      }
      setQr(canvas.toDataURL());
    } catch {}
  };

  return (
    <div className={s.toolContainer}>
      <div className={s.col}>
        <label className={s.label}>内容</label>
        <input className={s.input} value={text} onChange={e => setText(e.target.value)} placeholder="输入文本或链接..." />
      </div>
      <div className={s.row}>
        <div className={s.col}>
          <label className={s.label}>尺寸 ({size}px)</label>
          <input type="range" className={s.slider} min="128" max="512" step="32" value={size} onChange={e => setSize(Number(e.target.value))} />
        </div>
        <div className={s.col}>
          <label className={s.label}>容错等级</label>
          <select className={s.select} value={errLevel} onChange={e => setErrLevel(e.target.value as 'L'|'M'|'Q'|'H')}>
            <option value="L">L (7%)</option><option value="M">M (15%)</option>
            <option value="Q">Q (25%)</option><option value="H">H (30%)</option>
          </select>
        </div>
      </div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>前景色</label><input type="color" value={fg} onChange={e => setFg(e.target.value)} style={{ width: '100%', height: 36 }} /></div>
        <div className={s.col}><label className={s.label}>背景色</label><input type="color" value={bg} onChange={e => setBg(e.target.value)} style={{ width: '100%', height: 36 }} /></div>
      </div>
      <div className={s.row}>
        <div className={s.col}>
          <label className={s.label}>Logo 图片（可选）</label>
          <input type="file" accept="image/*" onChange={handleLogoUpload} />
          {logo && <button className={`${s.btn} ${s.btnOutline}`} style={{ marginTop: 4 }} onClick={() => setLogo(null)}>清除 Logo</button>}
        </div>
        {logo && (
          <div className={s.col}>
            <label className={s.label}>Logo 大小 ({Math.round(logoSize * 100)}%)</label>
            <input type="range" className={s.slider} min="0.1" max="0.35" step="0.02" value={logoSize} onChange={e => setLogoSize(Number(e.target.value))} />
          </div>
        )}
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={generate}>生成二维码</button>
      {qr && (
        <div className={s.card} style={{ textAlign: 'center' }}>
          <img src={qr} alt="QR" style={{ borderRadius: 'var(--radius-sm)' }} />
          <div style={{ marginTop: 12 }}>
            <a href={qr} download="qrcode.png" className={`${s.btn} ${s.btnSecondary}`}>下载</a>
          </div>
        </div>
      )}
    </div>
  );
}
