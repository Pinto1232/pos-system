// Simple script to clear chatbot-related localStorage for testing
// Run this in browser console to reset chatbot state

console.log('Clearing chatbot-related localStorage...');

// Clear chatbot state
localStorage.removeItem('chatbot_isOpen');
localStorage.removeItem('chatbot_hasVisited');

// Clear selected package
localStorage.removeItem('selectedPackage');

// Clear any chat history
Object.keys(localStorage).forEach((key) => {
  if (key.startsWith('chat_history_')) {
    localStorage.removeItem(key);
    console.log(`Removed: ${key}`);
  }
});

console.log('Chatbot localStorage cleared! Refresh the page to test.');
