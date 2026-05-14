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
const petBody = document.getElementById('petBody');
const hungerBar = document.getElementById('hungerBar');
const happyBar = document.getElementById('happyBar');
const hungerText = document.getElementById('hungerText');
const happyText = document.getElementById('happyText');
const foodCount = document.getElementById('foodCount');
const btnFeed = document.getElementById('btnFeed');
const btnPetPet = document.getElementById('btnPetPet');
const petNameEl = document.getElementById('petName');

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

const AVAILABLE_PETS = ['cat', 'dog', 'rabbit', 'bear', 'fox'];

const PET_TYPES = {
  cat:    { name: '猫咪', emoji: '🐱', cssClass: 'pet-cat', foodName: '鱼罐头', foodEmoji: '🐟', foodIcon: '🐟' },
  dog:    { name: '狗狗', emoji: '🐶', cssClass: 'pet-dog', foodName: '骨头', foodEmoji: '🦴', foodIcon: '🦴' },
  rabbit: { name: '兔子', emoji: '🐰', cssClass: 'pet-rabbit', foodName: '胡萝卜', foodEmoji: '🥕', foodIcon: '🥕' },
  bear:   { name: '小熊', emoji: '🐻', cssClass: 'pet-bear', foodName: '蜂蜜罐', foodEmoji: '🍯', foodIcon: '🍯' },
  fox:    { name: '狐狸', emoji: '🦊', cssClass: 'pet-fox', foodName: '烤肉', foodEmoji: '🥩', foodIcon: '🥩' },
};

// Pet name pools
const PET_NAMES = {
  cat: ['小咪', '团团', '咪咪', '奶糖', '鱼丸'],
  dog: ['小汪', '旺财', '豆豆', '馒头', '肉松'],
  rabbit: ['小跳', '雪球', '棉花', '奶糖', '团子'],
  bear: ['小憨', '胖达', '滚滚', '蜜蜜', '吨吨'],
  fox: ['小灵', '火火', '苏苏', '尾尾', '橙子'],
};

// Pet state
let petData = {
  adopted: false,     // has adopted a pet
  alive: false,       // is pet alive
  petType: null,      // 'cat' | 'dog' | 'rabbit' | 'bear' | 'fox'
  petName: '',        // random name
  hunger: 100,
  happiness: 80,
  food: 3,
  totalPomodoros: 0,
  lastTickTime: Date.now(),
};

// ───── DOM refs for pet panel ─────
const petAdopt = document.getElementById('petAdopt');
const petDead = document.getElementById('petDead');
const petAlive = document.getElementById('petAlive');
const petDeadName = document.getElementById('petDeadName');
const petTypeBadge = document.getElementById('petTypeBadge');
const btnAdopt = document.getElementById('btnAdopt');
const hungerIcon = document.getElementById('hungerIcon');
const foodIcon = document.getElementById('foodIcon');
const foodLabel = document.getElementById('foodLabel');

// ───── Pet helpers ─────
function getPetInfo(type) {
  return PET_TYPES[type] || PET_TYPES.cat;
}

function getFoodEmoji() {
  if (!petData.petType) return '🥫';
  return getPetInfo(petData.petType).foodEmoji;
}

function getFoodName() {
  if (!petData.petType) return '食物';
  return getPetInfo(petData.petType).foodName;
}

// ───── Pet storage ─────
function loadPetData() {
  chrome.storage.local.get(['petData'], (data) => {
    if (data.petData) {
      petData = { ...petData, ...data.petData };
    }
    showCorrectPetScreen();
    updatePetUI();
    updatePetAppearance();
  });
}

function savePetData() {
  chrome.storage.local.set({ petData });
}

// ───── Show correct screen ─────
function showCorrectPetScreen() {
  petAdopt.style.display = 'none';
  petDead.style.display = 'none';
  petAlive.style.display = 'none';

  if (!petData.adopted) {
    petAdopt.style.display = '';
  } else if (!petData.alive) {
    petDead.style.display = '';
    if (petData.petType) {
      const info = getPetInfo(petData.petType);
      petDeadName.textContent = petData.petName + ' 饿死了';
    }
  } else {
    petAlive.style.display = '';
    const info = getPetInfo(petData.petType);
    petTypeBadge.textContent = info.emoji;
    petNameEl.textContent = petData.petName;
    hungerIcon.textContent = getFoodEmoji();
    foodIcon.textContent = getFoodEmoji();
    foodLabel.textContent = getFoodName();
    updatePetAppearance();
    updatePetAnimClass();
  }
}

// ───── Decay hunger / check death ─────
function petTick() {
  if (!petData.alive) return;
  const now = Date.now();
  const elapsedMin = (now - petData.lastTickTime) / 60000;
  if (elapsedMin >= 1) {
    const decayMin = Math.floor(elapsedMin);
    petData.hunger = Math.max(0, petData.hunger - decayMin * 2);
    if (petData.hunger < 30) {
      petData.happiness = Math.max(0, petData.happiness - decayMin);
    }
    petData.lastTickTime = now;

    // Check death
    if (petData.hunger <= 0) {
      petData.alive = false;
      petData.happiness = 0;
      savePetData();
      showCorrectPetScreen();
      updatePetUI();
      updatePetAppearance();
      return;
    }
    savePetData();
  }
  if (petPanel.style.display !== 'none') updatePetUI();
}

