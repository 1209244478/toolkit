'use client';
import { useState, useEffect } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function IpLookup() {
  const { tc } = useToolI18n('ip-lookup');
  const [ip, setIp] = useState('');
  const [details, setDetails] = useState<Record<string,string>|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const lookup = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      setDetails({
        'IP 地址': data.ip || '',
        '城市': data.city || '',
        '地区': data.region || '',
        '国家': data.country_name || '',
        '邮政编码': data.postal || '',
        '纬度': data.latitude ? String(data.latitude) : '',
        '经度': data.longitude ? String(data.longitude) : '',
        '时区': data.timezone || '',
        'ISP': data.org || '',
        'ASN': data.asn || '',
      });
      setIp(data.ip || '');
    } catch { setError('查询失败，请检查网络连接'); setDetails(null); }
    setLoading(false);
  };
  return (
    <div className={s.toolContainer}>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={lookup} disabled={loading}>{loading?'查询中...':'查询我的 IP'}</button>
      {error && <div className={s.errorMsg}>{error}</div>}
      {details && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12}}>
          {Object.entries(details).map(([key, val]) => val ? (
            <div key={key} className={s.card} style={{padding:'12px 16px'}}>
              <div style={{fontSize:'.75rem',color:'var(--text-sec)',marginBottom:2}}>{key}</div>
              <div style={{fontSize:'.875rem',fontWeight:500}}>{val}</div>
            </div>
          ) : null)}
        </div>
      )}
    </div>
  );
}
