// src/vibesheet_clipboard.js — combined VibeSheet logic

// ===== clipboardManager.js contents =====
const clipboardManager = (() => {
  const clipboardItems = [];
  const MAX_CLIPBOARD_ITEMS = 50; // Limit to the last N items

  const init = () => {
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    loadClipboardItems();
  };

  const handleCopy = (event) => {
    const text = event.clipboardData.getData('text');
    if (text) { // only proceed if there’s text
      saveClipboardItem(text);
      syncToServer(text); // placeholder for real-time team sync
    }
  };

  const handlePaste = (event) => {
    const text = clipboardItems.join('\n');
    event.clipboardData.setData('text/plain', text);
    event.preventDefault();
  };

  const saveClipboardItem = (item) => {
    if (clipboardItems.length >= MAX_CLIPBOARD_ITEMS) {
      clipboardItems.shift(); // drop the oldest
    }
    clipboardItems.push(item);
    saveToLocalStorage(clipboardItems);
  };

  const loadClipboardItems = () => {
    const stored = JSON.parse(localStorage.getItem('clipboardItems')) || [];
    clipboardItems.push(...stored);
  };

  const saveToLocalStorage = (items) => {
    localStorage.setItem('clipboardItems', JSON.stringify(items));
  };

  const syncToServer = (text) => {
    // TODO: replace with real Firebase/Firestore integration
    fetch('https://your-api-endpoint.com/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getApiToken()}`
      },
      body: JSON.stringify({ text })
    })
      .then(res => res.json())
      .then(data => console.log('Server sync successful:', data))
      .catch(err => console.error('Server sync error:', err));
  };

  const getApiToken = () => {
    // TODO: secure your token properly; this is a placeholder
    return 'YOUR_ACCESS_TOKEN';
  };

  return {
    init,
    // expose save/load if needed elsewhere
    saveClipboardItem,
    loadClipboardItems,
    clipboardItems
  };
})();

// ===== clipboardNotificationManager.js contents =====
import { v4 as uuidv4 } from 'uuid'; // ensure your build supports ES modules

class ClipboardNotificationManager {
  constructor() {
    this.notifications = [];
    this.notificationLimit = 10;
    this.iconUrl = 'icon.png'; // update path as needed
  }

  createNotification(content) {
    const notification = {
      id: uuidv4(),
      content,
      timestamp: new Date().toISOString()
    };
    this.notifications.push(notification);
    this._enforceLimit();
    this.showNotification(notification);
  }

  showNotification({ id, content }) {
    chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: this.iconUrl,
      title: 'Clipboard Shared',
      message: content,
      priority: 2
    }, notificationId => {
      console.log('Displayed notification:', notificationId);
    });
  }

  _enforceLimit() {
    if (this.notifications.length > this.notificationLimit) {
      this.notifications.shift();
    }
  }

  clearNotifications() {
    this.notifications = [];
    chrome.notifications.getAll(all => {
      for (let id in all) {
        chrome.notifications.clear(id);
      }
    });
  }

  getNotifications() {
    return [...this.notifications];
  }
}

const clipboardNotificationManager = new ClipboardNotificationManager();

// ===== teamManagementHandler.js contents =====
const teamManagementHandler = (() => {
  let teamMembers = [];

  const normalize = email => email.trim().toLowerCase();

  const addMember = email => {
    const e = normalize(email);
    if (!teamMembers.includes(e)) {
      teamMembers.push(e);
      // TODO: persist to Firestore / notify backend
    }
  };

  const removeMember = email => {
    const e = normalize(email);
    teamMembers = teamMembers.filter(m => m !== e);
    // TODO: persist change
  };

  const getMembers = () => [...teamMembers];

  // ——— New methods below ———

  /** Replace the entire member list with a fresh array */
  const setMembers = (membersArray) => {
    teamMembers = membersArray.map(normalize);
  };

  /** Clear out all members */
  const clearMembers = () => {
    teamMembers = [];
  };

  return {
    addMember,
    removeMember,
    getMembers,
    setMembers,
    clearMembers
  };
})();


// ===== userAuthSessionManager.js contents =====
const USER_SESSION_KEY = 'userAuthSession';
const SESSION_EXPIRY_MS = 3600000; // 1 hour

function saveUserSession(sessionData) {
  const expiry = Date.now() + SESSION_EXPIRY_MS;
  const payload = { ...sessionData, expiry };
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(payload));
}

function getUserSession() {
  const raw = localStorage.getItem(USER_SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw);
    if (session.expiry > Date.now()) return session;
    clearUserSession();
  } catch (err) {
    console.error('Invalid session data:', err);
    clearUserSession();
  }
  return null;
}

function clearUserSession() {
  localStorage.removeItem(USER_SESSION_KEY);
}

function isUserAuthenticated() {
  return getUserSession() !== null;
}

function updateUserSession(data) {
  const existing = getUserSession();
  if (existing) {
    const updated = { ...existing, ...data, expiry: Date.now() + SESSION_EXPIRY_MS };
    saveUserSession(updated);
  }
}

// ===== Exports from VibeSheet modules =====
export { clipboardManager };
export { clipboardNotificationManager };
export { teamManagementHandler };
export {
  saveUserSession,
  getUserSession,
  clearUserSession,
  isUserAuthenticated,
  updateUserSession
};
