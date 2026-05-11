'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

function md5Hash(input: string): string {
  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    const cmn = (q: number, a: number, b: number, x: number, s: number, t: number) => {
      const n = a + q + x + t;
      return ((n << s) | (n >>> (32 - s))) + b;
    };
    const ff = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => cmn((b & c) | (~b & d), a, b, x, s, t);
    const gg = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => cmn((b & d) | (c & ~d), a, b, x, s, t);
    const hh = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => cmn(b ^ c ^ d, a, b, x, s, t);
    const ii = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => cmn(c ^ (b | ~d), a, b, x, s, t);
    a = ff(a,b,c,d,k[0],7,-680876936);d=ff(d,a,b,c,k[1],12,-389564586);c=ff(c,d,a,b,k[2],17,606105819);b=ff(b,c,d,a,k[3],22,-1044525330);
    a=ff(a,b,c,d,k[4],7,-176418897);d=ff(d,a,b,c,k[5],12,1200080426);c=ff(c,d,a,b,k[6],17,-1473231341);b=ff(b,c,d,a,k[7],22,-45705983);
    a=ff(a,b,c,d,k[8],7,1770035416);d=ff(d,a,b,c,k[9],12,-1958414417);c=ff(c,d,a,b,k[10],17,-42063);b=ff(b,c,d,a,k[11],22,-1990404162);
    a=ff(a,b,c,d,k[12],7,1804603682);d=ff(d,a,b,c,k[13],12,-40341101);c=ff(c,d,a,b,k[14],17,-1502002290);b=ff(b,c,d,a,k[15],22,1236535329);
    a=gg(a,b,c,d,k[1],5,-165796510);d=gg(d,a,b,c,k[6],9,-1069501632);c=gg(c,d,a,b,k[11],14,643717713);b=gg(b,c,d,a,k[0],20,-373897302);
    a=gg(a,b,c,d,k[5],5,-701558691);d=gg(d,a,b,c,k[10],9,38016083);c=gg(c,d,a,b,k[15],14,-660478335);b=gg(b,c,d,a,k[4],20,-405537848);
    a=gg(a,b,c,d,k[9],5,568446438);d=gg(d,a,b,c,k[14],9,-1019803690);c=gg(c,d,a,b,k[3],14,-187363961);b=gg(b,c,d,a,k[8],20,1163531501);
    a=gg(a,b,c,d,k[13],5,-1444681467);d=gg(d,a,b,c,k[2],9,-51403784);c=gg(c,d,a,b,k[7],14,1735328473);b=gg(b,c,d,a,k[12],20,-1926607734);
    a=hh(a,b,c,d,k[5],4,-378558);d=hh(d,a,b,c,k[8],11,-2022574463);c=hh(c,d,a,b,k[11],16,1839030562);b=hh(b,c,d,a,k[14],23,-35309556);
    a=hh(a,b,c,d,k[1],4,-1530992060);d=hh(d,a,b,c,k[4],11,1272893353);c=hh(c,d,a,b,k[7],16,-155497632);b=hh(b,c,d,a,k[10],23,-1094730640);
    a=hh(a,b,c,d,k[13],4,681279174);d=hh(d,a,b,c,k[0],11,-358537222);c=hh(c,d,a,b,k[3],16,-722521979);b=hh(b,c,d,a,k[6],23,76029189);
    a=hh(a,b,c,d,k[9],4,-640364487);d=hh(d,a,b,c,k[12],11,-421815835);c=hh(c,d,a,b,k[15],16,530742520);b=hh(b,c,d,a,k[2],23,-995338651);
    a=ii(a,b,c,d,k[0],6,-198630844);d=ii(d,a,b,c,k[7],10,1126891415);c=ii(c,d,a,b,k[14],15,-1416354905);b=ii(b,c,d,a,k[5],21,-57434055);
    a=ii(a,b,c,d,k[12],6,1700485571);d=ii(d,a,b,c,k[3],10,-1894986606);c=ii(c,d,a,b,k[10],15,-1051523);b=ii(b,c,d,a,k[1],21,-2054922799);
    a=ii(a,b,c,d,k[8],6,1873313359);d=ii(d,a,b,c,k[15],10,-30611744);c=ii(c,d,a,b,k[6],15,-1560198380);b=ii(b,c,d,a,k[13],21,1309151649);
    a=ii(a,b,c,d,k[4],6,-145523070);d=ii(d,a,b,c,k[11],10,-1120210379);c=ii(c,d,a,b,k[2],15,718787259);b=ii(b,c,d,a,k[9],21,-343485551);
    x[0]=a+x[0];x[1]=b+x[1];x[2]=c+x[2];x[3]=d+x[3];
    return x;
  }
  const bytes: number[] = [];
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code < 0x80) bytes.push(code);
    else if (code < 0x800) { bytes.push(0xc0|(code>>6),0x80|(code&0x3f)); }
    else { bytes.push(0xe0|(code>>12),0x80|((code>>6)&0x3f),0x80|(code&0x3f)); }
  }
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 0; i < 8; i++) bytes.push((bitLen >>> (i * 8)) & 0xff);
  const x = [1732584193, -271733879, -1732584194, 271733878];
  for (let i = 0; i < bytes.length; i += 64) {
    const k: number[] = [];
    for (let j = 0; j < 16; j++) {
      k[j] = bytes[i+j*4]|(bytes[i+j*4+1]<<8)|(bytes[i+j*4+2]<<16)|(bytes[i+j*4+3]<<24);
    }
    md5cycle(x, k);
  }
  const hex = (n: number) => { const s = (n>>>0).toString(16); return '00000000'.slice(s.length)+s; };
  return hex(x[0]) + hex(x[1]) + hex(x[2]) + hex(x[3]);
}

