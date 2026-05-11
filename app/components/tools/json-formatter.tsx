'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function JsonFormatter() {
  const { tc } = useToolI18n('json-formatter');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const format = (indent: number) => {
    try { setOutput(JSON.stringify(JSON.parse(input), null, indent)); setError(''); }
    catch (e: unknown) { setError((e as Error).message); setOutput(''); }
  };
  const compress = () => {
    try { setOutput(JSON.stringify(JSON.parse(input))); setError(''); }
    catch (e: unknown) { setError((e as Error).message); setOutput(''); }
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.col}>
        <label className={s.label}>{tc('inputJson','输入 JSON')}</label>
        <textarea className={s.textarea} value={input} onChange={e => setInput(e.target.value)} placeholder='JSON...' />
      </div>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => format(2)}>{tc('format2','格式化（2空格）')}</button>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => format(4)}>{tc('format4','格式化（4空格）')}</button>
        <button className={`${s.btn} ${s.btnSecondary}`} onClick={compress}>{tc('compress','压缩')}</button>
      </div>
      {error && <div className={s.errorMsg}>{error}</div>}
      <div className={s.col}>
        <label className={s.label}>{tc('output','输出')}</label>
        <div className={s.outputWrap}>
          <div className={s.output}>{output}</div>
          {output && <button className={s.copyBtn} onClick={() => navigator.clipboard.writeText(output)}>{tc('copy','复制')}</button>}
        </div>
      </div>
    </div>
  );
}
