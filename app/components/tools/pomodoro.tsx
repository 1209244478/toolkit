'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

type TimerState = 'idle' | 'work' | 'break' | 'paused';

const beepFreq = [800, 600, 400];

function playBeep(audioCtx: AudioContext) {
  beepFreq.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.15 + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + i * 0.15);
    osc.stop(audioCtx.currentTime + i * 0.15 + 0.15);
  });
}

function notify(title: string, body: string) {
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '🍅' });
  }
}

export default function Pomodoro() {
  const { tc } = useToolI18n('pomodoro');
  const [state, setState] = useState<TimerState>('idle');
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const tick = useCallback(() => {
    setSecondsLeft(prev => {
      if (prev <= 1) {
        const ctx = audioCtxRef.current || new AudioContext();
        audioCtxRef.current = ctx;
        playBeep(ctx);
        if (state === 'work') {
          setState('break'); setSessions(s => s + 1);
          notify('番茄钟', '工作完成！休息一下吧 ☕');
          return breakMin * 60;
        } else {
          setState('work');
          notify('番茄钟', '休息结束！开始新的工作周期 🔥');
          return workMin * 60;
        }
      }
      return prev - 1;
    });
  }, [state, workMin, breakMin]);

  useEffect(() => {
    if (state === 'idle' || state === 'paused') { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(tick, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state, tick]);

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const start = () => { setState('work'); setSecondsLeft(workMin * 60); };
  const pause = () => { if (intervalRef.current) clearInterval(intervalRef.current); setState('paused'); };
  const resume = () => { setState(prevSessions => { if (secondsLeft === workMin * 60) return 'work'; return 'work'; }); };
  const reset = () => { if (intervalRef.current) clearInterval(intervalRef.current); setState('idle'); setSecondsLeft(workMin * 60); setSessions(0); };

  const min = Math.floor(secondsLeft / 60);
  const sec = secondsLeft % 60;
  const progress = state === 'paused' ? 0 : state === 'work' ? 1 - secondsLeft / (workMin * 60) : state === 'break' ? 1 - secondsLeft / (breakMin * 60) : 0;
  const color = state === 'work' ? '#c41e3a' : state === 'break' ? '#1a7f37' : state === 'paused' ? '#f59e0b' : 'var(--accent)';

  return (
    <div className={s.toolContainer}>
      <div className={s.row}>
        <div className={s.col}><label className={s.label}>工作时长 ({workMin} 分钟)</label><input type="range" className={s.slider} min="1" max="60" value={workMin} onChange={e=>{setWorkMin(Number(e.target.value));if(state==='idle')setSecondsLeft(Number(e.target.value)*60);}} /></div>
        <div className={s.col}><label className={s.label}>休息时长 ({breakMin} 分钟)</label><input type="range" className={s.slider} min="1" max="30" value={breakMin} onChange={e=>setBreakMin(Number(e.target.value))} /></div>
      </div>
      <div className={s.card} style={{textAlign:'center',padding:32}}>
        <div style={{fontSize:'.8125rem',color,fontWeight:600,marginBottom:8}}>
          {state === 'idle' ? '准备开始' : state === 'paused' ? '⏸️ 已暂停' : state === 'work' ? '🔥 专注工作中' : '☕ 休息时间'}
        </div>
        <div style={{fontSize:'4rem',fontWeight:700,letterSpacing:'-0.03em',fontVariantNumeric:'tabular-nums',color}}>
          {String(min).padStart(2,'0')}:{String(sec).padStart(2,'0')}
        </div>
        <div style={{height:6,borderRadius:3,background:'var(--pale-gray)',marginTop:16,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${progress*100}%`,background:color,borderRadius:3,transition:'width 1s linear'}} />
        </div>
        <div style={{fontSize:'.75rem',color:'var(--text-sec)',marginTop:8}}>已完成 {sessions} 个番茄</div>
      </div>
      <div className={s.btnGroup} style={{justifyContent:'center'}}>
        {state === 'idle' && <button className={`${s.btn} ${s.btnPrimary}`} onClick={start}>开始</button>}
        {state === 'paused' && <button className={`${s.btn} ${s.btnPrimary}`} onClick={resume}>继续</button>}
        {(state === 'work' || state === 'break') && <button className={`${s.btn} ${s.btnOutline}`} onClick={pause}>暂停</button>}
        <button className={`${s.btn} ${s.btnOutline}`} onClick={reset}>重置</button>
      </div>
    </div>
  );
}
