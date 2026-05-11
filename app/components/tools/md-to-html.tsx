'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

function mdToHtml(md: string): string {
  let html = md
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^(\- .+(?:\n\- .+)*)/gm, (m) => {
      const items = m.split('\n').map(line => `<li>${line.replace(/^- /, '')}</li>`).join('');
      return `<ul>${items}</ul>`;
    })
    .replace(/^(\d+\. .+(?:\n\d+\. .+)*)/gm, (m) => {
      const items = m.split('\n').map(line => `<li>${line.replace(/^\d+\. /, '')}</li>`).join('');
      return `<ol>${items}</ol>`;
    })
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br/>');
  return '<p>' + html + '</p>';
}

export default function MdToHtml() {
  const { tc } = useToolI18n('md-to-html');
  const [md, setMd] = useState('# 标题\n\n这是一段 **Markdown** 文本。\n\n- 列表项 1\n- 列表项 2');
  const [html, setHtml] = useState('');
  const convert = () => { setHtml(mdToHtml(md)); };
  return (
    <div className={s.toolContainer}>
      <div className={s.col}><label className={s.label}>Markdown 输入</label><textarea className={s.textarea} style={{minHeight:200}} value={md} onChange={e=>setMd(e.target.value)} /></div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={convert}>转换</button>
      <div className={s.col}><label className={s.label}>HTML 输出</label><div className={s.outputWrap}><div className={s.output} style={{maxHeight:300,overflow:'auto'}}>{html}</div>{html && <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(html)}>复制</button>}</div></div>
    </div>
  );
}
