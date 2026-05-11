'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

interface TreeNode { key: string; value: unknown; type: string; children?: TreeNode[]; expanded?: boolean; }

function buildTree(obj: unknown, key = 'root'): TreeNode {
  if (obj === null) return { key, value: null, type: 'null' };
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) return { key, value: obj, type: 'array', children: obj.map((v, i) => buildTree(v, String(i))) };
    return { key, value: obj, type: 'object', children: Object.entries(obj as Record<string,unknown>).map(([k, v]) => buildTree(v, k)) };
  }
  return { key, value: obj, type: typeof obj };
}

function TreeNodeView({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isObj = node.type === 'object' || node.type === 'array';
  const bracket = node.type === 'array' ? ['[', ']'] : ['{', '}'];
  const count = isObj ? (node.children?.length ?? 0) : 0;
  return (
    <div style={{marginLeft: depth > 0 ? 20 : 0}}>
      <div style={{display:'flex',alignItems:'center',gap:4,cursor:isObj?'pointer':'default',padding:'2px 0'}} onClick={()=>isObj&&setExpanded(!expanded)}>
        {isObj && <span style={{fontSize:10,color:'var(--text-sec)',transition:'transform .2s',transform:expanded?'rotate(90deg)':'rotate(0)'}}>▶</span>}
        <span style={{color:'#0066cc',fontWeight:500}}>{node.key}</span>
        <span style={{color:'var(--text-sec)'}}>: </span>
        {isObj ? (
          <span style={{color:'var(--text-sec)'}}>{bracket[0]}{!expanded && `...${count} items...${bracket[1]}`}</span>
        ) : (
          <span style={{color:node.type==='string'?'#1a7f37':node.type==='number'?'#8a6d00':node.type==='boolean'?'#c41e3a':'#999'}}>
            {node.type==='string'?`"${node.value}"`:String(node.value)}
          </span>
        )}
      </div>
      {isObj && expanded && (
        <>
          {node.children?.map((c, i) => <TreeNodeView key={i} node={c} depth={depth+1} />)}
          <div style={{marginLeft:20,color:'var(--text-sec)'}}>{bracket[1]}</div>
        </>
      )}
    </div>
  );
}

export default function JsonViewer() {
  const { tc } = useToolI18n('json-viewer');
  const [input, setInput] = useState('');
  const [tree, setTree] = useState<TreeNode|null>(null);
  const [error, setError] = useState('');
  const parse = () => {
    try { setTree(buildTree(JSON.parse(input))); setError(''); }
    catch (e: unknown) { setError((e as Error).message); setTree(null); }
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.col}><label className={s.label}>输入 JSON</label><textarea className={s.textarea} value={input} onChange={e=>setInput(e.target.value)} placeholder="粘贴 JSON 数据..." /></div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={parse}>解析</button>
      {error && <div className={s.errorMsg}>{error}</div>}
      {tree && <div className={s.card} style={{fontFamily:'"Courier New",monospace',fontSize:'.8125rem',maxHeight:500,overflow:'auto'}}><TreeNodeView node={tree} /></div>}
    </div>
  );
}
