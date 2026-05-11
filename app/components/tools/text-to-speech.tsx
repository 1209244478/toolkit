'use client';
import { useState, useEffect, useRef } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function TextToSpeech() {
  const { tc } = useToolI18n('text-to-speech');
  const [text, setText] = useState('');
  const [lang, setLang] = useState('zh-CN');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance|null>(null);
  useEffect(() => { return () => { speechSynthesis.cancel(); }; }, []);
  const speak = () => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = rate; u.pitch = pitch;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utterRef.current = u;
    speechSynthesis.speak(u);
    setSpeaking(true);
  };
  const stop = () => { speechSynthesis.cancel(); setSpeaking(false); };
  return (
    <div className={s.toolContainer}>
      <div className={s.col}>
        <label className={s.label}>输入文本</label>
        <textarea className={s.textarea} style={{minHeight:160}} value={text} onChange={e=>setText(e.target.value)} placeholder="输入要朗读的文本..." />
      </div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>语言</label><select className={s.select} value={lang} onChange={e=>setLang(e.target.value)}><option value="zh-CN">中文</option><option value="en-US">English</option><option value="ja-JP">日本語</option><option value="ko-KR">한국어</option></select></div>
        <div className={s.col}><label className={s.label}>语速 ({rate})</label><input type="range" className={s.slider} min="0.5" max="2" step="0.1" value={rate} onChange={e=>setRate(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>音调 ({pitch})</label><input type="range" className={s.slider} min="0.5" max="2" step="0.1" value={pitch} onChange={e=>setPitch(Number(e.target.value))} /></div>
      </div>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={speak} disabled={!text||speaking}>朗读</button>
        <button className={`${s.btn} ${s.btnOutline}`} onClick={stop} disabled={!speaking}>停止</button>
      </div>
    </div>
  );
}
