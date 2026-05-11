'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function PasswordGenerator() {
  const { tc } = useToolI18n('password-generator');
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [result, setResult] = useState('');
  const generate = () => {
    let chars = '';
    if (useLower) chars += excludeAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) chars += excludeAmbiguous ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useDigits) chars += excludeAmbiguous ? '23456789' : '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { setResult('请至少选择一种字符类型'); return; }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setResult(Array.from(arr, v => chars[v % chars.length]).join(''));
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.col}><label className={s.label}>密码长度 ({length})</label><input type="range" className={s.slider} min="4" max="64" value={length} onChange={e=>setLength(Number(e.target.value))} /></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {[
          {label:'大写字母 (A-Z)',val:useUpper,set:setUseUpper},
          {label:'小写字母 (a-z)',val:useLower,set:setUseLower},
          {label:'数字 (0-9)',val:useDigits,set:setUseDigits},
          {label:'特殊字符 (!@#$)',val:useSymbols,set:setUseSymbols},
        ].map(o=>(
          <label key={o.label} style={{display:'flex',alignItems:'center',gap:8,fontSize:'.8125rem',cursor:'pointer',padding:'8px 12px',background:'var(--white)',borderRadius:'var(--radius-sm)',border:'1px solid var(--border-soft)'}}>
            <input type="checkbox" className={s.checkbox} checked={o.val} onChange={e=>o.set(e.target.checked)} /> {o.label}
          </label>
        ))}
      </div>
      <label style={{display:'flex',alignItems:'center',gap:8,fontSize:'.8125rem',cursor:'pointer'}}>
        <input type="checkbox" className={s.checkbox} checked={excludeAmbiguous} onChange={e=>setExcludeAmbiguous(e.target.checked)} /> 排除易混淆字符 (0O1lI)
      </label>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={generate}>生成密码</button>
      {result && <div className={s.col}><label className={s.label}>结果</label><div className={s.outputWrap}><div className={s.output} style={{fontFamily:'monospace',fontSize:'1rem',letterSpacing:1}}>{result}</div><button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(result)}>复制</button></div></div>}
    </div>
  );
}