async function computeHash(algo: string, text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function computeFileHash(algo: string, file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(algo, buffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashCalculator() {
  const { tc } = useToolI18n('hash-calculator');
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File|null>(null);
  const [mode, setMode] = useState<'text'|'file'>('text');
  const [results, setResults] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(false);
  const calculate = async () => {
    setLoading(true);
    try {
      const algos = ['SHA-1','SHA-256','SHA-384','SHA-512'] as const;
      if (mode === 'file' && file) {
        const r: Record<string,string> = {};
        for (const algo of algos) {
          r[algo] = await computeFileHash(algo, file);
        }
        r['MD5'] = md5Hash(await file.text());
        setResults(r);
      } else {
        const r: Record<string,string> = {};
        for (const algo of algos) {
          r[algo] = await computeHash(algo, input);
        }
        r['MD5'] = md5Hash(input);
        setResults(r);
      }
    } catch { setResults({}); }
    setLoading(false);
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${mode==='text'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMode('text')}>文本输入</button>
        <button className={`${s.btn} ${mode==='file'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMode('file')}>文件输入</button>
      </div>
      {mode === 'text' ? (
        <div className={s.col}>
          <label className={s.label}>输入文本</label>
          <textarea className={s.textarea} value={input} onChange={e=>setInput(e.target.value)} placeholder="输入文本..." />
        </div>
      ) : (
        <div className={s.col}>
          <label className={s.label}>选择文件</label>
          <input type="file" onChange={e=>setFile(e.target.files?.[0]??null)} />
          {file && <p style={{fontSize:'.8125rem',color:'var(--text-sec)',marginTop:4}}>{file.name} ({(file.size/1024).toFixed(1)} KB)</p>}
        </div>
      )}
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={calculate} disabled={(mode==='text'&&!input)||(mode==='file'&&!file)||loading}>{loading?'计算中...':'计算哈希'}</button>
      {Object.keys(results).length > 0 && (
        <div className={s.col}>
          {Object.entries(results).map(([algo, hash]) => (
            <div key={algo} style={{marginBottom:12}}>
              <label className={s.label}>{algo}</label>
              <div className={s.outputWrap}><div className={s.output} style={{fontSize:'.75rem',wordBreak:'break-all'}}>{hash}</div>
              <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(hash)}>复制</button></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
