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
        const $el = $(element);
        const parent = $el.parent();
        const $attachedTo = parent.is("a") ? parent : $el;

        // Choose a meaningful container to mark so we only attach one icon per track.
        const $container = $attachedTo.closest("td[class^='trackTitle'], .chartlist-row, .tracklist_title, tr, li");
        const markerEl = ($container.length ? $container.get(0) : $attachedTo.get(0)) as Element;

        if (markerEl && markerEl.hasAttribute && markerEl.hasAttribute(ATTACHED_MARKER)) return;
        if (markerEl) markerEl.setAttribute(ATTACHED_MARKER, '');

        const iconDS = document.createElement("span");
        $attachedTo.after(iconDS);

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