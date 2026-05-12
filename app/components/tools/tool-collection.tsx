'use client';
import { useEffect } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function ToolCollection() {
  const { tc } = useToolI18n('tool-collection');

  useEffect(() => {
    window.location.href = 'https://tools.nishang2.top/';
  }, []);

  return (
    <div className={s.toolContainer} style={{ textAlign: 'center', padding: '40px 20px' }}>
      <p style={{ color: 'var(--text-sec)', fontSize: '0.875rem' }}>
        {tc('redirecting', '正在跳转到工具大全...')}
      </p>
    </div>
  );
}
