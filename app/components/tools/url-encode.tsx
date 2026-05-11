'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function UrlEncode() {
  const { tc } = useToolI18n('url-encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  return (
    <div className={s.toolContainer}>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${mode === 'encode' ? s.btnPrimary : s.btnOutline}`} onClick={() => setMode('encode')}>{tc('encode','编码')}</button>
        <button className={`${s.btn} ${mode === 'decode' ? s.btnPrimary : s.btnOutline}`} onClick={() => setMode('decode')}>{tc('decode','解码')}</button>
      </div>
      <div className={s.col}>
        <label className={s.label}>{mode === 'encode' ? tc('rawText','原始文本') : tc('encodedUrl','已编码 URL')}</label>
        <textarea className={s.textarea} value={input} onChange={e => setInput(e.target.value)} placeholder="..." />
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => { try { setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input)); } catch { setOutput(tc('convertFail','转换失败')); } }}>{tc('convert','转换')}</button>
      <div className={s.col}>
        <label className={s.label}>{tc('result','结果')}</label>
        <div className={s.outputWrap}><div className={s.output}>{output}</div>
        {output && <button className={s.copyBtn} onClick={() => navigator.clipboard.writeText(output)}>{tc('copy','复制')}</button>}</div>
      </div>
    </div>
  );
}
