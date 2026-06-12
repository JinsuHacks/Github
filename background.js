chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "openPopup") {
    chrome.action.openPopup();
  }
});
