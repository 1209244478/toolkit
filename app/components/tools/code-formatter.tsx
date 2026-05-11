'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function CodeFormatter() {
  const { tc } = useToolI18n('code-formatter');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [lang, setLang] = useState<'json'|'js'|'css'|'html'>('json');
  const format = () => {
    try {
      if (lang === 'json') { setOutput(JSON.stringify(JSON.parse(input), null, 2)); }
      else if (lang === 'js') {
        let code = input
          .replace(/([{[])/g, '$1\n')
          .replace(/([}\]])(\s*[;,]?\s*)/g, '\n$1$2\n')
          .replace(/;\s*/g, ';\n')
          .split('\n').map(l => l.trim()).filter(l => l)
          .join('\n');
        let indent = 0, formatted = '';
        for (const line of code.split('\n')) {
          const trimmed = line.trim();
          if (trimmed.startsWith('}') || trimmed.startsWith(']')) indent = Math.max(0, indent - 2);
          formatted += ' '.repeat(indent) + trimmed + '\n';
          if (trimmed.endsWith('{') || trimmed.endsWith('[')) indent += 2;
        }
        setOutput(formatted.trim());
      } else if (lang === 'css') {
        setOutput(input
          .replace(/\s*{\s*/g, ' {\n  ').replace(/\s*}\s*/g, '\n}\n\n')
          .replace(/;\s*/g, ';\n  ').replace(/\n\s*\n/g, '\n').trim());
      } else {
        setOutput(input
          .replace(/>\s*</g, '>\n<')
          .replace(/\s+/g, ' ').trim());
      }
    } catch (e: unknown) { setOutput('格式化失败: ' + (e as Error).message); }
  };
  const minify = () => {
    try {
      if (lang === 'json') { setOutput(JSON.stringify(JSON.parse(input))); }
      else if (lang === 'html') {
        setOutput(input.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim());
      } else {
        setOutput(input.replace(/\s+/g, ' ').trim());
      }
    } catch (e: unknown) { setOutput('压缩失败: ' + (e as Error).message); }
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${lang==='json'?s.btnPrimary:s.btnOutline}`} onClick={()=>setLang('json')}>JSON</button>
        <button className={`${s.btn} ${lang==='js'?s.btnPrimary:s.btnOutline}`} onClick={()=>setLang('js')}>JS</button>
        <button className={`${s.btn} ${lang==='css'?s.btnPrimary:s.btnOutline}`} onClick={()=>setLang('css')}>CSS</button>
        <button className={`${s.btn} ${lang==='html'?s.btnPrimary:s.btnOutline}`} onClick={()=>setLang('html')}>HTML</button>
      </div>
      <div className={s.col}><label className={s.label}>输入代码</label><textarea className={s.textarea} style={{minHeight:200}} value={input} onChange={e=>setInput(e.target.value)} placeholder="粘贴代码..." /></div>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={format}>格式化</button>
        <button className={`${s.btn} ${s.btnSecondary}`} onClick={minify}>压缩</button>
      </div>
      <div className={s.col}><label className={s.label}>输出</label><div className={s.outputWrap}><div className={s.output}>{output}</div>{output && <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(output)}>复制</button>}</div></div>
    </div>
  );
}
