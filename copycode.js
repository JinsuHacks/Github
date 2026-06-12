(() => {
  const results = [];

  // Normal <pre> and <code>
  document.querySelectorAll("pre, code").forEach(el => {
    if (el.innerText.trim()) results.push(el.innerText.trim());
  });

  // MDN-specific
  document.querySelectorAll("[class*='language'], [class*='brush'], .notranslate").forEach(el => {
    if (el.innerText.trim()) results.push(el.innerText.trim());
  });

  // Shadow DOM
  document.querySelectorAll("*").forEach(el => {
    if (el.shadowRoot) {
      el.shadowRoot.querySelectorAll("pre, code").forEach(codeEl => {
        if (codeEl.innerText.trim()) results.push(codeEl.innerText.trim());
      });
    }
  });

  return results.join("\n\n");
})();
