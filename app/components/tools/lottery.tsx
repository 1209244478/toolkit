'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function Lottery() {
  const { tc } = useToolI18n('lottery');
  const [names, setNames] = useState('');
  const [count, setCount] = useState(1);
  const [winners, setWinners] = useState<string[]>([]);
  const [rolling, setRolling] = useState(false);
  const draw = () => {
    const list = names.split('\n').map(n => n.trim()).filter(Boolean);
    if (list.length === 0) return;
    setRolling(true);
    const c = Math.min(count, list.length);
    const shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setWinners(shuffled.slice(0, c));
    setTimeout(() => setRolling(false), 500);
  };
  return (
    <div className={s.toolContainer}>
      <div className={s.col}>
        <label className={s.label}>名单（每行一个）</label>
        <textarea className={s.textarea} value={names} onChange={e=>setNames(e.target.value)} placeholder="张三&#10;李四&#10;王五&#10;赵六" />
      </div>
      <div className={s.col}>
        <label className={s.label}>中奖人数</label>
        <input type="number" className={s.input} min={1} max={100} value={count} onChange={e=>setCount(Number(e.target.value))} />
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} onClick={draw} disabled={!names.trim()||rolling} style={{fontSize:'1rem',padding:'14px 32px'}}>
        {rolling ? '🎲 抽奖中...' : '🎲 开始抽奖'}
      </button>
      {winners.length > 0 && !rolling && (
        <div className={s.card} style={{textAlign:'center'}}>
          <div style={{fontSize:'.8125rem',color:'var(--text-sec)',marginBottom:8}}>🎉 恭喜以下人员中奖！</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>
            {winners.map((w,i) => (
              <span key={i} style={{padding:'8px 16px',background:'var(--accent)',color:'var(--white)',borderRadius:'var(--radius-pill)',fontWeight:600,fontSize:'.875rem'}}>{w}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
