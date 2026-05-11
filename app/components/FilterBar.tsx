'use client';

import { useI18n } from '@/app/lib/i18n';
import { ToolCategory } from '@/app/lib/tools';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FILTER_KEYS: { key: string; catKey: string }[] = [
  { key: 'all', catKey: 'all' },
  { key: 'text', catKey: 'text' },
  { key: 'image', catKey: 'image' },
  { key: 'dev', catKey: 'dev' },
  { key: 'data', catKey: 'data' },
  { key: 'design', catKey: 'design' },
  { key: 'net', catKey: 'net' },
  { key: 'calc', catKey: 'calc' },
  { key: 'fun', catKey: 'fun' },
];

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const { t } = useI18n();

  return (
    <div className={styles.filterBar}>
      {FILTER_KEYS.map(({ key, catKey }) => (
        <button
          key={key}
          className={`${styles.filterBtn} ${activeFilter === key ? styles.filterBtnActive : ''}`}
          onClick={() => onFilterChange(key)}
        >
          {t.filter[catKey as keyof typeof t.filter]}
        </button>
      ))}
    </div>
  );
}
