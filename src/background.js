// src/background.js
// Background service worker for Clipboard Team Sync
// Handles clipboard initialization, context menus, and menu clicks

// Import our combined VibeSheet logic from the module
import {
  clipboardManager,
  clipboardNotificationManager,
  teamManagementHandler
} from './vibesheet_clipboard.js';

// Initialize clipboard listeners as soon as the extension loads
// This sets up copy/paste event handlers and loads stored clips
clipboardManager.init();

// When the extension is installed or updated, set up our context menu entries
chrome.runtime.onInstalled.addListener(() => {
  // Top-level menu to open the clipboard history popup
  chrome.contextMenus.create({
    id: 'showHistory',
    title: 'Clipboard History…',
    contexts: ['all']
  });

  // Sub-menu item to mark a selected clip as favorite
  chrome.contextMenus.create({
    id: 'markFavorite',
    parentId: 'showHistory',
    title: 'Mark as Favorite'
  });

  // Sub-menu item to share the selected text with the team
  chrome.contextMenus.create({
    id: 'shareWithTeam',
    parentId: 'showHistory',
    title: 'Share with Team'
  });
});

// Listen for clicks on our context menu items
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedText = info.selectionText;
  
  switch (info.menuItemId) {
    case 'showHistory':
      // Open the extension popup when "Clipboard History…" is clicked
      chrome.action.openPopup();
      break;

    case 'markFavorite':
      // Add the selected text to favorites
      clipboardManager.saveClipboardItem(selectedText);
      // TODO: Also flag this item as favorite in storage
      break;

    case 'shareWithTeam':
      if (selectedText) {
        // Show a notification to confirm
        clipboardNotificationManager.createNotification(selectedText);
        // TODO: Replace this with your Firebase share logic:
        // teamManagementHandler.shareClipWithTeam(selectedText);
      }
      break;
  }
});
