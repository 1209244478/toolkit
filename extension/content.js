// ───── Pomodoro Break Cat Overlay - Content Script ─────

const CAT_EMOJIS = ['🐱', '🐈', '😸', '😺', '😻', '🐈‍⬛'];

let catElements = [];
let overlayEl = null;
let timerInterval = null;

function createOverlay(secondsLeft) {
  if (overlayEl) return;

  // Fullscreen overlay to block user interaction
  overlayEl = document.createElement('div');
  overlayEl.id = 'pomodoro-break-overlay';
  overlayEl.innerHTML = `
    <div class="overlay-msg">
      <h2>☕ 休息时间</h2>
      <p>起来走走，看看远处，小猫在陪你~</p>
      <div class="overlay-timer" id="overlay-timer"></div>
    </div>
  `;

  // Block all input events
  overlayEl.addEventListener('click', (e) => e.stopPropagation());
  overlayEl.addEventListener('mousedown', (e) => e.stopPropagation());
  overlayEl.addEventListener('mouseup', (e) => e.stopPropagation());
  overlayEl.addEventListener('keydown', (e) => e.stopPropagation());
  overlayEl.addEventListener('keyup', (e) => e.stopPropagation());
  overlayEl.addEventListener('wheel', (e) => e.stopPropagation());
  overlayEl.addEventListener('touchstart', (e) => e.stopPropagation());
  overlayEl.addEventListener('contextmenu', (e) => e.preventDefault());

  document.body.appendChild(overlayEl);

  updateTimer(secondsLeft);
}

function updateTimer(secondsLeft) {
  if (!overlayEl) return;
  const timerEl = overlayEl.querySelector('#overlay-timer');
  if (!timerEl) return;
  const min = Math.floor(secondsLeft / 60);
  const sec = secondsLeft % 60;
  timerEl.textContent = String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
}

function spawnCats() {
  removeCats();
  // Spawn cats across the page
  for (let i = 0; i < 12; i++) {
    const cat = document.createElement('div');
    cat.className = 'cat-runner';
    cat.textContent = CAT_EMOJIS[i % CAT_EMOJIS.length];
    document.body.appendChild(cat);
    catElements.push(cat);
  }
}

function removeCats() {
  catElements.forEach(el => el.remove());
  catElements = [];
}

function removeOverlay() {
  if (overlayEl) {
    overlayEl.remove();
    overlayEl = null;
  }
  removeCats();
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function showBreak(secondsLeft) {
  createOverlay(secondsLeft);
  spawnCats();

  // Update timer every second
  let remaining = secondsLeft;
  updateTimer(remaining);
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    remaining--;
    if (remaining < 0) remaining = 0;
    updateTimer(remaining);
  }, 1000);
}

// ───── Message listener ─────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'breakStart') {
    showBreak(msg.secondsLeft);
    sendResponse({ ok: true });
  }
  if (msg.type === 'breakEnd') {
    removeOverlay();
    sendResponse({ ok: true });
  }
  if (msg.type === 'breakTick') {
    updateTimer(msg.secondsLeft);
  }
  return true; // keep channel open for async response
});
