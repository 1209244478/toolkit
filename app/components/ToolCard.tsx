'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Tool } from '@/app/lib/tools';
import { useI18n } from '@/app/lib/i18n';
import styles from './ToolCard.module.css';

const CAT_CLASS: Record<string, string> = {
  text: styles.catText,
  image: styles.catImage,
  dev: styles.catDev,
  data: styles.catData,
  design: styles.catDesign,
  net: styles.catNet,
  calc: styles.catCalc,
  fun: styles.catFun,
};

const BADGE_CLASS: Record<string, string> = {
  new: styles.badgeNew,
  hot: styles.badgeHot,
  pop: styles.badgePop,
};

const BADGE_LABEL: Record<string, Record<string, string>> = {
  new: { zh: 'NEW', en: 'NEW' },
  hot: { zh: 'HOT', en: 'HOT' },
  pop: { zh: '热门', en: 'POPULAR' },
};

export default function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const { locale, t } = useI18n();

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${index * 0.03}s`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  const toolT = t.tools[tool.slug];
  const name = toolT?.name || tool.name;
  const desc = toolT?.desc || tool.desc;
  const catLabel = t.filter[tool.cat as keyof typeof t.filter];
  const badgeLabel = tool.badge ? BADGE_LABEL[tool.badge]?.[locale] : undefined;

  const href = tool.externalUrl || `/tools/${tool.slug}`;
  const isExternal = !!tool.externalUrl;

  return isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      ref={cardRef as React.Ref<HTMLAnchorElement>}
      className={`${styles.toolCard} ${CAT_CLASS[tool.cat] || ''}`}
      style={{ opacity: 0, transform: 'translateY(12px)', transition: 'all .3s cubic-bezier(.25,.1,.25,1)', textDecoration:'none' }}
    >
      <div className={styles.toolIcon}>{tool.icon}</div>
      <div className={styles.toolName}>{name}</div>
      <div className={styles.toolDesc}>{desc}</div>
      <div className={styles.toolMeta}>
        <span className={styles.toolTag}>{catLabel}</span>
        {tool.badge && badgeLabel && (
          <span className={`${styles.toolBadge} ${BADGE_CLASS[tool.badge]}`}>
            {badgeLabel}
          </span>
        )}
      </div>
    </a>
  ) : (
    <Link
      href={href}
      ref={cardRef}
      className={`${styles.toolCard} ${CAT_CLASS[tool.cat] || ''}`}
      style={{ opacity: 0, transform: 'translateY(12px)', transition: 'all .3s cubic-bezier(.25,.1,.25,1)', textDecoration:'none' }}
    >
      <div className={styles.toolIcon}>{tool.icon}</div>
      <div className={styles.toolName}>{name}</div>
      <div className={styles.toolDesc}>{desc}</div>
      <div className={styles.toolMeta}>
        <span className={styles.toolTag}>{catLabel}</span>
        {tool.badge && badgeLabel && (
          <span className={`${styles.toolBadge} ${BADGE_CLASS[tool.badge]}`}>
            {badgeLabel}
          </span>
        )}
      </div>
    </Link>
  );
}
