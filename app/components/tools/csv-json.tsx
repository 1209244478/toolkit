'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else current += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { result.push(current); current = ''; }
      else current += ch;
    }
  }
  result.push(current);
  return result.map(v => v.trim());
}

function csvToJson(csv: string) {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return '[]';
  const headers = parseCsvLine(lines[0]);
  const data = lines.slice(1).map(line => {
    const vals = parseCsvLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
    return obj;
  });
  return JSON.stringify(data, null, 2);
}

function jsonToCsv(json: string) {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data) || data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const lines = [headers.join(',')];
    data.forEach(row => { lines.push(headers.map(h => `"${(row[h] ?? '').toString().replace(/"/g, '""')}"`).join(',')); });
    return lines.join('\n');
  } catch { return ''; }
}

export default function CsvJson() {
  const { tc } = useToolI18n('csv-json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'csv2json'|'json2csv'>('csv2json');
  const convert = () => {
    setOutput(mode === 'csv2json' ? csvToJson(input) : jsonToCsv(input));
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${mode==='csv2json'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMode('csv2json')}>CSV → JSON</button>
        <button className={`${s.btn} ${mode==='json2csv'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMode('json2csv')}>JSON → CSV</button>
      </div>
      <div className={s.col}><label className={s.label}>{mode==='csv2json'?'CSV 输入':'JSON 输入'}</label><textarea className={s.textarea} value={input} onChange={e=>setInput(e.target.value)} placeholder={mode==='csv2json'?'name,age\nAlice,30\nBob,25':'[{"name":"Alice","age":"30"}]'} /></div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={convert}>转换</button>
      <div className={s.col}><label className={s.label}>结果</label><div className={s.outputWrap}><div className={s.output}>{output}</div>{output && <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(output)}>复制</button>}</div></div>
    </div>
  );
}
