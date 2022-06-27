import { sendEvent, sendDimension } from './analytics-service'
import { Popover } from 'bootstrap'
import options from './options';
import DSPopover from '../components/ds-popover'
import React from 'react'
import { createRoot } from 'react-dom/client'

function setupPopover(dsIcon: HTMLImageElement | null, settings: DSSettings) {
    if (dsIcon == null) {
        hideAllPopovers(dsIcon);

        return;
    }

    updateTrackStyle(dsIcon);

    const trackInfo = getTrackInfo(dsIcon);

    sendEvent(constants.ga.events.clicked);
    sendDimension(constants.ga.dimensions.dimension2, trackInfo.artist);
    if (trackInfo.style != null)
        sendDimension(constants.ga.dimensions.dimension4, trackInfo.style);
    sendDimension(constants.ga.dimensions.dimension5, trackInfo.track);

    const popover = Popover.getInstance(dsIcon);
    if (popover != null) {
        popover.toggle();
    } else {
        showPopover(dsIcon, settings, trackInfo.title);
    }

    hideAllPopovers(dsIcon);
}

function getNextIcon(selectedIcon: HTMLImageElement) {
    const nextIcon = getNewIcon(selectedIcon, (parent) => parent.next())

    return nextIcon;
}

function getPrevIcon(selectedIcon: HTMLImageElement) {
    const prevIcon = getNewIcon(selectedIcon, (parent) => parent.prev())

    return prevIcon;
}

function getSearchSourceIcon(searchSource: number): string {
    switch (searchSource) {
        case constants.searchSources.youTube:
            return chrome.runtime.getURL(constants.urls.youTube);
        case constants.searchSources.spotify:
            return chrome.runtime.getURL(constants.urls.spotify);
        case constants.searchSources.deezer:
            return chrome.runtime.getURL(constants.urls.deezer);
    }

    return ''
}

function getNewIcon(selectedIcon: HTMLImageElement, newF: (parent: JQuery<HTMLElement>) => JQuery<HTMLElement>): HTMLImageElement | null {
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

    const newIcon = $(newTrack).parent().find(`.${constants.classes.dsIcon}`).get(0);
    if (newIcon == null)
        return null;

    return newIcon as HTMLImageElement;
}

function showPopover(dsIcon: HTMLImageElement, settings: DSSettings, title: string) {
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

function updateTrackStyle(dsIcon: HTMLImageElement) {
    const track = options.getTrack(dsIcon);
    const selectedTrack = $(`${options.trackTitle}.track-selected`);
    if (track.get(0) == selectedTrack.get(0))
        return;

    selectedTrack.removeClass('track-selected').addClass('track-visited');
    track.removeClass('track-visited').addClass('track-selected');
}

function getTrackInfo(dsIcon: HTMLImageElement): DSTrackInfo {
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

function hideAllPopovers(dsIcon: HTMLImageElement | null) {
    $(`.${constants.classes.dsIcon}`).each((_, element) => {
        if (element == dsIcon)
            return;

        const popover = Popover.getInstance(element);
        if (popover != null) {
            popover.hide();
        }
    });
}

export { setupPopover, getNextIcon, getPrevIcon, getSearchSourceIcon }