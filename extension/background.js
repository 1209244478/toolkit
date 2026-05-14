// ───── Service Worker for Pomodoro Timer ─────

const STATE_IDLE = 'idle';
const STATE_WORK = 'work';
const STATE_BREAK = 'break';
const STATE_PAUSED = 'paused';

const ALARM_NAME = 'pomodoro-tick';

// ───── Notification ─────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'notify') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: msg.title,
      message: msg.body,
      priority: 2,
    });
  }

  if (msg.type === 'sync') {
    chrome.storage.local.set({
      timerState: msg.timerState,
      secondsLeft: msg.secondsLeft,
      endTime: Date.now() + msg.secondsLeft * 1000,
      workMin: msg.workMin,
      breakMin: msg.breakMin,
      sessions: msg.sessions,
    });

    if (msg.timerState === STATE_WORK || msg.timerState === STATE_BREAK) {
      chrome.alarms.create(ALARM_NAME, { periodInMinutes: 1 / 60 }); // every 1 second
    } else {
      chrome.alarms.clear(ALARM_NAME);
    }
  }

  if (msg.type === 'badge') {
    chrome.action.setBadgeText({ text: msg.text || '' });
    if (msg.color) {
      chrome.action.setBadgeBackgroundColor({ color: msg.color });
    }
  }
});

// ───── Alarm tick ─────
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== ALARM_NAME) return;

  chrome.storage.local.get(['timerState', 'secondsLeft', 'endTime', 'workMin', 'breakMin', 'sessions'], (data) => {
    if (!data.timerState || data.timerState === STATE_IDLE || data.timerState === STATE_PAUSED) {
      chrome.alarms.clear(ALARM_NAME);
      return;
    }

    const now = Date.now();
    let secondsLeft = Math.max(0, Math.ceil((data.endTime - now) / 1000));
    let state = data.timerState;
    let sessions = data.sessions || 0;

    // Update badge
    const min = Math.floor(secondsLeft / 60);
    const color = state === STATE_WORK ? '#c41e3a' : '#1a7f37';
    chrome.action.setBadgeText({ text: String(min) });
    chrome.action.setBadgeBackgroundColor({ color });

    if (secondsLeft <= 0) {
      // Phase switch
      if (state === STATE_WORK) {
        state = STATE_BREAK;
        sessions++;
        secondsLeft = (data.breakMin || 5) * 60;

        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: '番茄钟',
          message: '工作完成！休息一下吧 ☕',
          priority: 2,
        });
      } else {
        state = STATE_WORK;
        secondsLeft = (data.workMin || 25) * 60;

        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: '番茄钟',
          message: '休息结束！开始新的工作周期 🔥',
          priority: 2,
        });
      }

      const newEndTime = now + secondsLeft * 1000;
      chrome.storage.local.set({
        timerState: state,
        secondsLeft,
        endTime: newEndTime,
        sessions,
      });
    }

    // Notify popup if open
    try {
      chrome.runtime.sendMessage({
        type: 'tick',
        secondsLeft,
        endTime: data.endTime,
      }).catch(() => {}); // popup not open, ignore
    } catch(e) {}
  });
});

// ───── Notification click → focus popup ─────
chrome.notifications.onClicked.addListener(() => {
  chrome.action.openPopup();
});
