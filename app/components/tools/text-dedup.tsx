'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function TextDedup() {
  const { tc } = useToolI18n('text-dedup');
  const [input, setInput] = useState('');
  const [sortMode, setSortMode] = useState<'none'|'alpha'|'length'>('none');
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const result = useMemo(() => {
    let lines = input.split('\n');
    if (removeEmpty) lines = lines.filter(l => l.trim());
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const l of lines) { if (!seen.has(l)) { seen.add(l); unique.push(l); } }
    if (sortMode === 'alpha') unique.sort((a,b) => a.localeCompare(b));
    if (sortMode === 'length') unique.sort((a,b) => a.length - b.length);
    return { text: unique.join('\n'), removed: lines.length - unique.length, total: unique.length };
  }, [input, sortMode, removeEmpty]);
  return (
    <div className={s.toolContainer}>
      <div className={s.col}>
        <label className={s.label}>输入文本（每行一项）</label>
        <textarea className={s.textarea} value={input} onChange={e=>setInput(e.target.value)} placeholder="每行一个条目..." />
      </div>
      <div className={s.btnGroup}>
        <label style={{display:'flex',alignItems:'center',gap:6,fontSize:'.8125rem',cursor:'pointer'}}>
          <input type="checkbox" className={s.checkbox} checked={removeEmpty} onChange={e=>setRemoveEmpty(e.target.checked)} /> 去除空行
        </label>
        <select className={s.select} value={sortMode} onChange={e=>setSortMode(e.target.value as 'none'|'alpha'|'length')}>
          <option value="none">不排序</option><option value="alpha">按字母排序</option><option value="length">按长度排序</option>
        </select>
      </div>
      <div className={s.col}>
        <label className={s.label}>结果（{result.total} 行，去除 {result.removed} 个重复）</label>
        <div className={s.outputWrap}><div className={s.output}>{result.text}</div>
        {result.text && <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(result.text)}>复制</button>}</div>
      </div>
    </div>
  );
}
