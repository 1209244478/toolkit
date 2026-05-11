'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function RegexTester() {
  const { tc } = useToolI18n('regex-tester');
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{matches:RegExpMatchArray[],highlighted:string}>({matches:[],highlighted:''});
  useMemo(() => {
    if (!pattern || !text) { setResult({ matches: [], highlighted: '' }); setError(''); return; }
    try {
      const re = new RegExp(pattern, flags);
      const matches = [...text.matchAll(re)];
      setError('');
      let highlighted = text;
      const sorted = [...matches].sort((a,b) => b.index - a.index);
      for (const m of sorted) {
        highlighted = highlighted.slice(0, m.index) + '⟨' + m[0] + '⟩' + highlighted.slice(m.index + m[0].length);
      }
      setResult({ matches, highlighted });
    } catch (e: unknown) { setError((e as Error).message); setResult({ matches: [], highlighted: text }); }
  }, [pattern, flags, text]);
  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div style={{flex:3}}><label className={s.label}>{tc('pattern','正则表达式')}</label><input className={s.input} value={pattern} onChange={e=>setPattern(e.target.value)} placeholder="Regex..." /></div>
        <div style={{flex:1}}><label className={s.label}>{tc('flags','标志')}</label><input className={s.input} value={flags} onChange={e=>setFlags(e.target.value)} placeholder="gim" /></div>
      </div>
      <div className={s.col}>
        <label className={s.label}>{tc('testText','测试文本')}</label>
        <textarea className={s.textarea} value={text} onChange={e=>setText(e.target.value)} placeholder="..." />
      </div>
      {error && <div className={s.errorMsg}>{error}</div>}
      <div className={s.col}>
        <label className={s.label}>{tc('matchResult','匹配结果')}（{result.matches.length} {tc('matches','个匹配')}）</label>
        <div className={s.output} style={{whiteSpace:'pre-wrap'}}>{result.highlighted}</div>
      </div>
      {result.matches.length > 0 && (
        <div className={s.col}>
          <label className={s.label}>{tc('matchDetail','匹配详情')}</label>
          <div className={s.output}>
            {result.matches.map((m,i) => <div key={i}>{tc('match','匹配')} {i+1}: &quot;{m[0]}&quot; ({tc('position','位置')} {m.index})</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
