'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n, LOCALE_LABELS, Locale } from '@/app/lib/i18n';
import styles from './LanguageSwitcher.module.css';

const LOCALES: Locale[] = ['zh', 'en'];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.switcher} ref={ref}>
      <button className={styles.btn} onClick={() => setOpen(!open)}>
        <svg className={styles.globe} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {LOCALE_LABELS[locale]}
      </button>
      {open && (
        <div className={styles.dropdown}>
          {LOCALES.map(l => (
            <button
              key={l}
              className={`${styles.option} ${l === locale ? styles.optionActive : ''}`}
              onClick={() => { setLocale(l); setOpen(false); }}
            >
              {l === locale && (
                <svg className={styles.check} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
              )}
              <span style={{ marginLeft: l === locale ? 0 : 22 }}>{LOCALE_LABELS[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
