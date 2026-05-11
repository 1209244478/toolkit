'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

function parseUA(ua: string) {
  const browser = ua.includes('Edg/') ? 'Microsoft Edge' : ua.includes('Chrome/') ? 'Google Chrome' : ua.includes('Firefox/') ? 'Mozilla Firefox' : ua.includes('Safari/') ? 'Apple Safari' : '未知浏览器';
  const bMatch = ua.match(/(Chrome|Firefox|Safari|Edg)\/([\d.]+)/);
  const os = ua.includes('Windows') ? 'Windows' : ua.includes('Mac OS') ? 'macOS' : ua.includes('Linux') ? 'Linux' : ua.includes('Android') ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : '未知系统';
  const osMatch = ua.match(/(Windows NT [\d.]+|Mac OS X [\d_]+|Android [\d.]+|iPhone OS [\d_]+)/);
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
  return { browser, browserVer: bMatch?.[2] ?? '', os, osVer: osMatch?.[1]?.replace(/_/g,'.') ?? '', isMobile, ua };
}

export default function UaParser() {
  const { tc } = useToolI18n('ua-parser');
  const [input, setInput] = useState('');
  const info = useMemo(() => parseUA(input || (typeof navigator !== 'undefined' ? navigator.userAgent : '')), [input]);
  return (
    <div className={s.toolContainer}>
      <div className={s.col}>
        <label className={s.label}>User-Agent 字符串（留空使用当前浏览器）</label>
        <textarea className={s.textarea} value={input} onChange={e=>setInput(e.target.value)} placeholder="粘贴 UA 字符串..." />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
        {[
          {label:'浏览器',value:`${info.browser} ${info.browserVer}`},
          {label:'操作系统',value:`${info.os} ${info.osVer}`},
          {label:'设备类型',value:info.isMobile?'移动端':'桌面端'},
        ].map(item=>(
          <div key={item.label} className={s.card} style={{textAlign:'center'}}>
            <div style={{fontSize:'1.125rem',fontWeight:600,color:'var(--accent)'}}>{item.value}</div>
            <div style={{fontSize:'.75rem',color:'var(--text-sec)',marginTop:4}}>{item.label}</div>
          </div>
        ))}
      </div>
      <div className={s.col}>
        <label className={s.label}>完整 UA</label>
        <div className={s.outputWrap}><div className={s.output} style={{fontSize:'.75rem',wordBreak:'break-all'}}>{info.ua}</div>
        <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(info.ua)}>复制</button></div>
      </div>
    </div>
  );
}
