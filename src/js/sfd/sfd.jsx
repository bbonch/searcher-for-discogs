import options from './options.js'
import DSIcon from './components/ds-icon.jsx'
import { createRoot } from 'react-dom/client'
import { init } from './analytics-service.js'

init()

chrome.storage.sync.get('settings', function (value) {
    const settings =
    {
        defaultSearchSource: constants.searchSources.youTube,
        autoPlayTrack: true,
        autoPlayRelease: true
    };
    if (value.settings == undefined || value.settings == "") {
        chrome.storage.sync.set({ 'settings': JSON.stringify(settings) });
    } else {
        Object.assign(settings, JSON.parse(value.settings));
        if (!Number.isInteger(settings.defaultSearchSource)) {
            settings.defaultSearchSource = parseInt(settings.defaultSearchSource);
        }
    }

    $(options.trackTitle).each((i, element) => {
        const iconDS = document.createElement("span");

        const parent = $(element).parent();
        const attachedTo = parent.is("a") ? parent : $(element);
        attachedTo.after(iconDS);

        const root = createRoot(iconDS)
        root.render(<DSIcon settings={settings} />)
    });
});