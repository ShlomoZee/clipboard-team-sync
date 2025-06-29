// src/options/options.js
// Controls the Settings page: team invites, notification toggles, and shortcut

import { teamManagementHandler } from '../vibesheet_clipboard.js';

document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings from chrome.storage
  chrome.storage.sync.get(
    ['teamMembers', 'teamNotif', 'allNotif', 'shortcut'],
    prefs => {
      // Populate Team Members UI
      (prefs.teamMembers || []).forEach(email => {
        teamManagementHandler.addMember(email);
      });
      renderMembers();

      // Populate notification toggles
      document.getElementById('teamNotif').checked = prefs.teamNotif ?? true;
      document.getElementById('allNotif').checked = prefs.allNotif ?? false;

      // Populate shortcut field
      document.getElementById('shortcut').value = prefs.shortcut || 'Ctrl+Alt+C';
    }
  );

  // Invite button handler
  document.getElementById('inviteBtn').addEventListener('click', () => {
    const emailInput = document.getElementById('newEmail');
    const email = emailInput.value.trim();
    if (email) {
      teamManagementHandler.addMember(email);
      savePreferences();
      renderMembers();
      emailInput.value = '';
    }
  });

  // Notification toggle handlers
  document.getElementById('teamNotif').addEventListener('change', savePreferences);
  document.getElementById('allNotif').addEventListener('change', savePreferences);

  // Shortcut field handler
  document.getElementById('shortcut').addEventListener('change', savePreferences);
});

/**
 * Render the list of team members in the UI.
 */
function renderMembers() {
  const list = document.getElementById('memberList');
  list.innerHTML = '';
  teamManagementHandler.getMembers().forEach(email => {
    const li = document.createElement('li');
    li.textContent = email;
    // You could add a “remove” button here in the future
    list.appendChild(li);
  });
}

/**
 * Save current preferences to chrome.storage.
 */
function savePreferences() {
  const prefs = {
    teamMembers: teamManagementHandler.getMembers(),
    teamNotif: document.getElementById('teamNotif').checked,
    allNotif: document.getElementById('allNotif').checked,
    shortcut: document.getElementById('shortcut').value.trim()
  };

  chrome.storage.sync.set(prefs, () => {
    console.log('Preferences saved:', prefs);
  });
}
