'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function Base64Tool() {
  const { tc } = useToolI18n('base64');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const encode = () => { try { setOutput(btoa(unescape(encodeURIComponent(input)))); } catch { setOutput(tc('encodeFail','编码失败')); } };
  const decode = () => { try { setOutput(decodeURIComponent(escape(atob(input)))); } catch { setOutput(tc('decodeFail','解码失败，请确认输入是有效的 Base64')); } };
  return (
    <div className={s.toolContainer}>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${mode === 'encode' ? s.btnPrimary : s.btnOutline}`} onClick={() => setMode('encode')}>{tc('encode','编码')}</button>
        <button className={`${s.btn} ${mode === 'decode' ? s.btnPrimary : s.btnOutline}`} onClick={() => setMode('decode')}>{tc('decode','解码')}</button>
      </div>
      <div className={s.col}>
        <label className={s.label}>{mode === 'encode' ? tc('rawText','原始文本') : tc('base64Str','Base64 字符串')}</label>
        <textarea className={s.textarea} value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? '...' : 'Base64...'} />
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={mode === 'encode' ? encode : decode}>{mode === 'encode' ? tc('encodeBtn','编码') : tc('decodeBtn','解码')}</button>
      <div className={s.col}>
        <label className={s.label}>{tc('result','结果')}</label>
        <div className={s.outputWrap}><div className={s.output}>{output}</div>
        {output && <button className={s.copyBtn} onClick={() => navigator.clipboard.writeText(output)}>{tc('copy','复制')}</button>}</div>
      </div>
    </div>
  );
}
