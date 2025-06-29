// src/popup/popup.js
// Logic to render and control the popup UI for Clipboard Team Sync

import {
  clipboardManager,
  teamManagementHandler
} from '../vibesheet_clipboard.js';

// Wait for the DOM to load before querying elements
document.addEventListener('DOMContentLoaded', () => {
  // Initialize display with all clips
  renderClips('all');

  // Set up tab click handlers
  document.querySelectorAll('#tabs button').forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.getAttribute('data-tab');
      renderClips(tab);
    });
  });

  // Set up search input handler
  document.getElementById('search').addEventListener('input', event => {
    const query = event.target.value.toLowerCase();
    filterClips(query);
  });
});

/**
 * Renders the clip list based on the selected tab.
 * @param {'all'|'fav'|'team'} mode
 */
function renderClips(mode) {
  const container = document.getElementById('clipList');
  container.innerHTML = ''; // clear existing

  let clips = clipboardManager.clipboardItems;

  if (mode === 'fav') {
    // TODO: filter only favorites
  } else if (mode === 'team') {
    // TODO: fetch and display team clips via teamManagementHandler
    clips = []; // placeholder
  }

  // TODO: sort clips (newest→oldest) and then display each
  clips.forEach(text => {
    const div = document.createElement('div');
    div.textContent = text;
    container.appendChild(div);
  });
}

/**
 * Filters the current displayed clips by a search query.
 * @param {string} query
 */
function filterClips(query) {
  const items = document.querySelectorAll('#clipList div');
  items.forEach(div => {
    div.style.display = div.textContent.toLowerCase().includes(query)
      ? ''
      : 'none';
  });
}