// ───── Actions ─────
function awardFood(amount) {
  if (!petData.alive) return;
  petData.food += amount;
  petData.totalPomodoros += amount;
  savePetData();
}

function feedPet() {
  if (!petData.alive || petData.food <= 0 || petData.hunger >= 100) return;
  petData.food--;
  petData.hunger = Math.min(100, petData.hunger + 30);
  petData.happiness = Math.min(100, petData.happiness + 10);
  savePetData();

  // Show eating animation
  if (petBody) {
    petBody.classList.remove('happy', 'sad');
    petBody.classList.add('eating');
    setTimeout(() => {
      petBody.classList.remove('eating');
      updatePetAnimClass();
    }, 1400);
  }
  const stage = document.getElementById('petStage');
  spawnEffect('food', stage, stage.offsetWidth / 2, stage.offsetHeight / 2);
  updatePetUI();
}

function petPet() {
  if (!petData.alive) return;
  petData.happiness = Math.min(100, petData.happiness + 5);
  savePetData();

  // Happy bounce effect
  if (petBody) {
    petBody.classList.remove('sad', 'eating');
    petBody.classList.add('happy');
    setTimeout(() => {
      petBody.classList.remove('happy');
      updatePetAnimClass();
    }, 1200);
  }
  const stage = document.getElementById('petStage');
  spawnEffect('heart', stage, Math.random() * stage.offsetWidth * 0.6 + stage.offsetWidth * 0.2, stage.offsetHeight * 0.5);
  updatePetUI();
}

// ───── Adopt a random pet ─────
function adoptPet() {
  if (petData.adopted) return;

  const idx = Math.floor(Math.random() * AVAILABLE_PETS.length);
  const type = AVAILABLE_PETS[idx];
  const names = PET_NAMES[type] || ['小宠'];
  const name = names[Math.floor(Math.random() * names.length)];

  petData.adopted = true;
  petData.alive = true;
  petData.petType = type;
  petData.petName = name;
  petData.hunger = 100;
  petData.happiness = 80;
  petData.food = 3;
  petData.lastTickTime = Date.now();
  savePetData();

  showCorrectPetScreen();
  updatePetUI();
  updatePetAppearance();
}

btnAdopt.addEventListener('click', adoptPet);

function spawnEffect(type, parent, x, y) {
  if (!parent) return;
  const el = document.createElement('div');
  el.className = type === 'heart' ? 'heart-float' : 'food-float';
  if (type === 'heart') {
    el.textContent = ['❤️', '💕', '💖', '✨'][Math.floor(Math.random() * 4)];
  } else {
    el.textContent = getFoodEmoji();
  }
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  parent.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

// ───── Pet UI update ─────
function updatePetUI() {
  if (!petData.alive) return;

  // Hunger bar
  const h = petData.hunger;
  hungerBar.style.width = h + '%';
  const barLow = h < 20;
  if (h < 10) { hungerBar.classList.add('low'); hungerText.textContent = '濒临饿死'; }
  else if (h < 20) { hungerBar.classList.add('low'); hungerText.textContent = '饿坏了'; }
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

  // Update image animation
  updatePetAppearance();
}

// ───── Pet CSS class rendering ─────
function updatePetAppearance() {
  if (!petBody) return;

  // Remove all old type classes
  petBody.classList.remove('pet-cat', 'pet-dog', 'pet-rabbit', 'pet-bear', 'pet-fox');
  petBody.classList.remove('happy', 'sad', 'eating', 'dead');

  if (!petData.adopted || !petData.alive) {
    if (!petData.alive && petData.adopted) {
      petBody.classList.add('dead');
    }
    return;
  }

  // Set pet type class (for colors)
  const info = getPetInfo(petData.petType);
  petBody.classList.add(info.cssClass);

  // Mood animation
  if (petData.hunger < 20) {
    petBody.classList.add('sad');
  } else if (petData.happiness >= 80) {
    petBody.classList.add('happy');
  }
  // else idle (default animation on .pet-body)
}

function updatePetAnimClass() {
  if (!petData.alive || !petBody) return;
  petBody.classList.remove('happy', 'sad', 'eating');
  if (petData.hunger < 20) petBody.classList.add('sad');
  else if (petData.happiness >= 80) petBody.classList.add('happy');
}

// Idle loop
function animatePet() {
  requestAnimationFrame(animatePet);
}

// ───── Pet event handlers ─────
btnFeed.addEventListener('click', feedPet);
btnPetPet.addEventListener('click', petPet);

// ───── Pet init ─────
loadPetData();
petTick();
setInterval(petTick, 30000);
requestAnimationFrame(animatePet);

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
