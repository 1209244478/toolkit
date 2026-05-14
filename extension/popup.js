// ───── DOM ─────
const workSlider = document.getElementById('workSlider');
const breakSlider = document.getElementById('breakSlider');
const workMinVal = document.getElementById('workMinVal');
const breakMinVal = document.getElementById('breakMinVal');
const stateLabel = document.getElementById('stateLabel');
const timeDisplay = document.getElementById('timeDisplay');
const progressFill = document.getElementById('progressFill');
const sessionCount = document.getElementById('sessionCount');
const btnStart = document.getElementById('btnStart');
const btnPause = document.getElementById('btnPause');
const btnReset = document.getElementById('btnReset');

// ───── State ─────
const STATE_IDLE = 'idle';
const STATE_WORK = 'work';
const STATE_BREAK = 'break';
const STATE_PAUSED = 'paused';

let state = STATE_IDLE;
let workMin = 25;
let breakMin = 5;
let secondsLeft = 25 * 60;
let sessions = 0;
let intervalId = null;
let endTime = 0; // timestamp when timer will finish (for background sync)

// ───── Color mapping ─────
const COLOR_MAP = {
  [STATE_WORK]: '#c41e3a',
  [STATE_BREAK]: '#1a7f37',
  [STATE_PAUSED]: '#f59e0b',
  [STATE_IDLE]: 'var(--accent)'
};

const STATE_LABEL_MAP = {
  [STATE_IDLE]: '准备开始',
  [STATE_WORK]: '🔥 专注工作中',
  [STATE_BREAK]: '☕ 休息时间',
  [STATE_PAUSED]: '⏸️ 已暂停'
};

// ───── Audio ─────
function playBeep() {
  try {
    const ctx = new AudioContext();
    [800, 600, 400].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.15);
    });
  } catch(e) { /* ignore */ }
}

// ───── Notification ─────
function notify(title, body) {
  try {
    chrome.runtime.sendMessage({ type: 'notify', title, body });
  } catch(e) { /* ignore */ }
}

// ───── Background sync ─────
function syncToBackground() {
  const timerState = state === STATE_WORK || state === STATE_BREAK ? state : STATE_PAUSED;
  chrome.runtime.sendMessage({
    type: 'sync',
    timerState,
    secondsLeft,
    workMin,
    breakMin,
    sessions,
  }).catch(() => {});
}

function updateBadge() {
  const min = Math.floor(secondsLeft / 60);
  const text = state === STATE_WORK || state === STATE_BREAK ? String(min) : '';
  const color = state === STATE_WORK ? '#c41e3a' : state === STATE_BREAK ? '#1a7f37' : '#86868b';
  try {
    chrome.runtime.sendMessage({ type: 'badge', text, color });
  } catch(e) {}
}

// ───── Timer logic ─────
function switchPhase() {
  if (state === STATE_WORK) {
    state = STATE_BREAK;
    sessions++;
    document.getElementById('sessionCount').textContent = sessions;
    secondsLeft = breakMin * 60;
    const totalSec = breakMin * 60;
    endTime = Date.now() + secondsLeft * 1000;
    playBeep();
    notify('番茄钟', '工作完成！休息一下吧 ☕');
    updateBadge();
    syncToBackground();
  } else {
    state = STATE_WORK;
    secondsLeft = workMin * 60;
    endTime = Date.now() + secondsLeft * 1000;
    playBeep();
    notify('番茄钟', '休息结束！开始新的工作周期 🔥');
    updateBadge();
    syncToBackground();
  }
}

function tick() {
  secondsLeft--;
  if (secondsLeft <= 0) {
    switchPhase();
  }
  updateBadge();
  render();
}

function startTimer() {
  endTime = Date.now() + secondsLeft * 1000;
  state = sessions > 0 || state === STATE_BREAK ? STATE_WORK : STATE_WORK;
  secondsLeft = secondsLeft; // keep current value
  intervalId = setInterval(tick, 1000);
  updateBadge();
  syncToBackground();
  render();
}

function pauseTimer() {
  clearInterval(intervalId);
  intervalId = null;
  state = STATE_PAUSED;
  updateBadge();
  syncToBackground();
  render();
}

