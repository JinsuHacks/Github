function getActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) {
        return reject(new Error("No active tab found."));
      }
      resolve(tabs[0]);
    });
  });
}

function executeScript(tabId, details) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      { target: { tabId }, ...details },
      (results) => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        resolve(results);
      }
    );
  });
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    alert(successMessage);
  } catch (error) {
    console.error(error);
    alert("Unable to copy text to clipboard.");
  }
}

function getImageExtension(url) {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;
    const rawExt = path.split(".").pop().split(/[#?]/)[0];
    if (rawExt && rawExt.length <= 5) {
      return `.${rawExt}`;
    }
  } catch (error) {
    // ignore invalid URL
  }

  if (url.startsWith("data:image/png")) return ".png";
  if (url.startsWith("data:image/jpeg") || url.startsWith("data:image/jpg")) return ".jpg";
  if (url.startsWith("data:image/gif")) return ".gif";
  return ".jpg";
}

// 1. Copy all code blocks
 document.getElementById("copyCode").onclick = async () => {
  try {
    const tab = await getActiveTab();
    const results = await executeScript(tab.id, { files: ["copyCode.js"] });
    const text = results?.[0]?.result || "";

    if (!text.trim()) {
      return alert("No code blocks were found on this page.");
    }

    await copyText(text, "Copied all code blocks!");
  } catch (error) {
    console.error(error);
    alert("Failed to copy code blocks.");
  }
};

// 2. Clean URL
 document.getElementById("cleanUrl").onclick = async () => {
  try {
    const tab = await getActiveTab();
    const results = await executeScript(tab.id, {
      func: () => {
        const url = new URL(window.location.href);
        url.search = "";
        return url.toString();
      }
    });
    const cleanUrl = results?.[0]?.result || "";

    if (!cleanUrl) {
      return alert("Unable to generate a clean URL.");
    }

    await copyText(cleanUrl, "Clean URL copied!");
  } catch (error) {
    console.error(error);
    alert("Failed to clean the URL.");
  }
};

// 3. Auto scroll
 document.getElementById("autoScroll").onclick = async () => {
  try {
    const tab = await getActiveTab();
    await executeScript(tab.id, {
      func: () => {
        const duration = 15000;
        const startTime = Date.now();
        const step = () => {
          window.scrollBy({ top: 6, left: 0, behavior: "smooth" });
          const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
          if (atBottom || Date.now() - startTime >= duration) {
            return;
          }
          window.requestAnimationFrame(step);
        };
        step();
      }
    });
  } catch (error) {
    console.error(error);
    alert("Auto scroll failed.");
  }
};

// 4. Download all images
 document.getElementById("downloadImages").onclick = async () => {
  try {
    const tab = await getActiveTab();
    const results = await executeScript(tab.id, {
      func: () => {
        const imageUrls = Array.from(document.images)
          .map((img) => img.currentSrc || img.src)
          .filter(Boolean);
        return Array.from(new Set(imageUrls));
      }
    });
    const imageUrls = results?.[0]?.result || [];

    if (!imageUrls.length) {
      return alert("No images found on this page.");
    }

    for (let i = 0; i < imageUrls.length; i += 1) {
      const url = imageUrls[i];
      chrome.downloads.download({
        url,
        filename: `smooth-action-image-${i + 1}${getImageExtension(url)}`,
        conflictAction: "uniquify"
      }, (downloadId) => {
        if (chrome.runtime.lastError) {
          console.warn("Download failed for", url, chrome.runtime.lastError.message);
        }
      });
    }

    alert(`Starting download for ${imageUrls.length} image${imageUrls.length === 1 ? "" : "s"}.`);
  } catch (error) {
    console.error(error);
    alert("Failed to download images.");
  }
};
