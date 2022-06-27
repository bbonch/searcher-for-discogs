import options from './services/options'
import DSIcon from './components/ds-icon'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { init } from './services/analytics-service'
import '../../css/styles.scss'

init()

chrome.storage.sync.get(constants.storageKey, function (value: DSStorageSettings) {
    const settings: DSSettings =
    {
        defaultSearchSource: constants.searchSources.youTube,
        autoPlayTrack: true,
        autoPlayRelease: true
    };

    if (value.settings == null || value.settings == "") {
        chrome.storage.sync.set({ [constants.storageKey]: JSON.stringify(settings) });
    } else {
        const parsedSettings = JSON.parse(value.settings);
        if (!Number.isInteger(parsedSettings.defaultSearchSource)) {
            parsedSettings.defaultSearchSource = parseInt(parsedSettings.defaultSearchSource);
        }

        Object.assign(settings, parsedSettings);
    }

    $(options.trackTitle).each((_, element) => {
        const iconDS = document.createElement("span");

        const parent = $(element).parent();
        const attachedTo = parent.is("a") ? parent : $(element);
        attachedTo.after(iconDS);

        const root = createRoot(iconDS)
        root.render(<DSIcon settings={settings} />)
    });
});