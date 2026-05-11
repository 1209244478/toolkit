'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

const LOREM_CN = '在当今快速发展的数字时代，技术创新正在以前所未有的速度改变着我们的生活方式。从人工智能到区块链，从物联网到量子计算，每一项突破性技术都在重新定义可能性的边界。作为这个时代的参与者，我们需要不断学习和适应，才能在变革中把握机遇。';
const LOREM_EN = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

export default function LoremIpsum() {
  const { tc } = useToolI18n('lorem-ipsum');
  const [count, setCount] = useState(3);
  const [lang, setLang] = useState<'cn'|'en'>('cn');
  const [output, setOutput] = useState('');
  const generate = () => {
    const src = lang === 'cn' ? LOREM_CN : LOREM_EN;
    setOutput(Array.from({length: count}, () => src).join('\n\n'));
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>段落数量</label><input type="number" className={s.input} min={1} max={50} value={count} onChange={e=>setCount(Number(e.target.value))} /></div>
        <div className={s.col}><label className={s.label}>语言</label><select className={s.select} value={lang} onChange={e=>setLang(e.target.value as 'cn'|'en')}><option value="cn">中文</option><option value="en">English</option></select></div>
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={generate}>生成</button>
      <div className={s.col}>
        <label className={s.label}>结果</label>
        <div className={s.outputWrap}><div className={s.output} style={{whiteSpace:'pre-wrap'}}>{output}</div>
        {output && <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(output)}>复制</button>}</div>
      </div>
    </div>
  );
}
