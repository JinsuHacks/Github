// Create the floating button
const btn = document.createElement("div");
btn.id = "smoothactions-btn";
btn.innerText = "Hereio";
document.body.appendChild(btn);

// Open the action menu when clicked
btn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "openPopup" });
});
