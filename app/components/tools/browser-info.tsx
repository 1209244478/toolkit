'use client';
import { useState, useEffect } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function BrowserInfo() {
  const { tc } = useToolI18n('browser-info');
  const [info, setInfo] = useState<Record<string,string>>({});
  useEffect(() => {
    const ua = navigator.userAgent;
    const browser = ua.includes('Edg/') ? 'Microsoft Edge' : ua.includes('Chrome/') ? 'Google Chrome' : ua.includes('Firefox/') ? 'Mozilla Firefox' : ua.includes('Safari/') ? 'Apple Safari' : '未知';
    const os = ua.includes('Windows') ? 'Windows' : ua.includes('Mac OS') ? 'macOS' : ua.includes('Linux') ? 'Linux' : '未知';
    setInfo({
      '浏览器': browser,
      '操作系统': os,
      'User-Agent': ua,
      '屏幕分辨率': `${screen.width} × ${screen.height}`,
      '可用区域': `${screen.availWidth} × ${screen.availHeight}`,
      '设备像素比': String(window.devicePixelRatio),
      '颜色深度': `${screen.colorDepth} 位`,
      '语言': navigator.language,
      'Cookie 启用': navigator.cookieEnabled ? '是' : '否',
      '在线状态': navigator.onLine ? '在线' : '离线',
      '平台': navigator.platform,
      '逻辑处理器': navigator.hardwareConcurrency ? String(navigator.hardwareConcurrency) : '未知',
      '最大触控点': String(navigator.maxTouchPoints),
      '窗口大小': `${window.innerWidth} × ${window.innerHeight}`,
    });
  }, []);
  return (
    <div className={s.toolContainer}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
        {Object.entries(info).map(([key, val]) => (
          <div key={key} className={s.card} style={{padding:'12px 16px'}}>
            <div style={{fontSize:'.75rem',color:'var(--text-sec)',marginBottom:2}}>{key}</div>
            <div style={{fontSize:'.8125rem',fontWeight:500,wordBreak:'break-all'}}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
