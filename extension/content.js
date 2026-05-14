// ───── Pomodoro Break Cat Overlay ─────
// Injected via chrome.scripting.executeScript from background.js

(function() {
  if (document.getElementById('pomodoro-break-overlay')) return; // Already shown

  // ───── Block all input ─────
  const blockEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  };

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'pomodoro-break-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483647;background:rgba(0,0,0,0.72);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC",sans-serif;user-select:none;';

  overlay.innerHTML = `
    <div id="break-msg" style="color:#fff;text-align:center;z-index:2;">
      <h2 style="font-size:28px;font-weight:600;margin:0 0 8px;letter-spacing:-0.02em;">☕ 休息时间</h2>
      <p style="font-size:15px;color:rgba(255,255,255,0.55);margin:0 0 16px;">起来走走，看看远处，小猫在陪你~</p>
      <div id="break-countdown" style="font-size:56px;font-weight:700;letter-spacing:-0.03em;font-variant-numeric:tabular-nums;color:#4ade80;">--:--</div>
    </div>
    <canvas id="cats-canvas" style="position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:1;"></canvas>
  `;

  // Block ALL interaction
  ['click','mousedown','mouseup','keydown','keyup','keypress','wheel','touchstart','touchend','touchmove','contextmenu','drag','dragstart','drop','scroll'].forEach(type => {
    overlay.addEventListener(type, blockEvent, { capture: true });
    document.addEventListener(type, blockEvent, { capture: true });
  });

  document.body.appendChild(overlay);

  // ───── Canvas Pixel Cats ─────
  const canvas = document.getElementById('cats-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Pixel cat sprite (8x8 scaled to ~48px)
  // Row 0: idle, Row 1: walk1, Row 2: walk2
  const CAT_SPRITES = [
    // Frame 0 — standing
    [
      '..@..@..',
      '.@@@@@@.',
      '@@@@@@@@',
      '@@.@@.@@',
      '@@@@@@@@',
      '.@@@@@@.',
      '..@..@..',
      '.@@..@@.',
    ],
    // Frame 1 — walk right
    [
      '..@..@..',
      '.@@@@@@.',
      '@@@@@@@@',
      '@@.@@.@@',
      '@@@@@@@@',
      '.@@@@@@.',
      '.@@..@..',
      '@..@@...',
    ],
    // Frame 2 — walk left
    [
      '..@..@..',
      '.@@@@@@.',
      '@@@@@@@@',
      '@@.@@.@@',
      '@@@@@@@@',
      '.@@@@@@.',
      '..@..@@.',
      '...@@..@',
    ],
  ];

  const COLORS = {
    '@': '#1a1a2e', // dark body
    '.': '#ffffff', // white
    // secondary colors for variety
  };

  const CAT_COLORS = [
    { body: '#1a1a2e', white: '#ffffff' },  // black cat
    { body: '#ff6b35', white: '#ffffff' },   // orange cat
    { body: '#4a4a4a', white: '#e8e8e8' },  // gray cat
    { body: '#2d2d2d', white: '#f0f0f0' },  // dark gray
    { body: '#cc5500', white: '#fff8dc' },   // ginger
  ];

  const CAT_COUNT = 8;
  const cats = [];

  const SCALE = 4; // pixel size multiplier
  const SPRITE_W = 8; // sprite width in pixels
  const SPRITE_H = 8; // sprite height in pixels

  for (let i = 0; i < CAT_COUNT; i++) {
    const color = CAT_COLORS[i % CAT_COLORS.length];
    cats.push({
      x: Math.random() * window.innerWidth,
      y: 50 + Math.random() * (window.innerHeight - 150),
      vx: 1 + Math.random() * 2.5,
      vy: 0,
      direction: Math.random() > 0.5 ? 1 : -1,
      frame: 0,
      frameTimer: 0,
      frameSpeed: 8 + Math.random() * 6,
      color,
      scale: SCALE,
      baseY: 50 + Math.random() * (window.innerHeight - 150),
    });
  }

  function drawPixelCat(cat) {
    const s = cat.scale;
    const frameIdx = Math.floor(cat.frame) % 3;
    const sprite = CAT_SPRITES[frameIdx];

    for (let row = 0; row < SPRITE_H; row++) {
      for (let col = 0; col < SPRITE_W; col++) {
        const pixel = sprite[row][col];
        if (pixel === '.') continue; // transparent

        const drawCol = cat.direction === 1 ? col : (SPRITE_W - 1 - col);

        ctx.fillStyle = pixel === '@' ? cat.color.body : cat.color.white;
        ctx.fillRect(
          Math.floor(cat.x + drawCol * s),
          Math.floor(cat.y + row * s),
          s,
          s
        );
      }
    }
  }

  let lastTime = performance.now();
  const walkSpeed = 150; // pixels per second

  function animate(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cats.forEach(cat => {
      // Horizontal movement
      cat.x += cat.vx * cat.direction * walkSpeed * dt;

      // Bounce off edges
      if (cat.x > window.innerWidth + 40) {
        cat.direction = -1;
        cat.frame = 0;
      }
      if (cat.x < -60) {
        cat.direction = 1;
        cat.frame = 0;
      }

      // Gentle vertical bounce (sine wave)
      cat.y = cat.baseY + Math.sin(now * 0.003 + cat.x * 0.01) * 15;

      // Frame animation
      cat.frameTimer += dt;
      if (cat.frameTimer > 1 / cat.frameSpeed) {
        cat.frameTimer = 0;
        cat.frame = (cat.frame + 1) % 3;
      }

      drawPixelCat(cat);
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // ───── Timer update via storage listener ─────
  function updateTimer() {
    chrome.storage.local.get(['secondsLeft'], (data) => {
      const countdown = document.getElementById('break-countdown');
      if (!countdown) return;
      if (data.secondsLeft !== undefined) {
        const min = Math.floor(data.secondsLeft / 60);
        const sec = data.secondsLeft % 60;
        countdown.textContent = String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
      }
    });
  }

  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);

  // ───── Listen for break-end message ─────
  function removeOverlay() {
    clearInterval(timerInterval);
    ['click','mousedown','mouseup','keydown','keyup','keypress','wheel','touchstart','touchend','touchmove','contextmenu','drag','dragstart','drop','scroll'].forEach(type => {
      document.removeEventListener(type, blockEvent, { capture: true });
    });
    if (overlay.parentNode) overlay.remove();
  }

  chrome.runtime.onMessage.addListener(function listener(msg) {
    if (msg.type === 'breakEnd') {
      removeOverlay();
      chrome.runtime.onMessage.removeListener(listener);
    }
  });

  // Also watch storage for manual removal
  chrome.storage.onChanged.addListener(function storageListener(changes) {
    if (changes.timerState && changes.timerState.newValue !== 'break') {
      removeOverlay();
      chrome.storage.onChanged.removeListener(storageListener);
    }
  });
})();