function resumeTimer() {
  endTime = Date.now() + secondsLeft * 1000;
  // Determine which phase we were in based on the remaining context
  state = determinePhase();
  intervalId = setInterval(tick, 1000);
  updateBadge();
  syncToBackground();
  render();
}

function determinePhase() {
  // If we just started a fresh work cycle but haven't completed any, it's work
  // Otherwise check if secondsLeft matches break or work
  const totalWork = workMin * 60;
  const totalBreak = breakMin * 60;
  if (secondsLeft === totalWork && sessions > 0) return STATE_WORK;
  if (secondsLeft === totalBreak && sessions > 0) return STATE_BREAK;
  // Default: work mode
  return STATE_WORK;
}

function resetTimer() {
  clearInterval(intervalId);
  intervalId = null;
  state = STATE_IDLE;
  secondsLeft = workMin * 60;
  sessions = 0;
  sessionCount.textContent = '0';
  updateBadge();
  syncToBackground();
  render();
}

// ───── Render ─────
function render() {
  const min = Math.floor(secondsLeft / 60);
  const sec = secondsLeft % 60;
  timeDisplay.textContent = String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');

  const totalSec = state === STATE_WORK ? workMin * 60 : state === STATE_BREAK ? breakMin * 60 : workMin * 60;
  const pct = state === STATE_PAUSED ? (1 - secondsLeft / totalSec) * 100 : state === STATE_IDLE ? 0 : (1 - secondsLeft / totalSec) * 100;
  progressFill.style.width = pct + '%';

  const color = COLOR_MAP[state] || 'var(--accent)';
  stateLabel.style.color = color;
  timeDisplay.style.color = color;
  progressFill.style.background = color;
  stateLabel.textContent = STATE_LABEL_MAP[state] || '准备开始';

  // Button visibility
  if (state === STATE_IDLE) {
    btnStart.textContent = '开始';
    btnStart.style.display = '';
    btnPause.style.display = 'none';
  } else if (state === STATE_PAUSED) {
    btnStart.textContent = '继续';
    btnStart.style.display = '';
    btnPause.style.display = 'none';
  } else {
    btnStart.style.display = 'none';
    btnPause.style.display = '';
  }
}

// ───── Event handlers ─────
workSlider.addEventListener('input', () => {
  workMin = parseInt(workSlider.value);
  workMinVal.textContent = workMin;
  if (state === STATE_IDLE) {
    secondsLeft = workMin * 60;
    render();
  }
});

breakSlider.addEventListener('input', () => {
  breakMin = parseInt(breakSlider.value);
  breakMinVal.textContent = breakMin;
});

btnStart.addEventListener('click', () => {
  if (state === STATE_PAUSED) {
    resumeTimer();
  } else {
    startTimer();
  }
});

btnPause.addEventListener('click', pauseTimer);

btnReset.addEventListener('click', resetTimer);

// ───── Background message listener ─────
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'tick') {
    secondsLeft = Math.max(0, Math.ceil((msg.endTime - Date.now()) / 1000));
    if (secondsLeft <= 0) {
      switchPhase();
    }
    render();
  }
  if (msg.type === 'phaseSwitch') {
    state = msg.state;
    secondsLeft = msg.secondsLeft;
    sessions = msg.sessions;
    sessionCount.textContent = sessions;
    endTime = msg.endTime;
    render();
  }
});

// ───── Init: restore state from storage ─────
(function init() {
  chrome.storage.local.get(['timerState', 'secondsLeft', 'endTime', 'workMin', 'breakMin', 'sessions'], (data) => {
    if (data.workMin) { workMin = data.workMin; workSlider.value = workMin; workMinVal.textContent = workMin; }
    if (data.breakMin) { breakMin = data.breakMin; breakSlider.value = breakMin; breakMinVal.textContent = breakMin; }
    if (data.sessions) { sessions = data.sessions; sessionCount.textContent = sessions; }

    if (data.timerState && data.timerState !== STATE_IDLE && data.timerState !== STATE_PAUSED) {
      state = data.timerState;
      secondsLeft = Math.max(0, Math.ceil((data.endTime - Date.now()) / 1000));
      endTime = data.endTime;
      if (secondsLeft <= 0) {
        switchPhase();
        syncToBackground();
      } else {
        intervalId = setInterval(tick, 1000);
      }
    } else {
      secondsLeft = workMin * 60;
    }

    render();
  });
})();
