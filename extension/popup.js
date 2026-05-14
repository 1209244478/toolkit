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

const AVAILABLE_PETS = ['cat', 'dog', 'rabbit', 'bear', 'fox'];

const PET_TYPES = {
  cat:    { name: '猫咪', emoji: '🐱', foodName: '鱼罐头', foodEmoji: '🐟', foodIcon: '🐟' },
  dog:    { name: '狗狗', emoji: '🐶', foodName: '骨头', foodEmoji: '🦴', foodIcon: '🦴' },
  rabbit: { name: '兔子', emoji: '🐰', foodName: '胡萝卜', foodEmoji: '🥕', foodIcon: '🥕' },
  bear:   { name: '小熊', emoji: '🐻', foodName: '蜂蜜罐', foodEmoji: '🍯', foodIcon: '🍯' },
  fox:    { name: '狐狸', emoji: '🦊', foodName: '烤肉', foodEmoji: '🥩', foodIcon: '🥩' },
};

// Pet name pools
const PET_NAMES = {
  cat: ['小咪', '团团', '咪咪', '奶糖', '鱼丸'],
  dog: ['小汪', '旺财', '豆豆', '馒头', '肉松'],
  rabbit: ['小跳', '雪球', '棉花', '奶糖', '团子'],
  bear: ['小憨', '胖达', '滚滚', '蜜蜜', '吨吨'],
  fox: ['小灵', '火火', '苏苏', '尾尾', '橙子'],
};

// Dead frame — X eyes, gray body
const PET_DEAD_FRAME = [
  '................',
  '................',
  '......@@@@......',
  '.....######.....',
  '....##+##+##....',
  '...##++++++##...',
  '...##+XXXX+##...',
  '...##########...',
  '....########....',
  '.....@+++@......',
  '......@@@.......',
  '.....@+@+@......',
  '....@+++++@.....',
  '...@+++++++@....',
  '................',
  '................',
];

// Multi-color legend:
//   @ = dark body/outline
//   # = main fur color
//   * = pink/skin (inner ear, nose)
//   + = white/light area (face, belly)
//   ~ = accent/eye color
//   $ = tongue
//   % = secondary fur (patches, tail tip)
//   . = transparent

