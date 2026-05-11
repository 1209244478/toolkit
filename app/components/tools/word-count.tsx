'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function WordCount() {
  const { tc } = useToolI18n('word-count');
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0;
    const readMin = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));
    return { chars, charsNoSpace, words, lines, paragraphs, readMin };
  }, [text]);
  return (
    <div className={s.toolContainer}>
      <div className={s.col}>
        <label className={s.label}>输入文本</label>
        <textarea className={s.textarea} style={{minHeight:200}} value={text} onChange={e=>setText(e.target.value)} placeholder="输入或粘贴文本..." />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>
        {[
          {label:'字符数',value:stats.chars},{label:'字符数（不含空格）',value:stats.charsNoSpace},
          {label:'单词数',value:stats.words},{label:'行数',value:stats.lines},
          {label:'段落数',value:stats.paragraphs},{label:'阅读时间',value:stats.readMin === 0 ? '少于 1 分钟' : `约 ${stats.readMin} 分钟`},
        ].map(item=>(
          <div key={item.label} className={s.card} style={{textAlign:'center'}}>
            <div style={{fontSize:'1.75rem',fontWeight:600,color:'var(--accent)',letterSpacing:'-0.02em'}}>{item.value}</div>
            <div style={{fontSize:'.75rem',color:'var(--text-sec)',marginTop:4}}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
