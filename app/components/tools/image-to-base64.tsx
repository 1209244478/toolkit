'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function ImageToBase64() {
  const { tc } = useToolI18n('image-to-base64');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => setOutput(reader.result as string);
    reader.readAsDataURL(f);
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.col}><label className={s.label}>选择图片</label><input type="file" accept="image/*" onChange={handleFile} /></div>
      {output && (
        <div className={s.col}>
          <label className={s.label}>Base64 结果（{fileName}，{(output.length/1024).toFixed(1)} KB）</label>
          <div className={s.outputWrap}><div className={s.output} style={{maxHeight:200,overflow:'auto',fontSize:'.75rem',wordBreak:'break-all'}}>{output}</div>
          <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(output)}>复制</button></div>
          <div style={{marginTop:12}}><img src={output} alt="preview" style={{maxWidth:200,borderRadius:'var(--radius-sm)',border:'1px solid var(--border-soft)'}} /></div>
        </div>
      )}
    </div>
  );
}
