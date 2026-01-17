import options from '../utils/options';

export default function usePopover() {
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

    return {
        getSearchSourceIcon,
        getTrackInfo,
        updateTrackStyle
    }
}