'use client';

import { useI18n } from '@/app/lib/i18n';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className={styles.footer}>
      <p className={styles.footerText}>{t.footer.text}</p>
      <div className={styles.footerLinks}>
        <a className={styles.footerLink} href="#">{t.footer.github}</a>
        <a className={styles.footerLink} href="#">{t.footer.feedback}</a>
        <a className={styles.footerLink} href="#">{t.footer.about}</a>
      </div>
    </footer>
  );
}
