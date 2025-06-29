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