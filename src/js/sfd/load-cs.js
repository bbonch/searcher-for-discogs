(async () => {
    const src = chrome.runtime.getURL('dist/sfd.js');
    await import(src);
})();