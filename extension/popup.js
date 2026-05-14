// ════════════════════════════════════════
//  Pomodoro Timer + Virtual Pet
// ════════════════════════════════════════

// ───── DOM: Tabs ─────
const tabPomodoro = document.getElementById('tabPomodoro');
const tabPet = document.getElementById('tabPet');
const pomodoroPanel = document.getElementById('pomodoroPanel');
const petPanel = document.getElementById('petPanel');

// ───── DOM: Pomodoro ─────
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

// ───── DOM: Pet ─────
const petCanvas = document.getElementById('petCanvas');
const petCtx = petCanvas.getContext('2d');
const hungerBar = document.getElementById('hungerBar');
const happyBar = document.getElementById('happyBar');
const hungerText = document.getElementById('hungerText');
const happyText = document.getElementById('happyText');
const foodCount = document.getElementById('foodCount');
const btnFeed = document.getElementById('btnFeed');
const btnPetPet = document.getElementById('btnPetPet');
const petNameEl = document.getElementById('petName');
const petSelector = document.getElementById('petSelector');

// ════════════════════════════════════════
//  TAB SWITCHING
// ════════════════════════════════════════
tabPomodoro.addEventListener('click', () => {
  tabPomodoro.classList.add('active');
  tabPet.classList.remove('active');
  pomodoroPanel.style.display = '';
  petPanel.style.display = 'none';
});
tabPet.addEventListener('click', () => {
  tabPet.classList.add('active');
  tabPomodoro.classList.remove('active');
  petPanel.style.display = '';
  pomodoroPanel.style.display = 'none';
  renderPet();
});

// ════════════════════════════════════════
//  POMODORO STATE
// ════════════════════════════════════════
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
let endTime = 0;

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
  } catch(e) {}
}

function notify(title, body) {
  try { chrome.runtime.sendMessage({ type: 'notify', title, body }); } catch(e) {}
}

function syncToBackground() {
  const timerState = state === STATE_WORK || state === STATE_BREAK ? state : STATE_PAUSED;
  chrome.runtime.sendMessage({ type: 'sync', timerState, secondsLeft, workMin, breakMin, sessions, }).catch(() => {});
}

function updateBadge() {
  const min = Math.floor(secondsLeft / 60);
  const text = state === STATE_WORK || state === STATE_BREAK ? String(min) : '';
  const color = state === STATE_WORK ? '#c41e3a' : state === STATE_BREAK ? '#1a7f37' : '#86868b';
  try { chrome.runtime.sendMessage({ type: 'badge', text, color }); } catch(e) {}
}

// ───── Pomodoro completed callback ─────
function onPomodoroComplete() {
  awardFood(1);
  if (petPanel.style.display !== 'none') updatePetUI();
}

