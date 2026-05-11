'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/app/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Header.module.css';

export default function Header({ toolCount }: { toolCount: number }) {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <a className={styles.logo} href="#">
        TOOL<span className={styles.logoAccent}>KIT</span>
      </a>
      <nav className={styles.nav}>
        <a className={styles.navLink} href="#tools">{t.header.tools}</a>
        <a className={styles.navCount} href="#">{t.header.toolCount.replace('{count}', String(toolCount))}</a>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
