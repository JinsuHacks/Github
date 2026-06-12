// Run a script on the current tab
function runScript(fn) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: fn
    });
  });
}

// 1. Copy all code blocks
document.getElementById("copyCode").onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["copyCode.js"]
    }, (results) => {
      const text = results[0].result;

      navigator.clipboard.writeText(text).then(() => {
        alert("Copied all code blocks!");
      });
    });
  });
};

// 2. Clean URL
document.getElementById("cleanUrl").onclick = () => {
  runScript(() => {
    const url = new URL(window.location.href);
    url.search = ""; // remove tracking params
    navigator.clipboard.writeText(url.toString());
    alert("Clean URL copied!");
  });
};

// 3. Auto scroll
document.getElementById("autoScroll").onclick = () => {
  runScript(() => {
    let scrolling = setInterval(() => window.scrollBy(0, 2), 10);
    setTimeout(() => clearInterval(scrolling), 15000);
  });
};

// 4. Download all images
document.getElementById("downloadImages").onclick = () => {
  runScript(() => {
    document.querySelectorAll("img").forEach((img, i) => {
      const a = document.createElement("a");
      a.href = img.src;
      a.download = `image_${i}.jpg`;
      a.click();
    });
  });
};
