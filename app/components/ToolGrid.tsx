'use client';

import { Tool } from '@/app/lib/tools';
import ToolCard from './ToolCard';
import styles from './ToolGrid.module.css';

interface ToolGridProps {
  tools: Tool[];
}

export default function ToolGrid({ tools }: ToolGridProps) {
  return (
    <div className={styles.contentSection}>
      <section className={styles.toolsSection} id="tools">
        {tools.length > 0 ? (
          <div className={styles.toolGrid}>
            {tools.map((tool, i) => (
              <ToolCard key={`${tool.cat}-${tool.name}`} tool={tool} index={i} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <p className={styles.emptyText}>没有找到匹配的工具，试试其他关键词？</p>
          </div>
        )}
      </section>
    </div>
  );
}
