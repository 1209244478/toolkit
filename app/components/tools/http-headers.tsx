'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function HttpHeaders() {
  const { tc } = useToolI18n('http-headers');
  const [url, setUrl] = useState('https://www.apple.com');
  const [headers, setHeaders] = useState<Record<string,string>|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const check = async () => {
    setLoading(true); setError(''); setHeaders(null);
    try {
      const res = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      const h: Record<string,string> = {};
      res.headers.forEach((val, key) => { h[key] = val; });
      if (Object.keys(h).length === 0) {
        h['提示'] = '由于 CORS 限制，部分响应头无法读取。以下为可获取的信息：';
        h['状态'] = res.type === 'opaque' ? 'opaque (跨域受限)' : String(res.status);
      }
      setHeaders(h);
    } catch (e: unknown) { setError((e as Error).message); }
    setLoading(false);
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.col}><label className={s.label}>网址</label><input className={s.input} value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com" /></div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={check} disabled={loading||!url}>{loading?'查询中...':'查看 Headers'}</button>
      {error && <div className={s.errorMsg}>{error}</div>}
      {headers && (
        <div className={s.col}>
          {Object.entries(headers).map(([key, val]) => (
            <div key={key} style={{display:'flex',gap:8,padding:'8px 0',borderBottom:'1px solid var(--border-soft)'}}>
              <span style={{fontWeight:600,minWidth:160,color:'var(--accent)',fontSize:'.8125rem'}}>{key}</span>
              <span style={{fontSize:'.8125rem',wordBreak:'break-all'}}>{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
