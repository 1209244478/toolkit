'use client';
import { use } from 'react';
import Link from 'next/link';
import { TOOL_MAP } from '@/app/lib/tools';
import { TOOL_COMPONENTS } from '@/app/lib/tool-registry';
import { useI18n } from '@/app/lib/i18n';
import styles from './ToolLayout.module.css';

export default function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const tool = TOOL_MAP[slug];
  const Component = TOOL_COMPONENTS[slug];
  const { t } = useI18n();

  if (!tool || !Component) {
    return (
      <div className={styles.toolLayout}>
        <div className={styles.toolHeader}>
          <div className={styles.toolHeaderInner}>
            <Link href="/" className={styles.backLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              {t.toolPage.back}
            </Link>
            <span style={{fontSize:'1.125rem',fontWeight:600,color:'var(--ink)'}}>{t.toolPage.notFound}</span>
          </div>
        </div>
        <div className={styles.toolBody}>
          <div style={{textAlign:'center',padding:60,color:'var(--text-sec)'}}>
            <div style={{fontSize:'3rem',marginBottom:16}}>🔍</div>
            <p>{t.toolPage.notFoundDesc}</p>
            <Link href="/" className={styles.backLink} style={{fontSize:'1rem',marginTop:16}}>{t.toolPage.backHome}</Link>
          </div>
        </div>
      </div>
    );
  }

  const toolT = t.tools[tool.slug];
  const name = toolT?.name || tool.name;
  const desc = toolT?.desc || tool.desc;

  return (
    <div className={styles.toolLayout}>
      <div className={styles.toolHeader}>
        <div className={styles.toolHeaderInner}>
          <Link href="/" className={styles.backLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            {t.toolPage.back}
          </Link>
          <span className={styles.toolHeaderIcon}>{tool.icon}</span>
          <div className={styles.toolHeaderInfo}>
            <div className={styles.toolHeaderName}>{name}</div>
            <div className={styles.toolHeaderDesc}>{desc}</div>
          </div>
        </div>
      </div>
      <div className={styles.toolBody}>
        <Component />
      </div>
    </div>
  );
}
