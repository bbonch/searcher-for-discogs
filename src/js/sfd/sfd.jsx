import options from './options.js'
import constants from './constants.js'
import DSIcon from './components/ds-icon.jsx'
import { createRoot } from 'react-dom/client'

ga('create', constants.ga.id, 'auto', { 'name': constants.ga.name });

chrome.storage.sync.get('settings', function (value) {
    const settingsJSON =
    {
        defaultSearchSource: constants.searchSources.youTube,
        autoPlayTrack: true,
        autoPlayRelease: true
    };
    if (value.settings == undefined || value.settings == "") {
        chrome.storage.sync.set({ 'settings': JSON.stringify(settingsJSON) });
    } else {
        Object.assign(settingsJSON, JSON.parse(value.settings));
        if (!Number.isInteger(settingsJSON.defaultSearchSource)) {
            settingsJSON.defaultSearchSource = parseInt(settingsJSON.defaultSearchSource);
        }
    }

    const localOptions = options.getOptions();
    $(localOptions.trackTitle).each((i, element) => {
        const iconDS = document.createElement("span");

        const parent = $(element).parent();
        const attachedTo = parent.is("a") ? parent : $(element);
        attachedTo.after(iconDS);

        const root = createRoot(iconDS)
        root.render(<DSIcon settings={settingsJSON} />)
    });
});