'use client';
import { useEffect } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function AvatarGenerator() {
  const { tc } = useToolI18n('avatar-generator');

  useEffect(() => {
    window.location.href = 'https://avatar.nishang2.top/';
  }, []);

  return (
    <div className={s.toolContainer} style={{ textAlign: 'center', padding: '40px 20px' }}>
      <p style={{ color: 'var(--text-sec)', fontSize: '0.875rem' }}>
        {tc('redirecting', '正在跳转到头像生成工具...')}
      </p>
    </div>
  );
}
