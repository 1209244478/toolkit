'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

function mdToHtml(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br/>');
  return '<p>' + html + '</p>';
}

export default function MarkdownEditor() {
  const { tc } = useToolI18n('markdown-editor');
  const [md, setMd] = useState('# Hello World\n\n这是一段 **Markdown** 文本。\n\n- 列表项 1\n- 列表项 2\n\n[链接](https://example.com)');
  const html = useMemo(() => mdToHtml(md), [md]);
  return (
    <div className={s.toolContainer}>
      <div className={s.row} style={{minHeight:400}}>
        <div className={s.col} style={{flex:1}}>
          <label className={s.label}>Markdown 输入</label>
          <textarea className={s.textarea} style={{minHeight:380}} value={md} onChange={e=>setMd(e.target.value)} />
        </div>
        <div className={s.col} style={{flex:1}}>
          <label className={s.label}>预览</label>
          <div className={s.output} style={{minHeight:380,overflow:'auto'}} dangerouslySetInnerHTML={{__html:html}} />
        </div>
      </div>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => navigator.clipboard.writeText(html)}>复制 HTML</button>
      </div>
    </div>
  );
}
