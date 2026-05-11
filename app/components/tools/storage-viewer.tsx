'use client';
import { useState, useEffect } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function StorageViewer() {
  const { tc } = useToolI18n('storage-viewer');
  const [tab, setTab] = useState<'local'|'session'>('local');
  const [items, setItems] = useState<{key:string;value:string}[]>([]);
  const [editKey, setEditKey] = useState('');
  const [editVal, setEditVal] = useState('');
  const refresh = () => {
    const storage = tab === 'local' ? localStorage : sessionStorage;
    const entries: {key:string;value:string}[] = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key) entries.push({ key, value: storage.getItem(key) || '' });
    }
    setItems(entries);
  };
  useEffect(() => { refresh(); }, [tab]);
  const save = () => {
    if (!editKey) return;
    const storage = tab === 'local' ? localStorage : sessionStorage;
    storage.setItem(editKey, editVal);
    setEditKey(''); setEditVal('');
    refresh();
  };
  const remove = (key: string) => {
    const storage = tab === 'local' ? localStorage : sessionStorage;
    storage.removeItem(key);
    refresh();
  };
  const clearAll = () => {
    const storage = tab === 'local' ? localStorage : sessionStorage;
    storage.clear();
    refresh();
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${tab==='local'?s.btnPrimary:s.btnOutline}`} onClick={()=>setTab('local')}>localStorage</button>
        <button className={`${s.btn} ${tab==='session'?s.btnPrimary:s.btnOutline}`} onClick={()=>setTab('session')}>sessionStorage</button>
      </div>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>键</label><input className={s.input} value={editKey} onChange={e=>setEditKey(e.target.value)} placeholder="key" /></div>
        <div className={s.col}><label className={s.label}>值</label><input className={s.input} value={editVal} onChange={e=>setEditVal(e.target.value)} placeholder="value" /></div>
      </div>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={save}>保存</button>
        <button className={`${s.btn} ${s.btnOutline}`} onClick={refresh}>刷新</button>
        <button className={`${s.btn} ${s.btnOutline}`} onClick={clearAll}>清空</button>
      </div>
      {items.length === 0 && <div style={{textAlign:'center',color:'var(--text-sec)',padding:20}}>暂无数据</div>}
      {items.map(item => (
        <div key={item.key} className={s.card} style={{padding:'10px 16px',display:'flex',alignItems:'center',gap:12}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:'.75rem',color:'var(--accent)',fontWeight:600}}>{item.key}</div>
            <div style={{fontSize:'.8125rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.value}</div>
          </div>
          <button className={`${s.btn} ${s.btnOutline}`} style={{padding:'4px 10px',fontSize:'.6875rem'}} onClick={()=>{setEditKey(item.key);setEditVal(item.value);}}>编辑</button>
          <button className={`${s.btn} ${s.btnOutline}`} style={{padding:'4px 10px',fontSize:'.6875rem',color:'#c41e3a'}} onClick={()=>remove(item.key)}>删除</button>
        </div>
      ))}
    </div>
  );
}