// ───── Timer logic ─────
function switchPhase() {
  if (state === STATE_WORK) {
    state = STATE_BREAK;
    sessions++;
    document.getElementById('sessionCount').textContent = sessions;
    secondsLeft = breakMin * 60;
    endTime = Date.now() + secondsLeft * 1000;
    playBeep();
    notify('番茄钟', '工作完成！休息一下吧 ☕');
    onPomodoroComplete();
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
  if (secondsLeft <= 0) switchPhase();
  updateBadge();
  renderPomodoro();
}

function startTimer() {
  endTime = Date.now() + secondsLeft * 1000;
  state = STATE_WORK;
  intervalId = setInterval(tick, 1000);
  updateBadge();
  syncToBackground();
  renderPomodoro();
}

function pauseTimer() {
  clearInterval(intervalId);
  intervalId = null;
  state = STATE_PAUSED;
  updateBadge();
  syncToBackground();
  renderPomodoro();
}

function resumeTimer() {
  endTime = Date.now() + secondsLeft * 1000;
  state = STATE_WORK;
  intervalId = setInterval(tick, 1000);
  updateBadge();
  syncToBackground();
  renderPomodoro();
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
  renderPomodoro();
}

function renderPomodoro() {
  const min = Math.floor(secondsLeft / 60);
  const sec = secondsLeft % 60;
  timeDisplay.textContent = String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
  const totalSec = state === STATE_WORK ? workMin * 60 : state === STATE_BREAK ? breakMin * 60 : workMin * 60;
  const pct = state === STATE_IDLE ? 0 : (1 - secondsLeft / totalSec) * 100;
  progressFill.style.width = pct + '%';
  const color = COLOR_MAP[state] || 'var(--accent)';
  stateLabel.style.color = color;
  timeDisplay.style.color = color;
  progressFill.style.background = color;
  stateLabel.textContent = STATE_LABEL_MAP[state] || '准备开始';
  if (state === STATE_IDLE) { btnStart.textContent = '开始'; btnStart.style.display = ''; btnPause.style.display = 'none'; }
  else if (state === STATE_PAUSED) { btnStart.textContent = '继续'; btnStart.style.display = ''; btnPause.style.display = 'none'; }
  else { btnStart.style.display = 'none'; btnPause.style.display = ''; }
}

// ───── Pomodoro event handlers ─────
workSlider.addEventListener('input', () => {
  workMin = parseInt(workSlider.value);
  workMinVal.textContent = workMin;
  if (state === STATE_IDLE) { secondsLeft = workMin * 60; renderPomodoro(); }
});
breakSlider.addEventListener('input', () => {
  breakMin = parseInt(breakSlider.value);
  breakMinVal.textContent = breakMin;
});
btnStart.addEventListener('click', () => state === STATE_PAUSED ? resumeTimer() : startTimer());
btnPause.addEventListener('click', pauseTimer);
btnReset.addEventListener('click', resetTimer);

// ════════════════════════════════════════
//  VIRTUAL PET SYSTEM
// ════════════════════════════════════════
const PET_TYPES = {
  cat:    { name: '猫咪', emoji: '🐱', unlockAt: 0 },
  dog:    { name: '狗狗', emoji: '🐶', unlockAt: 10 },
  rabbit: { name: '兔子', emoji: '🐰', unlockAt: 20 },
  bear:   { name: '小熊', emoji: '🐻', unlockAt: 30 },
  fox:    { name: '狐狸', emoji: '🦊', unlockAt: 50 },
};

const PET_SPRITES = {
  // Cat — 16x16 pixel art, 3 frames (idle, walk1, walk2)
  cat: {
    name: '小咪',
    frames: [
      // idle
      [
        '................',
        '................',
        '......@@........',
        '.....@@@@.......',
        '....@@..@@......',
        '...@@....@@.....',
        '...@@.@@.@@.....',
        '...@@@@@@@@.....',
        '....@@@@@@......',
        '.....@..@.......',
        '....@@..@@......',
        '....@....@......',
        '...@......@.....',
        '...@..@@..@.....',
        '................',
        '................',
      ],
      // walk 1
      [
        '................',
        '......@@........',
        '.....@@@@.......',
        '....@@..@@......',
        '...@@....@@.....',
        '...@@.@@.@@.....',
        '...@@@@@@@@.....',
        '....@@@@@@......',
        '.....@..@.......',
        '....@@..@@......',
        '...@......@.....',
        '...@......@.....',
        '....@....@......',
        '.....@..@.......',
        '................',
        '................',
      ],
      // walk 2
      [
        '................',
        '................',
        '......@@........',
        '.....@@@@.......',
        '....@@..@@......',
        '...@@....@@.....',
        '...@@.@@.@@.....',
        '...@@@@@@@@.....',
        '....@@@@@@......',
        '.....@..@.......',
        '....@@..@@......',
        '...@......@.....',
        '..@........@....',
        '..@..@@..@@.....',
        '................',
        '................',
      ],
      // happy
      [
        '................',
        '......@@........',
        '.....@@@@.......',
        '....@@..@@......',
        '...@@....@@.....',
        '...@@.@@.@@.....',
        '...@@@@@@@@.....',
        '....@@@@@@......',
        '.....@..@.......',
        '....@@..@@......',
        '....@....@......',
        '...@......@.....',
        '...@..@@..@.....',
        '.......@@.......',
        '......@..@......',
        '.....@....@.....',
      ],
      // sad
      [
        '................',
        '......@@........',
        '.....@@@@.......',
        '....@@..@@......',
        '...@@....@@.....',
        '...@@.@@.@@.....',
        '...@@@@@@@@.....',
        '....@@@@@@......',
        '.....@..@.......',
        '......@@........',
        '.....@..@.......',
        '....@....@......',
        '...@......@.....',
        '...@..@@..@.....',
        '................',
        '................',
      ],
      // eat
      [
        '................',
        '......@@........',
        '.....@@@@.......',
        '....@@..@@......',
        '...@@....@@.....',
        '...@@.@@.@@.....',
        '...@@@@@@@@.....',
        '....@@@@@@......',
        '.....@..@.......',
        '....@@..@@......',
        '...@......@.....',
        '...@..🥫..@.....',
        '....@....@......',
        '.....@..@.......',
        '................',
        '................',
      ],
    ],
  },
  // Dog — placeholder sprites (same structure, different look)
  dog: {
    name: '小汪',
    frames: [
      ['................','................','......@@........','.....@@@@.......','....@@..@@......','...@@....@@.....','...@@....@@.....','...@@@@@@@@.....','....@@@@@@......','.....@..@.......','....@@..@@......','...@......@.....','...@@....@@.....','....@@@@@@......','......@@........','................'],
      ['................','......@@........','.....@@@@.......','....@@..@@......','...@@....@@.....','...@@....@@.....','...@@@@@@@@.....','....@@@@@@......','.....@..@.......','....@@..@@......','...@......@.....','...@......@.....','....@....@......','.....@..@.......','................','................'],
      ['................','................','......@@........','.....@@@@.......','....@@..@@......','...@@....@@.....','...@@....@@.....','...@@@@@@@@.....','....@@@@@@......','.....@..@.......','....@@..@@......','...@......@.....','..@........@....','..@..@@..@@.....','................','................'],
      ['................','......@@........','.....@@@@.......','....@@..@@......','...@@....@@.....','...@@....@@.....','...@@@@@@@@.....','....@@@@@@......','.....@..@.......','....@@..@@......','....@....@......','...@......@.....','...@@....@@.....','....@@@@@@......','......@@........','.......@@.......'],
      ['................','......@@........','.....@@@@.......','....@@..@@......','...@@....@@.....','...@@....@@.....','...@@@@@@@@.....','....@@@@@@......','.....@..@.......','......@@........','.....@..@.......','....@....@......','...@@....@@.....','....@@@@@@......','......@@........','................'],
      ['................','......@@........','.....@@@@.......','....@@..@@......','...@@....@@.....','...@@....@@.....','...@@@@@@@@.....','....@@@@@@......','.....@..@.......','....@@..@@......','...@......@.....','...@..🥫..@.....','...@@....@@.....','....@@@@@@......','......@@........','................'],
    ],
  },
  rabbit: {
    name: '小跳',
    frames: [
      ['................','......@@........','.....@@@@.......','....@@..@@......','...@@....@@.....','...@@....@@.....','...@@@@@@@@.....','....@@@@@@......','.....@..@.......','....@@..@@......','..@@@....@@@....','.@@@@@..@@@@@...','..@@@....@@@....','................','................','................'],
      ['................','......@@........','.....@@@@.......','....@@..@@......','...@@....@@.....','...@@....@@.....','...@@@@@@@@.....','....@@@@@@......','.....@..@.......','....@@..@@......','...@@@..@@@.....','..@@@@@@@@@@....','...@@@..@@@.....','................','................','................'],
      ['................','................','......@@........','.....@@@@.......','....@@..@@......','...@@....@@.....','...@@....@@.....','...@@@@@@@@.....','....@@@@@@......','.....@..@.......','....@@..@@......','..@@@....@@@....','.@@........@@...','................','................','................'],
      ['................','......@@........','.....@@@@.......','....@@..@@......','...@@....@@.....','...@@....@@.....','...@@@@@@@@.....','....@@@@@@......','.....@..@.......','....@@..@@......','..@@@....@@@....','.@@@@@..@@@@@...','..@@@....@@@....','................','.......@@.......','......@..@......'],
      ['................','......@@........','.....@@@@.......','....@@..@@......','...@@....@@.....','...@@....@@.....','...@@@@@@@@.....','....@@@@@@......','.....@..@.......','......@@........','.....@..@.......','..@@@....@@@....','.@@........@@...','................','................','................'],
      ['................','......@@........','.....@@@@.......','....@@..@@......','...@@....@@.....','...@@....@@.....','...@@@@@@@@.....','....@@@@@@......','.....@..@.......','....@@..@@......','..@@@....@@@....','.@@@@@..@@@@@...','..@@@..🥫.@@@...','................','................','................'],
    ],
  },
  bear: {
    name: '小憨',
    frames: [
      ['................','.....@@@@@@.....','....@@@@@@@@....','...@@..@@..@@...','...@@......@@...','...@@.@@@@.@@...','...@@@@@@@@@@...','....@@@@@@@@....','.....@@..@@.....','.....@@..@@.....','.....@@..@@.....','....@......@....','...@........@...','..@..........@..','................','................'],
      ['................','.....@@@@@@.....','....@@@@@@@@....','...@@..@@..@@...','...@@......@@...','...@@.@@@@.@@...','...@@@@@@@@@@...','....@@@@@@@@....','.....@@..@@.....','.....@@..@@.....','....@@....@@....','...@........@...','...@........@...','....@......@....','................','................'],
      ['................','.....@@@@@@.....','....@@@@@@@@....','...@@..@@..@@...','...@@......@@...','...@@.@@@@.@@...','...@@@@@@@@@@...','....@@@@@@@@....','.....@@..@@.....','.....@@..@@.....','......@@@@......','....@......@....','...@........@...','..@..........@..','................','................'],
      ['................','.....@@@@@@.....','....@@@@@@@@....','...@@..@@..@@...','...@@......@@...','...@@.@@@@.@@...','...@@@@@@@@@@...','....@@@@@@@@....','.....@@..@@.....','.....@@..@@.....','.....@@..@@.....','....@......@....','...@..@@@@..@...','..@..@....@..@..','......@@@@......','.......@@.......'],
      ['................','.....@@@@@@.....','....@@@@@@@@....','...@@..@@..@@...','...@@......@@...','...@@.@@@@.@@...','...@@@@@@@@@@...','....@@@@@@@@....','.....@@..@@.....','.....@@..@@.....','......@@........','.......@........','...@........@...','..@..........@..','................','................'],
      ['................','.....@@@@@@.....','....@@@@@@@@....','...@@..@@..@@...','...@@......@@...','...@@.@@@@.@@...','...@@@@@@@@@@...','....@@@@@@@@....','.....@@..@@.....','.....@@..@@.....','.....@@..@@.....','....@......@....','...@..🥫..@....','..@..........@..','................','................'],
    ],
  },
  fox: {
    name: '小灵',
    frames: [
      ['................','......@@@.......','.....@@@@@......','....@@@.@@@.....','...@@.....@@....','...@@.@@@.@@....','...@@@@@@@@@....','....@@@@@@@.....','.....@@.@@......','.....@@.@@......','.....@@.@@......','....@@...@@.....','...@@.....@@....','..@@.......@@...','................','................'],
      ['................','......@@@.......','.....@@@@@......','....@@@.@@@.....','...@@.....@@....','...@@.@@@.@@....','...@@@@@@@@@....','....@@@@@@@.....','.....@@.@@......','.....@@.@@......','....@@...@@.....','...@@.....@@....','..@@.......@@...','..@@.........@@.','................','................'],
      ['................','................','......@@@.......','.....@@@@@......','....@@@.@@@.....','...@@.....@@....','...@@.@@@.@@....','...@@@@@@@@@....','....@@@@@@@.....','.....@@.@@......','.....@@.@@......','....@@...@@.....','...@@.....@@....','..@@.......@@...','................','................'],
      ['................','......@@@.......','.....@@@@@......','....@@@.@@@.....','...@@.....@@....','...@@.@@@.@@....','...@@@@@@@@@....','....@@@@@@@.....','.....@@.@@......','.....@@.@@......','.....@@.@@......','....@@...@@.....','...@@..@@..@@...','..@@..@..@..@@..','......@@@.......','.......@........'],
      ['................','......@@@.......','.....@@@@@......','....@@@.@@@.....','...@@.....@@....','...@@.@@@.@@....','...@@@@@@@@@....','....@@@@@@@.....','.....@@.@@......','......@@@@......','.....@@..@@.....','....@@....@@....','...@@......@@...','..@@........@@..','................','................'],
      ['................','......@@@.......','.....@@@@@......','....@@@.@@@.....','...@@.....@@....','...@@.@@@.@@....','...@@@@@@@@@....','....@@@@@@@.....','.....@@.@@......','.....@@.@@......','.....@@.@@......','....@@...@@.....','...@@..🥫.@@....','..@@.......@@...','................','................'],
    ],
  },
};

const PET_SPRITE_SIZE = 16;
const PET_PIXEL = 10; // screen pixels per sprite pixel
const PET_ANIM_FRAME_MS = 400;

// Pet state
let petData = {
  petType: 'cat',
  hunger: 100,
  happiness: 80,
  food: 3,
  totalPomodoros: 0,
  lastTickTime: Date.now(),
};

let petAnimFrame = 0;
let petAnimTimer = 0;
let petLastTime = performance.now();
let petSpecialAnim = null; // 'happy' | 'sad' | 'eat' | null
let petSpecialTimer = 0;
let floatingEffects = [];

// ───── Pet helpers ─────
function getPetFrames(type) {
  return PET_SPRITES[type] ? PET_SPRITES[type].frames : PET_SPRITES.cat.frames;
}

function getUnlockPomodoros(type) {
  return PET_TYPES[type] ? PET_TYPES[type].unlockAt : 999;
}

function isPetUnlocked(type) {
  return petData.totalPomodoros >= getUnlockPomodoros(type);
}

// ───── Pet storage ─────
function loadPetData() {
  chrome.storage.local.get(['petData'], (data) => {
    if (data.petData) {
      petData = { ...petData, ...data.petData };
    }
    updatePetUI();
    renderPet();
  });
}

function savePetData() {
  chrome.storage.local.set({ petData });
}

// ───── Decay hunger over time ─────
function petTick() {
  const now = Date.now();
  const elapsedMin = (now - petData.lastTickTime) / 60000;
  if (elapsedMin >= 1) {
    petData.hunger = Math.max(0, petData.hunger - Math.floor(elapsedMin * 2));
    if (petData.hunger < 30) {
      petData.happiness = Math.max(0, petData.happiness - Math.floor(elapsedMin));
    }
    petData.lastTickTime = now;
    savePetData();
  }
  if (petPanel.style.display !== 'none') updatePetUI();
}

// ───── Actions ─────
function awardFood(amount) {
  petData.food += amount;
  petData.totalPomodoros += amount;
  savePetData();
  updatePetSelector();
}

function feedPet() {
  if (petData.food <= 0) return;
  petData.food--;
  petData.hunger = Math.min(100, petData.hunger + 30);
  petData.happiness = Math.min(100, petData.happiness + 10);
  savePetData();

  // Show eating animation + floating food effect
  triggerSpecialAnim('eat');
  spawnEffect('food', petCanvas.parentElement, petCanvas.parentElement.offsetWidth / 2, petCanvas.parentElement.offsetHeight / 2);
  updatePetUI();
}

function petPet() {
  petData.happiness = Math.min(100, petData.happiness + 5);
  savePetData();

  triggerSpecialAnim('happy');
  spawnEffect('heart', petCanvas.parentElement, Math.random() * petCanvas.parentElement.offsetWidth * 0.6 + petCanvas.parentElement.offsetWidth * 0.2, petCanvas.parentElement.offsetHeight * 0.5);
  updatePetUI();
}

function triggerSpecialAnim(type) {
  petSpecialAnim = type;
  petSpecialTimer = 1200; // ms
}

function spawnEffect(type, parent, x, y) {
  const el = document.createElement('div');
  el.className = type === 'heart' ? 'heart-float' : 'food-float';
  el.textContent = type === 'heart' ? ['❤️', '💕', '💖', '✨'][Math.floor(Math.random() * 4)] : '🥫';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  parent.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

// ───── Pet selection ─────
function selectPet(type) {
  if (!isPetUnlocked(type)) return;
  petData.petType = type;
  petNameEl.textContent = PET_SPRITES[type] ? PET_SPRITES[type].name : PET_TYPES[type].name;
  savePetData();
  updatePetSelector();
  renderPet();
}

petSelector.addEventListener('click', (e) => {
  const btn = e.target.closest('.pet-option');
  if (!btn || btn.classList.contains('locked')) return;
  selectPet(btn.dataset.pet);
});

function updatePetSelector() {
  petSelector.querySelectorAll('.pet-option').forEach(btn => {
    const type = btn.dataset.pet;
    if (PET_TYPES[type]) {
      btn.textContent = PET_TYPES[type].emoji;
      btn.title = PET_TYPES[type].name;
    }
    if (isPetUnlocked(type)) {
      btn.classList.remove('locked');
      if (type === petData.petType) btn.classList.add('active');
      else btn.classList.remove('active');
    } else {
      btn.classList.add('locked');
      btn.classList.remove('active');
      btn.textContent = '🔒';
      btn.title = PET_TYPES[type].name + ' (解锁: ' + getUnlockPomodoros(type) + ' 个番茄)';
    }
  });
}

// ───── Pet UI update ─────
function updatePetUI() {
  // Hunger bar
  const h = petData.hunger;
  hungerBar.style.width = h + '%';
  if (h < 20) { hungerBar.classList.add('low'); hungerText.textContent = '饿坏了'; }
  else if (h < 50) { hungerBar.classList.remove('low'); hungerText.textContent = '有点饿'; }
  else if (h < 80) { hungerBar.classList.remove('low'); hungerText.textContent = '还行'; }
  else { hungerBar.classList.remove('low'); hungerText.textContent = '饱饱的'; }

  // Happiness bar
  const hp = petData.happiness;
  happyBar.style.width = hp + '%';
  if (hp < 20) { happyBar.classList.add('low'); happyText.textContent = '难过'; }
  else if (hp < 50) { happyBar.classList.remove('low'); happyText.textContent = '一般'; }
  else if (hp < 80) { happyBar.classList.remove('low'); happyText.textContent = '开心'; }
  else { happyBar.classList.remove('low'); happyText.textContent = '超开心'; }

  // Food
  foodCount.textContent = petData.food;
  btnFeed.disabled = petData.food <= 0 || petData.hunger >= 100;

  // Selector
  updatePetSelector();
}

// ───── Pet Canvas Render ─────
function renderPetAnimFrame() {
  const frames = getPetFrames(petData.petType);
  if (petSpecialAnim) {
    const idx = petSpecialAnim === 'happy' ? 3 : petSpecialAnim === 'sad' ? 4 : 5;
    return frames[Math.min(idx, frames.length - 1)] || frames[0];
  }
  return frames[petAnimFrame % 3] || frames[0];
}

function renderPet() {
  const w = petCanvas.width;
  const h = petCanvas.height;
  petCtx.clearRect(0, 0, w, h);

  const sprite = renderPetAnimFrame();
  const spritePixel = PET_PIXEL;
  const spriteW = PET_SPRITE_SIZE * spritePixel;
  const spriteH = PET_SPRITE_SIZE * spritePixel;
  const ox = (w - spriteW) / 2;
  const oy = (h - spriteH) / 2;

  // Gentle bounce when happy
  let bounceY = 0;
  if (petData.happiness >= 80) {
    bounceY = Math.sin(performance.now() * 0.004) * 4;
  }

  for (let row = 0; row < PET_SPRITE_SIZE; row++) {
    for (let col = 0; col < PET_SPRITE_SIZE; col++) {
      const ch = sprite[row] ? sprite[row][col] : '.';
      if (ch === '.') continue;

      const x = ox + col * spritePixel;
      const y = oy + row * spritePixel + bounceY;

      if (ch === '@') {
        petCtx.fillStyle = '#1a1a2e';
      } else if (ch === '🥫') {
        petCtx.fillStyle = '#f97316';
        petCtx.fillRect(x, y, spritePixel, spritePixel);
        continue;
      } else {
        continue;
      }

      petCtx.fillRect(x, y, spritePixel, spritePixel);

      // Add a subtle lighter pixel on top for depth
      if (row < PET_SPRITE_SIZE - 1 && sprite[row + 1] && sprite[row + 1][col] === '.') {
        petCtx.fillStyle = '#3a3a5e';
        petCtx.fillRect(x + 1, y + spritePixel - 2, spritePixel - 2, 2);
      }
    }
  }

  // Eyes
  const eyeY = oy + 3 * spritePixel + bounceY;
  const leftEyeX = ox + 5 * spritePixel;
  const rightEyeX = ox + 10 * spritePixel;
  const eyeSize = spritePixel * 0.6;

  petCtx.fillStyle = '#ffffff';
  petCtx.fillRect(leftEyeX + 1, eyeY + 1, spritePixel - 2, spritePixel - 1);
  petCtx.fillRect(rightEyeX + 1, eyeY + 1, spritePixel - 2, spritePixel - 1);

  // Pupils (look around slightly)
  if (petData.happiness < 20) {
    // Sad — pupils down
    petCtx.fillStyle = '#1a1a2e';
    petCtx.fillRect(leftEyeX + 3, eyeY + spritePixel - 2, eyeSize, eyeSize * 0.5);
    petCtx.fillRect(rightEyeX + 3, eyeY + spritePixel - 2, eyeSize, eyeSize * 0.5);
  } else {
    petCtx.fillStyle = '#1a1a2e';
    petCtx.fillRect(leftEyeX + 2, eyeY + 2, eyeSize, eyeSize);
    petCtx.fillRect(rightEyeX + 2, eyeY + 2, eyeSize, eyeSize);
  }

  // If sad, add tear
  if (petData.happiness < 20) {
    petCtx.fillStyle = '#60a5fa';
    petCtx.fillRect(leftEyeX + spritePixel - 2, eyeY + spritePixel, 2, 3);
  }
}

function animatePet(now) {
  const dt = (now - petLastTime) / 1000;
  petLastTime = now;

  petAnimTimer += dt * 1000;
  if (petAnimTimer > PET_ANIM_FRAME_MS) {
    petAnimTimer = 0;
    petAnimFrame++;
  }

  if (petSpecialTimer > 0) {
    petSpecialTimer -= dt * 1000;
    if (petSpecialTimer <= 0) {
      petSpecialAnim = null;
      petSpecialTimer = 0;
    }
  }

  if (petPanel.style.display !== 'none') {
    renderPet();
  }
  requestAnimationFrame(animatePet);
}

// ───── Pet event handlers ─────
btnFeed.addEventListener('click', feedPet);
btnPetPet.addEventListener('click', petPet);

// ───── Pet init ─────
loadPetData();
petTick();
setInterval(petTick, 30000); // tick every 30 seconds
updatePetSelector();
requestAnimationFrame(animatePet);
petNameEl.textContent = PET_SPRITES[petData.petType] ? PET_SPRITES[petData.petType].name : '小番茄';

// ════════════════════════════════════════
//  BACKGROUND MESSAGE LISTENER
// ════════════════════════════════════════
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'tick') {
    secondsLeft = Math.max(0, Math.ceil((msg.endTime - Date.now()) / 1000));
    if (secondsLeft <= 0) switchPhase();
    renderPomodoro();
  }
  if (msg.type === 'phaseSwitch') {
    state = msg.state;
    secondsLeft = msg.secondsLeft;
    sessions = msg.sessions;
    sessionCount.textContent = sessions;
    endTime = msg.endTime;
    renderPomodoro();
  }
});

// ════════════════════════════════════════
//  INIT
// ════════════════════════════════════════
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

    renderPomodoro();
  });
})();
