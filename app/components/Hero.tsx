'use client';

import { useI18n } from '@/app/lib/i18n';
import { TOOLS, Tool } from '@/app/lib/tools';
import styles from './Hero.module.css';

interface HeroProps {
  toolCount: number;
  searchQuery: string;
  resultCount: number;
  onSearchChange: (query: string) => void;
}

const HOT_TOOLS = TOOLS.filter((t: Tool) => t.badge === 'hot');

export default function Hero({ toolCount, searchQuery, resultCount, onSearchChange }: HeroProps) {
  const { t, locale } = useI18n();

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          <span>{t.hero.badge}</span>
        </div>
        <h1 className={styles.heroTitle}>
          {t.hero.title1}<br /><em className={styles.heroTitleEm}>{t.hero.title2}</em>
        </h1>
        <p className={styles.heroSafe}>
          {t.hero.safeTag}
        </p>
        <p className={styles.heroSub}>
          {t.hero.subtitle}
        </p>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder={t.hero.searchPlaceholder}
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <span className={styles.searchCount}>{t.hero.resultCount.replace('{count}', String(resultCount))}</span>
          )}
        </div>
        {HOT_TOOLS.length > 0 && (
          <div className={styles.hotTools}>
            <div className={styles.hotToolsLabel}>{t.hero.hotTools}</div>
            <div className={styles.hotToolsList}>
              {HOT_TOOLS.map((tool: Tool) => {
                const toolT = t.tools[tool.slug];
                const name = toolT?.name || tool.name;
                const href = tool.externalUrl || `/tools/${tool.slug}`;
                const isExternal = !!tool.externalUrl;
                return isExternal ? (
                  <a key={tool.slug} href={href} target="_blank" rel="noopener noreferrer" className={styles.hotToolTag}>
                    <span className={styles.hotToolIcon}>{tool.icon}</span>
                    <span>{name}</span>
                  </a>
                ) : (
                  <a key={tool.slug} href={href} className={styles.hotToolTag}>
                    <span className={styles.hotToolIcon}>{tool.icon}</span>
                    <span>{name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
        <div className={styles.stats}>
          <div><span className={styles.statNum}>{toolCount}</span><span className={styles.statLabel}>{t.hero.statTools}</span></div>
          <div><span className={styles.statNum}>8</span><span className={styles.statLabel}>{t.hero.statCategories}</span></div>
          <div><span className={styles.statNum}>0</span><span className={styles.statLabel}>{t.hero.statUpload}</span></div>
        </div>
      </div>
    </section>
  );
}
