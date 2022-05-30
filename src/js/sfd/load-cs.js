(async () => {
    const src = chrome.runtime.getURL('js/sfd.js');
    await import(src);
})();