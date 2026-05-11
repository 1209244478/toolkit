'use client';
import { useState, useRef } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function CodeScreenshot() {
  const { tc } = useToolI18n('code-screenshot');
  const [code, setCode] = useState('function hello() {\n  console.log("Hello, World!");\n}');
  const [theme, setTheme] = useState<'dark'|'light'>('dark');
  const [lang, setLang] = useState('JavaScript');
  const [padding, setPadding] = useState(32);
  const ref = useRef<HTMLDivElement>(null);
  const copyAsImage = async () => {
    if (!ref.current) return;
    try {
      const canvas = document.createElement('canvas');
      const dotRowHeight = 36;
      const codeOffset = dotRowHeight + 8;
      const codeLines = code.split('\n');
      const codeHeight = codeLines.length * 22;
      const w = Math.max(ref.current.scrollWidth, 200) + padding * 2;
      const h = padding + codeOffset + codeHeight + padding;
      const r = 18;
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(w - r, 0);
      ctx.arcTo(w, 0, w, r, r);
      ctx.lineTo(w, h - r);
      ctx.arcTo(w, h, w - r, h, r);
      ctx.lineTo(r, h);
      ctx.arcTo(0, h, 0, h - r, r);
      ctx.lineTo(0, r);
      ctx.arcTo(0, 0, r, 0, r);
      ctx.closePath();
      ctx.clip();
      ctx.fillStyle = theme === 'dark' ? '#1e1e2e' : '#f5f5f5';
      ctx.fillRect(0, 0, w, h);
      // 红黄绿三个圆点
      const dotColors = ['#ff5f57', '#febc2e', '#28c840'];
      const dotY = padding + 10;
      dotColors.forEach((c, i) => {
        ctx.beginPath();
        ctx.arc(padding + 8 + i * 22, dotY, 6, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
      });
      // 代码文本
      ctx.fillStyle = theme === 'dark' ? '#cdd6f4' : '#1d1d1f';
      ctx.font = '14px "Courier New", monospace';
      const textY = padding + codeOffset;
      codeLines.forEach((line, i) => {
        ctx.fillText(line, padding, textY + i * 22);
      });
      const link = document.createElement('a');
      link.download = 'code-screenshot.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch {}
  };
  const bg = theme === 'dark' ? '#1e1e2e' : '#f5f5f5';
  const fg = theme === 'dark' ? '#cdd6f4' : '#1d1d1f';
  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>语言</label><select className={s.select} value={lang} onChange={e=>setLang(e.target.value)}><option>JavaScript</option><option>Python</option><option>TypeScript</option><option>HTML</option><option>CSS</option></select></div>
        <div className={s.col}><label className={s.label}>主题</label><select className={s.select} value={theme} onChange={e=>setTheme(e.target.value as 'dark'|'light')}><option value="dark">暗色</option><option value="light">亮色</option></select></div>
        <div className={s.col}><label className={s.label}>内边距 ({padding}px)</label><input type="range" className={s.slider} min="16" max="64" value={padding} onChange={e=>setPadding(Number(e.target.value))} /></div>
      </div>
      <div className={s.col}><label className={s.label}>代码</label><textarea className={s.textarea} value={code} onChange={e=>setCode(e.target.value)} /></div>
      <div ref={ref} style={{background:bg,padding:`${padding}px`,borderRadius:'var(--radius-lg)',border:'1px solid var(--border-soft)',overflow:'auto'}}>
        <div style={{marginBottom:12,display:'flex',gap:6}}><span style={{width:12,height:12,borderRadius:'50%',background:'#ff5f57'}} /><span style={{width:12,height:12,borderRadius:'50%',background:'#febc2e'}} /><span style={{width:12,height:12,borderRadius:'50%',background:'#28c840'}} /></div>
        <pre style={{color:fg,fontFamily:'"Courier New",monospace',fontSize:14,lineHeight:1.6,margin:0,whiteSpace:'pre-wrap'}}>{code}</pre>
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={copyAsImage}>下载截图</button>
    </div>
  );
}
