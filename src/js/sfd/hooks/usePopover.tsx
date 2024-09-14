import { Popover } from 'bootstrap'
import options from '../utils/options';
import DSPopover from '../components/ds-popover'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { sendEvent, sendDimension } from '../utils/analytics'

export default function usePopover() {
    const setupPopover = (dsIcon: HTMLImageElement | null, settings: DSSettings) => {
        if (dsIcon == null) {
            hideAllPopovers(dsIcon);

            return;
        }

        updateTrackStyle(dsIcon);

        const trackInfo = getTrackInfo(dsIcon);

        const popover = Popover.getInstance(dsIcon);
        if (popover != null) {
            popover.toggle();
        } else {
            sendEvent(constants.ga.events.clicked);
            sendDimension(constants.ga.dimensions.artist, trackInfo.artist);
            if (trackInfo.style != null)
                sendDimension(constants.ga.dimensions.style, trackInfo.style);
            sendDimension(constants.ga.dimensions.track, trackInfo.track);

            showPopover(dsIcon, settings, trackInfo.title);
        }

        hideAllPopovers(dsIcon);
    }

    const getNextIcon = (selectedIcon: HTMLImageElement) => {
        const nextIcon = getNewIcon(selectedIcon, (parent) => parent.next())

        return nextIcon;
    }

    const getPrevIcon = (selectedIcon: HTMLImageElement) => {
        const prevIcon = getNewIcon(selectedIcon, (parent) => parent.prev())

        return prevIcon;
    }

    const getSearchSourceIcon = (searchSource: number): string => {
        switch (searchSource) {
            case constants.searchSources.youTube.value:
                return chrome.runtime.getURL(constants.urls.youTube);
            case constants.searchSources.spotify.value:
                return chrome.runtime.getURL(constants.urls.spotify);
            case constants.searchSources.deezer.value:
                return chrome.runtime.getURL(constants.urls.deezer);
        }

        return ''
    }

    const getNewIcon = (selectedIcon: HTMLImageElement, newF: (parent: JQuery<HTMLElement>) => JQuery<HTMLElement>): HTMLImageElement | null => {
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

    const showPopover = (dsIcon: HTMLImageElement, settings: DSSettings, title: string) => {
        const content = document.createElement("div");
        const popover = new Popover(dsIcon, {
            content: content,
            placement: "right",
            trigger: "manual",
            html: true
        });
        popover.toggle();
        
        const popoverRoot = createRoot(content);
        popoverRoot.render(<DSPopover dsIcon={dsIcon} settings={settings} dsTitle={title} />);
    }

    const updateTrackStyle = (dsIcon: HTMLImageElement) => {
        const track = options.getTrack(dsIcon);
        const selectedTrack = $(`${options.trackTitle}.track-selected`);
        if (track.get(0) == selectedTrack.get(0))
            return;

        selectedTrack.removeClass('track-selected').addClass('track-visited');
        track.removeClass('track-visited').addClass('track-selected');
    }

    const getTrackInfo = (dsIcon: HTMLImageElement): DSTrackInfo => {
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

    const hideAllPopovers = (dsIcon: HTMLImageElement | null) => {
        $(`.${constants.classes.dsIcon}`).each((_, element) => {
            if (element == dsIcon)
                return;

            const popover = Popover.getInstance(element);
            if (popover != null) {
                popover.hide();
            }
        });
    }

    return {
        setupPopover,
        getNextIcon,
        getPrevIcon,
        getSearchSourceIcon
    }
}