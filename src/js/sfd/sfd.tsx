import options from './utils/options'
import DSIcon from './components/ds-icon'
import React from 'react'
import { createRoot } from 'react-dom/client'
import '../../css/sfd.scss'
import { getSettings } from './utils/chromeStorage'
import { init } from '../sfd/utils/analytics'

init()

const ATTACHED_MARKER = 'data-ds-attached'

const attachIcons = (settings: DSSettings) => {
    $(options.trackTitle).each((_, element) => {
        if (element.hasAttribute(ATTACHED_MARKER)) return;
        element.setAttribute(ATTACHED_MARKER, '');

        const iconDS = document.createElement("span");

        const parent = $(element).parent();
        const attachedTo = parent.is("a") ? parent : $(element);
        attachedTo.after(iconDS);

        const root = createRoot(iconDS)
        root.render(<DSIcon settings={settings} />)
    });
}

chrome.storage.sync.get(constants.storageKey, function (value: DSStorageSettings) {
    const settings = getSettings(value)

    attachIcons(settings);

    let scheduled = false;
    const observer = new MutationObserver(() => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            scheduled = false;
            attachIcons(settings);
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
});