// src/content.js
// Listen for copy events in the page and forward the text to background.js

document.addEventListener('copy', event => {
  // Get the copied text
  const text = event.clipboardData.getData('text/plain');
  if (!text) return;

  // Send it to the background script
  chrome.runtime.sendMessage({
    type: 'clipboardCopy',
    text
  });
});
