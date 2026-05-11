'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

function yamlToJson(yaml: string) {
  const result: Record<string, unknown> = {};
  const lines = yaml.split('\n');
  const stack: { obj: Record<string, unknown>; indent: number }[] = [{ obj: result, indent: -1 }];
  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const indent = line.length - line.trimStart().length;
    const listMatch = trimmed.match(/^-\s+(.*)$/);
    if (listMatch) {
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
      const parent = stack[stack.length - 1].obj;
      const lastKey = Object.keys(parent).pop();
      if (lastKey) {
        const arr = Array.isArray(parent[lastKey]) ? parent[lastKey] as unknown[] : [];
        let val: unknown = listMatch[1];
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        else if (val === 'null') val = null;
        else if (!isNaN(Number(val))) val = Number(val);
        else if ((typeof val === 'string' && val.startsWith('"') && val.endsWith('"')) || (typeof val === 'string' && val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
        arr.push(val);
        parent[lastKey] = arr;
      }
      continue;
    }
    const match = trimmed.match(/^([\w-]+):\s*(.*)$/);
    if (match) {
      const [, key, val] = match;
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
      const currentObj = stack[stack.length - 1].obj;
      if (val) {
        let parsed: unknown = val;
        if (val === 'true') parsed = true;
        else if (val === 'false') parsed = false;
        else if (val === 'null') parsed = null;
        else if (!isNaN(Number(val))) parsed = Number(val);
        else if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) parsed = val.slice(1, -1);
        currentObj[key] = parsed;
      } else {
        currentObj[key] = {};
        stack.push({ obj: currentObj[key] as Record<string, unknown>, indent });
      }
    }
  }
  return JSON.stringify(result, null, 2);
}

function jsonToYaml(json: string, indent = 0) {
  const data = JSON.parse(json);
  const prefix = '  '.repeat(indent);
  let result = '';
  if (Array.isArray(data)) {
    for (const item of data) {
      if (typeof item === 'object' && item !== null) {
        result += `${prefix}-\n${jsonToYaml(JSON.stringify(item), indent + 1)}`;
      } else {
        result += `${prefix}- ${typeof item === 'string' ? item : JSON.stringify(item)}\n`;
      }
    }
  } else if (typeof data === 'object' && data !== null) {
    for (const [key, val] of Object.entries(data)) {
      if (typeof val === 'object' && val !== null) {
        result += `${prefix}${key}:\n${jsonToYaml(JSON.stringify(val), indent + 1)}`;
      } else {
        result += `${prefix}${key}: ${typeof val === 'string' ? val : JSON.stringify(val)}\n`;
      }
    }
  }
  return result;
}

export default function YamlJson() {
  const { tc } = useToolI18n('yaml-json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'yaml2json'|'json2yaml'>('yaml2json');
  const convert = () => {
    try { setOutput(mode === 'yaml2json' ? yamlToJson(input) : jsonToYaml(input)); }
    catch (e: unknown) { setOutput('转换失败: ' + (e as Error).message); }
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${mode==='yaml2json'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMode('yaml2json')}>YAML → JSON</button>
        <button className={`${s.btn} ${mode==='json2yaml'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMode('json2yaml')}>JSON → YAML</button>
      </div>
      <div className={s.col}><label className={s.label}>{mode==='yaml2json'?'YAML 输入':'JSON 输入'}</label><textarea className={s.textarea} value={input} onChange={e=>setInput(e.target.value)} /></div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={convert}>转换</button>
      <div className={s.col}><label className={s.label}>结果</label><div className={s.outputWrap}><div className={s.output}>{output}</div>{output && <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(output)}>复制</button>}</div></div>
    </div>
  );
}