const PET_SPRITES = {
  // ───── Cat: orange tabby with pointed ears, whiskers ─────
  cat: {
    frames: [
      // idle
      ['................','................','......##........','.....####.......','....*####*......','...**####**.....','...*######*.....','...########.....','...###++###.....','....##++##......','....##++##......','.....@++@.......','.....@##@.......','.....##+##......','.....@..@.......','................'],
      // walk1
      ['................','......##........','.....####.......','....*####*......','...**####**.....','...*######*.....','...########.....','...###++###.....','....##++##......','....##++##......','.....@++@.......','....@####@......','....@++++@......','.....@..@.......','................','................'],
      // walk2
      ['................','................','......##........','.....####.......','....*####*......','...**####**.....','...*######*.....','...########.....','...###++###.....','....##++##......','....##++##......','.....@++@.......','.....@##@.......','....##+##......','...@++++@......','...@....@......'],
      // happy
      ['................','......##........','.....####.......','....*####*......','...**####**.....','...*######*.....','...########.....','...###++###.....','....##++##......','....##++##......','.....@++@.......','.....@##@.......','....##+##......','.....@..@.......','....@.@@.@......','....@....@......'],
      // sad
      ['................','......##........','.....####.......','....*####*......','...**####**.....','...*######*.....','...########.....','...###++###.....','....##++##......','.....##++##......','......@++@.......','......@##@.......','.....@++++@......','....##+++##......','...@.......@.....','................'],
      // eat
      ['................','......##........','.....####.......','....*####*......','...**####**.....','...*######*.....','...########.....','...###++###.....','....##++##......','....##++##......','.....@++@.......','.....@##@.......','....##++##......','..@.@@@@.@......','................','................'],
    ],
  },
  // ───── Dog: brown with floppy ears, tongue out ─────
  dog: {
    frames: [
      // idle
      ['................','................','......##........','....######......','...########.....','..##++++++##....','..##++++++##....','..##########....','...##+++###.....','....#+++##......','.....#++#.......','.....@++@.......','.....@##@.......','....##++##......','....@+@@+@......','....@....@......'],
      // walk1
      ['................','......##........','....######......','...########.....','..##++++++##....','..##++++++##....','..##########....','...##+++###.....','....#+++##......','.....#++#.......','......@++@.......','.....@####@......','.....@++++@......','......@..@.......','................','................'],
      // walk2
      ['................','................','......##........','....######......','...########.....','..##++++++##....','..##++++++##....','..##########....','...##+++###.....','....#+++##......','.....#++#.......','......@++@.......','......@##@.......','.....@++++@......','....##+..+##.....','...@........@....'],
      // happy
      ['................','......##........','....######......','...########.....','..##++++++##....','..##++++++##....','..##########....','...##+++###.....','....#+++##......','.....#++#.......','......@++@.......','......@##@.......','.....@++++@......','......@..@.......','.....@.@@.@......','.....@....@......'],
      // sad
      ['................','......##........','....######......','...########.....','..##++++++##....','..##++++++##....','..##########....','...##+++###.....','....#+++##......','......#++#........','.......@++@........','.......@##@........','......@++++@.......','.....@+++++@.......','....@.......@......','................'],
      // eat
      ['................','......##........','....######......','...########.....','..##++++++##....','..##++++++##....','..##########....','...##+++###.....','....#+++##......','.....#++#.......','......@++@.......','......@##@.......','.....@++++@......','...@.@@@@.@......','................','................'],
    ],
  },
  // ───── Rabbit: white with long ears ─────
  rabbit: {
    frames: [
      // idle
      ['.....@+++@......','....@+++++@.....','...@+++++++@....','..@+++++++++@...','..@+++++++++@...','..@+++++++++@...','..@+++++++++@...','...@+++++++@....','....@#####@.....','.....##@##......','.....#**#.......','.....@##@.......','.....@++@.......','.....@++@.......','.....@..@.......','......@@........'],
      // walk1
      ['.....@+++@......','....@+++++@.....','...@+++++++@....','..@+++++++++@...','..@+++++++++@...','..@+++++++++@...','..@+++++++++@...','...@+++++++@....','....@#####@.....','.....##@##......','.....#**#.......','.....@##@.......','.....@++@.......','......@++@.......','......@@@........','................'],
      // walk2
      ['......@+++@.......','.....@+++++@......','....@+++++++@.....','...@+++++++++@....','...@+++++++++@....','...@+++++++++@....','...@+++++++++@....','....@+++++++@.....','.....@#####@......','......##@##.......','......#**#........','......@##@........','......@++@........','.....@++@.........','....@.@@.@........','....@....@........'],
      // happy
      ['.....@+++@......','....@+++++@.....','...@+++++++@....','..@+++++++++@...','..@+++++++++@...','..@+++++++++@...','..@+++++++++@...','...@+++++++@....','....@#####@.....','.....##@##......','.....#**#.......','.....@##@.......','.....@++@.......','......@++@.......','.....@.@@.@......','.....@....@......'],
      // sad
      ['.....@+++@......','....@+++++@.....','...@+++++++@....','..@+++++++++@...','..@+++++++++@...','..@+++++++++@...','..@+++++++++@...','...@+++++++@....','....@#####@.....','.....##@##......','......#**#........','.......@##@........','......@++++@.......','......@+++++@......','.....@.......@.....','................'],
      // eat
      ['.....@+++@......','....@+++++@.....','...@+++++++@....','..@+++++++++@...','..@+++++++++@...','..@+++++++++@...','..@+++++++++@...','...@+++++++@....','....@#####@.....','.....##@##......','.....#**#.......','.....@##@.......','.....@++@.......','....@.@@@@.@....','................','................'],
    ],
  },
  // ───── Bear: brown round face, small ears ─────
  bear: {
    frames: [
      // idle
      ['................','......####......','....########....','...##*++*##.....','..##++++++##....','..##++++++##....','..##*####*##....','...########.....','....###++##.....','.....##++##.....','.....##++##.....','......@++@......','......@##@......','......@@@@......','.....@++++@.....','.....@....@.....'],
      // walk1
      ['................','......####......','....########....','...##*++*##.....','..##++++++##....','..##++++++##....','..##*####*##....','...########.....','....###++##.....','.....##++##.....','.....##++##.....','.......@++@.......','......@####@......','......@++++@......','.......@..@.......','................'],
      // walk2
      ['................','................','......####......','....########....','...##*++*##.....','..##++++++##....','..##++++++##....','..##*####*##....','...########.....','....###++##.....','.....##++##.....','.....##++##.....','.......@++@.......','.......@##@.......','......@++++@......','......@....@......'],
      // happy
      ['................','......####......','....########....','...##*++*##.....','..##++++++##....','..##++++++##....','..##*####*##....','...########.....','....###++##.....','.....##++##.....','.....##++##.....','.......@++@.......','.......@##@.......','.......@@@@.......','......@.@@.@......','......@....@......'],
      // sad
      ['................','......####......','....########....','...##*++*##.....','..##++++++##....','..##++++++##....','..##*####*##....','...########.....','....###++##.....','......##++##......','.......##++##......','........@++@........','........@##@........','.......@++++@.......','......@+++++@.......','.....@.......@......'],
      // eat
      ['................','......####......','....########....','...##*++*##.....','..##++++++##....','..##++++++##....','..##*####*##....','...########.....','....###++##.....','.....##++##.....','.....##++##.....','.......@++@.......','.......@##@.......','......@@@@@@......','.....@......@.....','................'],
    ],
  },
  // ───── Fox: orange with white face, pointed snout, big tail ─────
  fox: {
    frames: [
      // idle
      ['................','........##......','.......####.....','......######....','.....##*++*##...','....##++++++##..','....##++++++##..','....##########..','.....##+++###...','......#+++##....','......#+++##....','.......@++@.....','.......@##@.....','.......@%%@.....','......@%%%%@....','......@%%%%@....'],
      // walk1
      ['................','........##......','.......####.....','......######....','.....##*++*##...','....##++++++##..','....##++++++##..','....##########..','.....##+++###...','......#+++##....','......#+++##....','........@++@......','.......@####@.....','.......@++++@.....','........@..@......','................'],
      // walk2
      ['................','................','........##......','.......####.....','......######....','.....##*++*##...','....##++++++##..','....##++++++##..','....##########..','.....##+++###...','......#+++##....','......#+++##....','........@++@......','........@##@......','.......@%%%%%%%%@.','......@%%%%%%%%@..'],
      // happy
      ['................','........##......','.......####.....','......######....','.....##*++*##...','....##++++++##..','....##++++++##..','....##########..','.....##+++###...','......#+++##....','......#+++##....','.......@++@......','.......@##@......','.......@%%@......','......@.%%@......','......@....@.....'],
      // sad
      ['................','........##......','.......####.....','......######....','.....##*++*##...','....##++++++##..','....##++++++##..','....##########..','.....##+++###...','.......#+++##.....','........#+++##.....','.........@++@.......','.........@##@.......','........@%%%%@......','.......@%%%%%%@.....','......@........@....'],
      // eat
      ['................','........##......','.......####.....','......######....','.....##*++*##...','....##++++++##..','....##++++++##..','....##########..','.....##+++###...','......#+++##....','......#+++##....','.......@++@......','.......@##@......','......@%%%%@.....','.....@.@@@@.@....','................'],
    ],
  },
};

