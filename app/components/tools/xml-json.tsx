'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

function xmlToJson(xml: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) throw new Error('XML 解析失败');
  const nodeToObj = (node: Element): unknown => {
    if (!node.children.length) return node.textContent;
    const obj: Record<string, unknown> = {};
    for (const child of Array.from(node.children)) {
      const existing = obj[child.tagName];
      if (existing) {
        if (Array.isArray(existing)) existing.push(nodeToObj(child));
        else obj[child.tagName] = [existing, nodeToObj(child)];
      } else {
        obj[child.tagName] = nodeToObj(child);
      }
    }
    return obj;
  };
  return JSON.stringify({ [doc.documentElement.tagName]: nodeToObj(doc.documentElement) }, null, 2);
}

function jsonToXml(json: string) {
  const data = JSON.parse(json);
  const toXml = (obj: unknown, indent: number): string => {
    const pad = '  '.repeat(indent);
    if (typeof obj !== 'object' || obj === null) return String(obj);
    return Object.entries(obj as Record<string, unknown>).map(([key, val]) => {
      if (Array.isArray(val)) return val.map(v => `${pad}<${key}>\n${toXml(v, indent+1)}\n${pad}</${key}>`).join('\n');
      if (typeof val === 'object' && val !== null) return `${pad}<${key}>\n${toXml(val, indent+1)}\n${pad}</${key}>`;
      return `${pad}<${key}>${val}</${key}>`;
    }).join('\n');
  };
  return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(data, 0)}`;
}

export default function XmlJson() {
  const { tc } = useToolI18n('xml-json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'xml2json'|'json2xml'>('xml2json');
  const convert = () => {
    try { setOutput(mode === 'xml2json' ? xmlToJson(input) : jsonToXml(input)); }
    catch (e: unknown) { setOutput('转换失败: ' + (e as Error).message); }
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${mode==='xml2json'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMode('xml2json')}>XML → JSON</button>
        <button className={`${s.btn} ${mode==='json2xml'?s.btnPrimary:s.btnOutline}`} onClick={()=>setMode('json2xml')}>JSON → XML</button>
      </div>
      <div className={s.col}><label className={s.label}>{mode==='xml2json'?'XML 输入':'JSON 输入'}</label><textarea className={s.textarea} value={input} onChange={e=>setInput(e.target.value)} /></div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={convert}>转换</button>
      <div className={s.col}><label className={s.label}>结果</label><div className={s.outputWrap}><div className={s.output}>{output}</div>{output && <button className={s.copyBtn} onClick={()=>navigator.clipboard.writeText(output)}>复制</button>}</div></div>
    </div>
  );
}
