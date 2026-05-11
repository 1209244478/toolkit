'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function HtmlEscape() {
  const { tc } = useToolI18n('html-escape');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'escape'|'unescape'>('escape');
  const escape = (t: string) => t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  const unescape = (t: string) => { const el = document.createElement('textarea'); el.innerHTML = t; return el.value; };
  return (
    <div className={s.toolContainer}>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${mode==='escape'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMode('escape')}>转义</button>
        <button className={`${s.btn} ${mode==='unescape'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMode('unescape')}>反转义</button>
      </div>
      <div className={s.col}>
        <label className={s.label}>{mode==='escape'?'原始 HTML':'转义后的 HTML'}</label>
        <textarea className={s.textarea} value={input} onChange={e=>setInput(e.target.value)} placeholder={mode==='escape'?'输入 HTML 代码...':'输入转义后的文本...'} />
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={()=>setOutput(mode==='escape'?escape(input):unescape(input))}>转换</button>
      <div className={s.col}>
        <label className={s.label}>结果</label>
        <div className={s.outputWrap}><div className={s.output}>{output}</div>
        {output && <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(output)}>复制</button>}</div>
      </div>
    </div>
  );
}
