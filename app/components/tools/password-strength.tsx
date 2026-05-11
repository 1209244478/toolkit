'use client';
import { useState, useMemo } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function PasswordStrength() {
  const { tc } = useToolI18n('password-strength');
  const [password, setPassword] = useState('');
  const analysis = useMemo(() => {
    const p = password;
    if (!p) return { score: 0, label: '', color: '', feedback: [] as string[] };
    let score = 0;
    const feedback: string[] = [];
    if (p.length >= 8) score += 1; else feedback.push('建议至少 8 个字符');
    if (p.length >= 12) score += 1;
    if (p.length >= 16) score += 1;
    if (/[a-z]/.test(p)) score += 1; else feedback.push('添加小写字母');
    if (/[A-Z]/.test(p)) score += 1; else feedback.push('添加大写字母');
    if (/[0-9]/.test(p)) score += 1; else feedback.push('添加数字');
    if (/[^a-zA-Z0-9]/.test(p)) score += 1; else feedback.push('添加特殊字符');
    if (/(.)\1{2,}/.test(p)) { score -= 1; feedback.push('避免连续重复字符'); }
    const labels = ['','非常弱','弱','一般','强','非常强','极强'];
    const colors = ['','#c41e3a','#e05030','#8a6d00','#1a7f37','#006644','#004d33'];
    return { score: Math.min(score, 6), label: labels[Math.min(score,6)], color: colors[Math.min(score,6)], feedback };
  }, [password]);
  return (
    <div className={s.toolContainer}>
      <div className={s.col}><label className={s.label}>输入密码</label><input type="text" className={s.input} value={password} onChange={e=>setPassword(e.target.value)} placeholder="输入密码..." style={{fontFamily:'monospace'}} /></div>
      {password && (
        <>
          <div style={{height:8,borderRadius:4,background:'var(--pale-gray)',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${(analysis.score/6)*100}%`,background:analysis.color,borderRadius:4,transition:'all .3s'}} />
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontWeight:600,color:analysis.color}}>{analysis.label}</span>
            <span style={{fontSize:'.75rem',color:'var(--text-sec)'}}>{analysis.score}/6</span>
          </div>
          {analysis.feedback.length > 0 && (
            <div className={s.col}>
              <label className={s.label}>改善建议</label>
              {analysis.feedback.map((f,i) => <div key={i} style={{fontSize:'.8125rem',color:'var(--text-sec)',paddingLeft:12}}>• {f}</div>)}
            </div>
          )}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:8}}>
            {[
              {label:'长度',value:password.length,ok:password.length>=8},
              {label:'小写',value:/[a-z]/.test(password)?'✓':'✗',ok:/[a-z]/.test(password)},
              {label:'大写',value:/[A-Z]/.test(password)?'✓':'✗',ok:/[A-Z]/.test(password)},
              {label:'数字',value:/[0-9]/.test(password)?'✓':'✗',ok:/[0-9]/.test(password)},
              {label:'特殊字符',value:/[^a-zA-Z0-9]/.test(password)?'✓':'✗',ok:/[^a-zA-Z0-9]/.test(password)},
            ].map(item=>(
              <div key={item.label} className={s.card} style={{textAlign:'center',padding:8}}>
                <div style={{fontWeight:600,color:item.ok?'#1a7f37':'#c41e3a'}}>{item.value}</div>
                <div style={{fontSize:'.6875rem',color:'var(--text-sec)'}}>{item.label}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
