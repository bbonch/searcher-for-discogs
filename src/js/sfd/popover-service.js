import { sendEvent, sendDimension } from './analytics-service'
import { Popover } from 'bootstrap'
import options from './options';
import DSPopover from './components/ds-popover.jsx'
import { createRoot } from 'react-dom/client'

function setupPopover(dsIcon, settings) {
    if (dsIcon == null) {
        hideAllPopovers(dsIcon);
        return;
    }

    updateTrackStyle(dsIcon);

    const trackInfo = getTrackInfo(dsIcon);

    sendEvent('clicked');
    sendDimension('dimension2', trackInfo.artist);
    if (trackInfo.style != null)
        sendDimension('dimension4', trackInfo.style);
    sendDimension('dimension5', trackInfo.track);

    const popover = Popover.getInstance(dsIcon);
    if (popover != null) {
        popover.toggle();
    } else {
        showPopover(dsIcon, settings, trackInfo.title);
    }

    hideAllPopovers(dsIcon);
}

function getNextIcon(selectedIcon) {
    const nextIcon = getNewIcon(selectedIcon, (parent) => parent.next())

    return nextIcon;
}

function getPrevIcon(selectedIcon) {
    const prevIcon = getNewIcon(selectedIcon, (parent) => parent.prev())

    return prevIcon;
}

function getNewIcon(selectedIcon, newF) {
    const selectedTrack = options.getTrack(selectedIcon);
    let parent = $(selectedTrack).parent();
    let newTrack = newF(parent).find(options.trackTitle).get(0);
    let depth = 0;
    while (newTrack == null && depth < 5) {
        parent = parent.parent();
        newTrack = newF(parent).find(options.trackTitle).get(0);
        depth++;
    }

    if (newTrack == null)
        return null;

    const newIcon = $(newTrack).parent().find(`.${constants.classes.dsIcon}`);

    return newIcon.get(0);
}

function showPopover(dsIcon, settings, title) {
    const content = document.createElement("div");
    const popover = new Popover(dsIcon, {
        content: content,
        placement: "right",
        trigger: "manual",
        html: true
    });
    popover.show();

    const popoverRoot = createRoot(content);
    popoverRoot.render(<DSPopover dsIcon={dsIcon} settings={settings} dsTitle={title} />);
}

function updateTrackStyle(dsIcon) {
    const track = options.getTrack(dsIcon);
    const selectedTrack = $(`${options.trackTitle}.track-selected`);
    if (track.get(0) == selectedTrack.get(0))
        return;

    selectedTrack.removeClass('track-selected').addClass('track-visited');
    track.removeClass('track-visited').addClass('track-selected');
}

function getTrackInfo(dsIcon) {
    const trackElement = options.getTrack(dsIcon);
    const track = options.getTrackName(trackElement);
    const artist = options.getArtistName(dsIcon);
    const title = encodeURIComponent(`${artist} ${track}`.trim());
    const style = options.getStyle();

    return {
        track: track,
        artist: artist,
        title: title,
        style: style
    }
}

function hideAllPopovers(dsIcon) {
    $(`.${constants.classes.dsIcon}`).each((i, element) => {
        if (element == dsIcon)
            return;

        const popover = Popover.getInstance(element);
        if (popover != null) {
            popover.hide();
        }
    });
}

export { setupPopover, getNextIcon, getPrevIcon }