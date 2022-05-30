import options from './options.js'
import constants from './constants.js'
import DSIcon from './components/ds-icon.jsx'
import { createRoot } from 'react-dom/client'

const localOptions = options.getOptions();

$(localOptions.trackTitle).toArray().forEach(function (v) {
    let parent = $(v).parent();
    let attachedTo = parent.is("a") ? parent : $(v);
    let iconDS = $("<ds-icon />")
    attachedTo.after(iconDS);
});

ga('create', constants.ga.id, 'auto', { 'name': constants.ga.name });

$("body").on("click", function (e) {
    if ($(e.target).is("." + constants.classes.dsIcon) || $(e.target).is("." + constants.classes.nextBtn) || $(e.target).is("." + constants.classes.prevBtn)) {
        return;
    }

    if ($(e.target).is(".popover") || $(".popover").has(e.target).length != 0) {
        return;
    }

    $(".popover").popover("destroy");
});

chrome.storage.sync.get('settings', function (settings) {
    let settingsJSON =
    {
        defaultSearchSource: constants.searchSources.youTube,
        autoPlayTrack: true,
        autoPlayRelease: true
    };
    if (settings.settings == undefined || settings.settings == "") {
        chrome.storage.sync.set({ 'settings': JSON.stringify(settingsJSON) });
    } else {
        const settingsCopy = Object.assign(settingsJSON, JSON.parse(settings.settings));
        settingsJSON = settingsCopy;
    }

    const tracks = document.querySelectorAll("ds-icon");
    for (let track of tracks) {
        const root = createRoot(track)
        root.render(<DSIcon settings={settingsJSON} />)
    }
});