const PET_SPRITE_SIZE = 16;
const PET_PIXEL = 13;
const PET_ANIM_FRAME_MS = 450;

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

let petAnimFrame = 0;
let petAnimTimer = 0;
let petLastTime = performance.now();
let petSpecialAnim = null;
let petSpecialTimer = 0;

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
function getPetFrames(type) {
  return PET_SPRITES[type] ? PET_SPRITES[type].frames : PET_SPRITES.cat.frames;
}

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
    renderPet();
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
    petTypeBadge.textContent = getPetInfo(petData.petType).emoji;
    petNameEl.textContent = petData.petName;
    hungerIcon.textContent = getFoodEmoji();
    foodIcon.textContent = getFoodEmoji();
    foodLabel.textContent = getFoodName();
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
      renderPet();
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

  triggerSpecialAnim('eat');
  const stage = document.getElementById('petStage');
  spawnEffect('food', stage, stage.offsetWidth / 2, stage.offsetHeight / 2);
  updatePetUI();
}

function petPet() {
  if (!petData.alive) return;
  petData.happiness = Math.min(100, petData.happiness + 5);
  savePetData();

  triggerSpecialAnim('happy');
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
  renderPet();
}

btnAdopt.addEventListener('click', adoptPet);

function triggerSpecialAnim(type) {
  petSpecialAnim = type;
  petSpecialTimer = 1200;
}

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
}

// ───── Pet Canvas Render ─────
function renderPetAnimFrame() {
  // Dead pet
  if (petData.adopted && !petData.alive) {
    return PET_DEAD_FRAME;
  }

  if (!petData.petType || !petData.alive) return null;

  const frames = getPetFrames(petData.petType);
  if (petSpecialAnim) {
    const idx = petSpecialAnim === 'happy' ? 3 : petSpecialAnim === 'sad' ? 4 : 5;
    return frames[Math.min(idx, frames.length - 1)] || frames[0];
  }
  return frames[petAnimFrame % 3] || frames[0];
}

