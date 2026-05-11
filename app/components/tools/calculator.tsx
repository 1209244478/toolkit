'use client';
import { useState } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function Calculator() {
  const { tc } = useToolI18n('calculator');
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<string|null>(null);
  const [op, setOp] = useState<string|null>(null);
  const [newNum, setNewNum] = useState(true);
  const inputDigit = (d: string) => {
    if (newNum) { setDisplay(d); setNewNum(false); }
    else setDisplay(display === '0' ? d : display + d);
  };
  const inputDot = () => {
    if (newNum) { setDisplay('0.'); setNewNum(false); return; }
    if (!display.includes('.')) setDisplay(display + '.');
  };
  const calculate = (a: number, b: number, op: string): number | string => {
    switch(op) { case '+': return a+b; case '-': return a-b; case '×': return a*b; case '÷': return b!==0?a/b:'Error'; default: return b; }
  };
  const handleOp = (nextOp: string) => {
    const current = parseFloat(display);
    if (prev !== null && op && !newNum) {
      const result = calculate(parseFloat(prev), current, op);
      if (result === 'Error') { setDisplay('Error'); setPrev(null); setOp(null); setNewNum(true); return; }
      setDisplay(String(result));
      setPrev(String(result));
    } else { setPrev(String(current)); }
    setOp(nextOp); setNewNum(true);
  };
  const handleEquals = () => {
    if (prev === null || op === null) return;
    const result = calculate(parseFloat(prev), parseFloat(display), op);
    setDisplay(String(result)); setPrev(null); setOp(null); setNewNum(true);
  };
  const clear = () => { setDisplay('0'); setPrev(null); setOp(null); setNewNum(true); };
  const sciOp = (fn: string) => {
    const n = parseFloat(display);
    let result = 0;
    switch(fn) {
      case 'sin': result = Math.sin(n * Math.PI / 180); break;
      case 'cos': result = Math.cos(n * Math.PI / 180); break;
      case 'tan': result = Math.tan(n * Math.PI / 180); break;
      case 'log': result = Math.log10(n); break;
      case 'ln': result = Math.log(n); break;
      case '√': result = Math.sqrt(n); break;
      case 'x²': result = n * n; break;
      case '1/x': result = 1 / n; break;
      case 'π': result = Math.PI; break;
      case 'e': result = Math.E; break;
    }
    setDisplay(String(result)); setNewNum(true);
  };
  const btnStyle = (type: 'num'|'op'|'fn') => ({
    padding: '18px 12px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
    fontSize: '1.125rem', fontWeight: type === 'op' ? 600 : 500,
    background: type === 'num' ? 'var(--white)' : type === 'op' ? 'var(--accent)' : 'var(--pale-gray)',
    color: type === 'op' ? 'var(--white)' : 'var(--ink)',
    transition: 'all .15s',
  });
  return (
    <div className={s.toolContainer}>
      <div className={s.card} style={{maxWidth:520,margin:'0 auto'}}>
        <div style={{background:'var(--pale-gray)',padding:'24px 28px',borderRadius:'var(--radius-md)',marginBottom:20,textAlign:'right'}}>
          {prev !== null && <div style={{fontSize:'.875rem',color:'var(--text-sec)'}}>{prev} {op}</div>}
          <div style={{fontSize:'2.25rem',fontWeight:600,letterSpacing:'-0.02em',overflow:'hidden',textOverflow:'ellipsis'}}>{display}</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8}}>
          {['sin','cos','tan','log','ln'].map(f=><button key={f} style={btnStyle('fn')} onClick={()=>sciOp(f)}>{f}</button>)}
          {['√','x²','1/x','π','e'].map(f=><button key={f} style={btnStyle('fn')} onClick={()=>sciOp(f)}>{f}</button>)}
          {['7','8','9','÷','C'].map((b,i)=><button key={b} style={btnStyle(i===3?'op':i===4?'fn':'num')} onClick={()=>i===3?handleOp('÷'):i===4?clear():inputDigit(b)}>{b}</button>)}
          {['4','5','6','×','⌫'].map((b,i)=><button key={b} style={btnStyle(i===3?'op':'num')} onClick={()=>i===3?handleOp('×'):i===4?setDisplay(display.length>1?display.slice(0,-1):'0'):inputDigit(b)}>{b}</button>)}
          {['1','2','3','-','('].map((b,i)=><button key={b} style={btnStyle(i===3?'op':'num')} onClick={()=>i===3?handleOp('-'):inputDigit(b)}>{b}</button>)}
          {['0','.','+','=',')'].map((b,i)=><button key={b} style={btnStyle(i===2?'op':i===3?'op':'num')} onClick={()=>{if(b==='.')inputDot();else if(b==='+')handleOp('+');else if(b==='=')handleEquals();else inputDigit(b);}}>{b}</button>)}
        </div>
      </div>
    </div>
  );
}
