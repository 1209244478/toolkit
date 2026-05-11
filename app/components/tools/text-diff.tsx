'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function TextDiff() {
  const { tc } = useToolI18n('text-diff');
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [diff, setDiff] = useState<{type:string;text:string}[]>([]);
  const compare = () => {
    const l = left.split('\n'), r = right.split('\n');
    const result: {type:string;text:string}[] = [];
    const maxLen = Math.max(l.length, r.length);
    for (let i = 0; i < maxLen; i++) {
      const ll = l[i] ?? '', rr = r[i] ?? '';
      if (ll === rr) result.push({type:'same',text:ll});
      else { if (ll) result.push({type:'del',text:ll}); if (rr) result.push({type:'add',text:rr}); }
    }
    setDiff(result);
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>{tc('original','原始文本')}</label><textarea className={s.textarea} value={left} onChange={e=>setLeft(e.target.value)} /></div>
        <div className={s.col}><label className={s.label}>{tc('modified','修改文本')}</label><textarea className={s.textarea} value={right} onChange={e=>setRight(e.target.value)} /></div>
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={compare}>{tc('compare','对比')}</button>
      {diff.length > 0 && (
        <div className={s.col}>
          <label className={s.label}>{tc('diffResult','差异结果')}</label>
          <div className={s.output} style={{fontFamily:'monospace'}}>
            {diff.map((d,i) => (
              <div key={i} style={{background:d.type==='add'?'#e8f8ef':d.type==='del'?'#ffe5e5':'transparent',padding:'2px 4px',borderLeft:d.type==='add'?'3px solid #1a7f37':d.type==='del'?'3px solid #c41e3a':'3px solid transparent'}}>
                <span style={{color:d.type==='add'?'#1a7f37':d.type==='del'?'#c41e3a':'#999',marginRight:8}}>{d.type==='add'?'+':d.type==='del'?'-':' '}</span>
                {d.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