// ───── Color map for sprite chars ─────
function getColorMap(type) {
  const palettes = {
    cat:    { '@':'#3a2a1a', '#':'#e8873a', '*':'#f4a8b0', '+':'#fff8ee', '~':'#5b8c5a', '$':'#e85d75', '%':'#3a2a1a' },
    dog:    { '@':'#3a2a1a', '#':'#b5651d', '*':'#f4a8b0', '+':'#fff5e6', '~':'#5b8c5a', '$':'#e85d75', '%':'#3a2a1a' },
    rabbit: { '@':'#4a4a4a', '#':'#f0e6d3', '*':'#f4a8b0', '+':'#ffffff', '~':'#e8873a', '$':'#e85d75', '%':'#4a4a4a' },
    bear:   { '@':'#3a2a1a', '#':'#8b5e3c', '*':'#f4a8b0', '+':'#f5deb3', '~':'#3a2a1a', '$':'#e85d75', '%':'#3a2a1a' },
    fox:    { '@':'#3a2a1a', '#':'#e8751a', '*':'#f4a8b0', '+':'#fffaf0', '~':'#5b8c5a', '$':'#e85d75', '%':'#faf0e6' },
  };
  return palettes[type] || palettes.cat;
}

function renderPet() {
  if (petData.adopted && !petData.alive && petPanel.style.display === 'none') return;

  const w = petCanvas.width;
  const h = petCanvas.height;
  petCtx.clearRect(0, 0, w, h);

  const sprite = renderPetAnimFrame();
  if (!sprite) return;

  const spritePixel = PET_PIXEL;
  const spriteW = PET_SPRITE_SIZE * spritePixel;
  const spriteH = PET_SPRITE_SIZE * spritePixel;
  const ox = Math.floor((w - spriteW) / 2);
  const oy = Math.floor((h - spriteH) / 2);

  let bounceY = 0;
  if (petData.alive && petData.happiness >= 80) {
    bounceY = Math.sin(performance.now() * 0.004) * 4;
  }

  const isDead = petData.adopted && !petData.alive;
  const deadColorMap = { '@':'#999', '#':'#bbb', '*':'#ccc', '+':'#ddd', '~':'#aaa', '$':'#aaa', '%':'#888', 'X':'#777' };
  const colorMap = isDead ? deadColorMap : getColorMap(petData.petType);

  // Draw body pixels with colors
  for (let row = 0; row < PET_SPRITE_SIZE; row++) {
    for (let col = 0; col < PET_SPRITE_SIZE; col++) {
      const ch = sprite[row] ? sprite[row][col] : '.';
      if (ch === '.') continue;

      const x = ox + col * spritePixel;
      const y = oy + row * spritePixel + bounceY;
      const color = colorMap[ch] || '#1a1a2e';

      petCtx.fillStyle = color;
      petCtx.fillRect(x, y, spritePixel, spritePixel);
    }
  }

  // Eyes (only for alive pets, dead pets already have X in sprite)
  if (!isDead) {
    const eyeY = oy + 4 * spritePixel + bounceY;
    const leftEyeX = ox + 5 * spritePixel;
    const rightEyeX = ox + 9 * spritePixel;

    // White of eye
    petCtx.fillStyle = '#ffffff';
    petCtx.fillRect(leftEyeX, eyeY, spritePixel - 1, spritePixel);
    petCtx.fillRect(rightEyeX, eyeY, spritePixel - 1, spritePixel);

    // Pupil
    petCtx.fillStyle = colorMap['@'] || '#1a1a2e';
    const pupilSize = spritePixel * 0.5;
    const pupilOffset = spritePixel * 0.25;
    if (petData.happiness < 20) {
      petCtx.fillRect(leftEyeX + pupilOffset, eyeY + spritePixel - pupilSize - 1, pupilSize, pupilSize * 0.6);
      petCtx.fillRect(rightEyeX + pupilOffset, eyeY + spritePixel - pupilSize - 1, pupilSize, pupilSize * 0.6);
    } else {
      petCtx.fillRect(leftEyeX + pupilOffset + 1, eyeY + 2, pupilSize, pupilSize);
      petCtx.fillRect(rightEyeX + pupilOffset + 1, eyeY + 2, pupilSize, pupilSize);
    }

    // Tear if sad
    if (petData.happiness < 20) {
      petCtx.fillStyle = '#60a5fa';
      petCtx.fillRect(leftEyeX + spritePixel - 2, eyeY + spritePixel - 1, 2, 4);
    }
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
