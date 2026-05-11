'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

function decodeBase64(str: string) {
  try { return decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')); }
  catch { return atob(str); }
}

export default function JwtParser() {
  const { tc } = useToolI18n('jwt-parser');
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');
  const parse = () => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('无效的 JWT 格式，应包含 3 个部分');
      setHeader(JSON.stringify(JSON.parse(decodeBase64(parts[0])), null, 2));
      setPayload(JSON.stringify(JSON.parse(decodeBase64(parts[1])), null, 2));
      setError('');
    } catch (e: unknown) { setError((e as Error).message); setHeader(''); setPayload(''); }
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.col}>
        <label className={s.label}>JWT Token</label>
        <textarea className={s.textarea} value={token} onChange={e=>setToken(e.target.value)} placeholder="粘贴 JWT Token..." />
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={parse} disabled={!token}>解析</button>
      {error && <div className={s.errorMsg}>{error}</div>}
      <div className={s.row}>
        <div className={s.col}>
          <label className={s.label}>Header</label>
          <div className={s.outputWrap}><div className={s.output}>{header}</div>{header && <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(header)}>复制</button>}</div>
        </div>
        <div className={s.col}>
          <label className={s.label}>Payload</label>
          <div className={s.outputWrap}><div className={s.output}>{payload}</div>{payload && <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(payload)}>复制</button>}</div>
        </div>
      </div>
    </div>
  );
}
