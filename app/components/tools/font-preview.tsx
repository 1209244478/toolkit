'use client';
import { useState, useEffect } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

const GOOGLE_FONTS = [
  { family: 'Inter', category: 'sans-serif' },
  { family: 'Noto Sans SC', category: 'sans-serif' },
  { family: 'Roboto', category: 'sans-serif' },
  { family: 'Open Sans', category: 'sans-serif' },
  { family: 'Lato', category: 'sans-serif' },
  { family: 'Montserrat', category: 'sans-serif' },
  { family: 'Poppins', category: 'sans-serif' },
  { family: 'Nunito', category: 'sans-serif' },
  { family: 'Raleway', category: 'sans-serif' },
  { family: 'Oswald', category: 'sans-serif' },
  { family: 'Playfair Display', category: 'serif' },
  { family: 'Merriweather', category: 'serif' },
  { family: 'Lora', category: 'serif' },
  { family: 'PT Serif', category: 'serif' },
  { family: 'IBM Plex Sans', category: 'sans-serif' },
  { family: 'Source Sans 3', category: 'sans-serif' },
  { family: 'Noto Serif SC', category: 'serif' },
  { family: 'LXGW WenKai', category: 'sans-serif' },
  { family: 'ZCOOL KuaiLe', category: 'display' },
  { family: 'Ma Shan Zheng', category: 'handwriting' },
  { family: 'Dancing Script', category: 'handwriting' },
  { family: 'Pacifico', category: 'handwriting' },
  { family: 'Fira Code', category: 'monospace' },
  { family: 'JetBrains Mono', category: 'monospace' },
  { family: 'Source Code Pro', category: 'monospace' },
  { family: 'Space Mono', category: 'monospace' },
  { family: 'Abril Fatface', category: 'display' },
  { family: 'Bebas Neue', category: 'display' },
  { family: 'Comfortaa', category: 'display' },
  { family: 'Righteous', category: 'display' },
];

export default function FontPreview() {
  const { tc } = useToolI18n('font-preview');
  const [text, setText] = useState('你好世界 Hello World 0123');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(32);
  const [fontWeight, setFontWeight] = useState(400);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [color, setColor] = useState('#1d1d1f');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}&display=swap`;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [fontFamily]);

  const filteredFonts = categoryFilter === 'all'
    ? GOOGLE_FONTS
    : GOOGLE_FONTS.filter(f => f.category === categoryFilter);

  const cssCode = `font-family: '${fontFamily}', sans-serif;\nfont-size: ${fontSize}px;\nfont-weight: ${fontWeight};\nletter-spacing: ${letterSpacing}px;\nline-height: ${lineHeight};\ncolor: ${color};`;

  return (
    <div className={s.toolContainer}>
      <div className={s.col}>
        <label className={s.label}>预览文本</label>
        <textarea className={s.textarea} value={text} onChange={e=>setText(e.target.value)} />
      </div>
      <div className={s.row}>
        <div className={s.col}>
          <label className={s.label}>字体筛选</label>
          <select className={s.select} value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}>
            <option value="all">全部</option>
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
            <option value="handwriting">Handwriting</option>
            <option value="display">Display</option>
          </select>
        </div>
        <div className={s.col} style={{flex:2}}>
          <label className={s.label}>当前字体: {fontFamily}</label>
          <select className={s.select} value={fontFamily} onChange={e=>setFontFamily(e.target.value)} size={6} style={{height:140}}>
            {filteredFonts.map(f => (
              <option key={f.family} value={f.family}>{f.family} ({f.category})</option>
            ))}
          </select>
        </div>
      </div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>字号 ({fontSize}px)</label><input type="range" className={s.slider} min="12" max="96" value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>字重 ({fontWeight})</label><input type="range" className={s.slider} min="100" max="900" step="100" value={fontWeight} onChange={e=>setFontWeight(Number(e.target.value))} /></div>
      </div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>字距 ({letterSpacing}px)</label><input type="range" className={s.slider} min="-5" max="20" value={letterSpacing} onChange={e=>setLetterSpacing(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>行高 ({lineHeight})</label><input type="range" className={s.slider} min="0.8" max="3" step="0.1" value={lineHeight} onChange={e=>setLineHeight(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>颜色</label><input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{width:'100%',height:36}} /></div>
      </div>
      <div className={s.card} style={{minHeight:120,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{fontFamily:`'${fontFamily}', sans-serif`,fontSize,fontWeight,letterSpacing:`${letterSpacing}px`,lineHeight,color,whiteSpace:'pre-wrap' as const}}>{text}</div>
      </div>
      <div className={s.col}>
        <label className={s.label}>CSS 代码</label>
        <div className={s.outputWrap}><div className={s.output}>{cssCode}</div>
        <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(cssCode)}>复制</button></div>
      </div>
    </div>
  );
}
