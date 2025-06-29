// src/options/options.js
// Controls the Settings page: team invites, notification toggles, and shortcut

import {
  auth,
  sendSignInLinkToEmail
} from '../firebase.js';


import { teamManagementHandler } from '../vibesheet_clipboard.js';


// This URL can be any page you control that handles the email-link callback.
// For Chrome Extensions, you can use your extension's hosted Auth handler or a
// simple static page. We'll flesh this out next.
const actionCodeSettings = {
  // Use your Firebase project domain + path:
  url: 'https://clipboard-team-sync.web.app/auth.html',
  handleCodeInApp: true
};




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
document.getElementById('inviteBtn').addEventListener('click', async () => {
  const emailInput = document.getElementById('newEmail');
  const email = emailInput.value.trim();
  if (!email) return alert('Please enter an email.');

  try {
    // Send the magic link
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    alert(`Invite sent to ${email}! Check your inbox.`);
    // Store pending email so we can complete sign-in later
    chrome.storage.sync.set({ pendingEmail: email });
    emailInput.value = '';
  } catch (err) {
    console.error('Error sending invite:', err);
    alert('Failed to send invite. Check console for details.');
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
