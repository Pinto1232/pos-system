# Chatbot Behavior Test Plan

## Test Cases

### 1. Page Load/Refresh Test

**Expected Behavior**: Chatbot should remain closed

- [ ] Open http://localhost:3000
- [ ] Verify chatbot dialog is NOT visible
- [ ] Refresh the page (F5 or Ctrl+R)
- [ ] Verify chatbot dialog is still NOT visible
- [ ] Close and reopen browser tab
- [ ] Verify chatbot dialog is still NOT visible

### 2. Manual Chat Button Test

**Expected Behavior**: Chatbot should open/close when clicking the chat button

- [ ] Click the chat button (blue floating button in bottom-right)
- [ ] Verify chatbot dialog opens
- [ ] Click the close button (X) in the chatbot dialog
- [ ] Verify chatbot dialog closes
- [ ] Click the chat button again
- [ ] Verify chatbot dialog opens again

### 3. Package Selection Test

**Expected Behavior**: Chatbot should open when user selects a package

- [ ] Ensure chatbot is closed
- [ ] Click on any package card (Starter, Growth, Premium, Enterprise, Custom)
- [ ] Verify chatbot dialog opens automatically
- [ ] Verify chatbot shows package-specific information
- [ ] Close the chatbot
- [ ] Select a different package
- [ ] Verify chatbot opens again with new package info

### 4. Package Selection + Page Refresh Test

**Expected Behavior**: After selecting a package and refreshing, chatbot should
stay closed

- [ ] Select any package (chatbot should open)
- [ ] Close the chatbot manually
- [ ] Refresh the page
- [ ] Verify chatbot remains closed (even though package is still selected)
- [ ] Verify the selected package is still highlighted/remembered

### 5. Clear Storage Test

**Expected Behavior**: Clean slate behavior

- [ ] Open browser console (F12)
- [ ] Run the clear storage script:

```javascript
localStorage.removeItem('chatbot_isOpen')
localStorage.removeItem('chatbot_hasVisited')
localStorage.removeItem('selectedPackage')
Object.keys(localStorage).forEach((key) => {
  if (key.startsWith('chat_history_')) {
    localStorage.removeItem(key)
  }
})
```

- [ ] Refresh the page
- [ ] Verify chatbot is closed
- [ ] Verify no package is selected

## Success Criteria

✅ **PASS**: Chatbot does NOT auto-open on page load/refresh ✅ **PASS**:
Chatbot opens when clicking chat button ✅ **PASS**: Chatbot opens when
selecting a package manually ✅ **PASS**: Chatbot stays closed on refresh even
with saved package ✅ **PASS**: All existing chat functionality works normally

## Notes

- The fix uses an `isInitialLoad` flag that starts as `true` and becomes `false`
  after 1 second
- This prevents auto-opening during the initial package loading from
  localStorage
- Manual package selections (after initial load) still trigger chatbot opening
- All other chatbot functionality remains unchanged
