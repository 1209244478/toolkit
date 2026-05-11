'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

const converters: Record<string,(t:string)=>string> = {
  '大写': (t) => t.toUpperCase(),
  '小写': (t) => t.toLowerCase(),
  '首字母大写': (t) => t.replace(/\b\w/g, c => c.toUpperCase()),
  '驼峰命名': (t) => t.replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase()),
  '蛇形命名': (t) => t.replace(/[-\s]+/g, '_').replace(/[A-Z]/g, c => '_' + c.toLowerCase()).replace(/^_/, '').replace(/__+/g, '_').toLowerCase(),
  '中划线命名': (t) => t.replace(/[_\s]+/g, '-').replace(/[A-Z]/g, c => '-' + c.toLowerCase()).replace(/^-/, '').replace(/--+/g, '-').toLowerCase(),
  '全角转半角': (t) => t.replace(/[\uff01-\uff5e]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/\u3000/g, ' '),
  '半角转全角': (t) => t.replace(/[\x21-\x7e]/g, c => String.fromCharCode(c.charCodeAt(0) + 0xfee0)).replace(/ /g, '\u3000'),
};

export default function CaseConverter() {
  const { tc } = useToolI18n('case-converter');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  return (
    <div className={s.toolContainer}>
      <div className={s.col}>
        <label className={s.label}>输入文本</label>
        <textarea className={s.textarea} value={input} onChange={e=>setInput(e.target.value)} placeholder="输入文本..." />
      </div>
      <div className={s.btnGroup}>
        {Object.keys(converters).map(k => (
          <button key={k} className={`${s.btn} ${s.btnOutline}`} onClick={() => setOutput(converters[k](input))}>{k}</button>
        ))}
      </div>
      <div className={s.col}>
        <label className={s.label}>结果</label>
        <div className={s.outputWrap}><div className={s.output}>{output}</div>
        {output && <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(output)}>复制</button>}</div>
      </div>
    </div>
  );
}
