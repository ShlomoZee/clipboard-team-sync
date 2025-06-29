// src/vibesheet_clipboard.js
// Combined VibeSheet logic—code only from your four .js files, with exports at the bottom.



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
    if (text) { // Check if 'text' is not empty
      saveClipboardItem(text);
      syncToServer(text); // Function to sync to the server
    }
  };

  const handlePaste = (event) => {
    const text = clipboardItems.join('\n');
    event.clipboardData.setData('text/plain', text);
    event.preventDefault();
  };

  const saveClipboardItem = (item) => {
    if (clipboardItems.length >= MAX_CLIPBOARD_ITEMS) {
      clipboardItems.shift(); // Remove the oldest item
    }
    clipboardItems.push(item);
    saveToLocalStorage(clipboardItems);
  };

  const loadClipboardItems = () => {
    const storedItems = JSON.parse(localStorage.getItem('clipboardItems')) || [];
    clipboardItems.push(...storedItems);
  };

  const saveToLocalStorage = (items) => {
    localStorage.setItem('clipboardItems', JSON.stringify(items));
  };

  const syncToServer = (text) => {
    fetch('https://your-api-endpoint.com/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Store API tokens securely (e.g., using environment variables) instead of hardcoding them
        'Authorization': `Bearer ${getApiToken()}`
      },
      body: JSON.stringify({ text })
    })
      .then(response => response.json())
      .then(data => console.log('Sync successful:', data))
      .catch(error => console.error('Error syncing clipboard:', error));
  };

  const getApiToken = () => {
    // Here you would securely get your token, this is a placeholder
    return 'YOUR_ACCESS_TOKEN';
  };

  return {
    init
  };
})();

clipboardManager.init();


// ===== clipboardNotificationManager.js contents =====
import { v4 as uuidv4 } from 'uuid'; // Assuming UUID library is available

class ClipboardNotificationManager {
    constructor() {
        this.notifications = [];
        this.notificationLimit = 10; // Example limit
        this.iconUrl = 'icon.png'; // Consider making this dynamic
    }

    // Method to create a notification
    createNotification(clipboardContent) {
        const notification = {
            id: uuidv4(), // Use UUID for unique notification ID
            content: clipboardContent,
            timestamp: new Date().toISOString()
        };

        this.notifications.push(notification);
        this.checkNotificationLimit();
        this.showNotification(notification);
    }

    // Method to display a notification to the user
    showNotification(notification) {
        chrome.notifications.create(notification.id, {
            type: 'basic',
            iconUrl: this.iconUrl,
            title: 'Clipboard Content Synced',
            message: notification.content,
            priority: 2
        }, function(notificationId) {
            console.log('Notification displayed:', notificationId);
        });
    }

    // Method to check notification limit
    checkNotificationLimit() {
        if (this.notifications.length > this.notificationLimit) {
            this.notifications.shift(); // Remove oldest notification
        }
    }

    // Method to clear all notifications
    clearNotifications() {
        this.notifications = [];
        chrome.notifications.getAll((notifications) => {
            for (const notificationId in notifications) {
                chrome.notifications.clear(notificationId);
            }
        });
    }

    // Method to retrieve notifications for display
    getNotifications() {
        return [...this.notifications]; // Return a copy to prevent external modification
    }
}

// Exporting the ClipboardNotificationManager for use in other modules
const clipboardNotificationManager = new ClipboardNotificationManager();
export default clipboardNotificationManager;




// ===== teamManagementHandler.js contents =====
const teamManagementHandler = (() => {
    let teamMembers = [];

    const normalizeMember = (member) => {
        return member.trim().toLowerCase();
    };

    const addMember = (member) => {
        const normalizedMember = normalizeMember(member);
        if (!teamMembers.includes(normalizedMember)) {
            teamMembers.push(normalizedMember);
            notifyTeam();
        }
    };

    const removeMember = (member) => {
        const normalizedMember = normalizeMember(member);
        if (teamMembers.includes(normalizedMember)) {
            teamMembers = teamMembers.filter(m => m !== normalizedMember);
            notifyTeam();
        }
    };

    const getMembers = () => {
        return teamMembers;
    };

    const notifyTeam = () => {
        // Logic to notify all team members about the updated list
        // Replace the console log with actual notification logic
        // For demonstration purposes, we're still logging to console
        console.log("Updated team members:", teamMembers);
        // Potential notification logic goes here (e.g., email, in-app notification)
    };

    return {
        addMember,
        removeMember,
        getMembers
    };
})();

// Example usage
teamManagementHandler.addMember('john.doe@example.com');
teamManagementHandler.addMember('jane.smith@example.com');
console.log(teamManagementHandler.getMembers());
teamManagementHandler.removeMember('john.doe@example.com');
console.log(teamManagementHandler.getMembers());



// ===== userAuthSessionManager.js contents =====
const USER_SESSION_KEY = 'userAuthSession';
const SESSION_EXPIRY_TIME = 3600000; // 1 hour in milliseconds

function saveUserSession(sessionData) {
  const expiryTimestamp = Date.now() + SESSION_EXPIRY_TIME;
  const userSession = {
    ...sessionData,
    expiry: expiryTimestamp,
  };
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userSession));
}

function getUserSession() {
  const sessionData = localStorage.getItem(USER_SESSION_KEY);
  if (sessionData) {
    try {
      const parsedSession = JSON.parse(sessionData);
      if (parsedSession.expiry > Date.now()) {
        return parsedSession;
      }
      clearUserSession();
    } catch (error) {
      console.error('Failed to parse session data:', error);
      clearUserSession();
    }
  }
  return null;
}

function clearUserSession() {
  localStorage.removeItem(USER_SESSION_KEY);
}

function isUserAuthenticated() {
  return getUserSession() !== null;
}

function updateUserSession(sessionData) {
  const existingSession = getUserSession();
  if (existingSession) {
    const updatedSession = {
      ...existingSession,
      ...sessionData,
      expiry: Date.now() + SESSION_EXPIRY_TIME, // Update expiry time to extend the session duration
    };
    saveUserSession(updatedSession);
  }
}




  // Exports from VibeSheet modules
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
