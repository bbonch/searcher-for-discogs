declare var chrome: any
declare var constants: DSConstants
declare var ga: any
declare var YT: any

type SettingProps = React.PropsWithChildren<{
    type: string,
    name: string,
    value?: number,
    title: string,
    checked: boolean,
    onChange: (name: string, value: number | boolean | null) => void
}>

type DSIconProps = {
    settings: DSSettings
}

type DSPopoverProps = {
    settings: DSSettings,
    dsIcon: HTMLImageElement,
    dsTitle: string
}

type DSPopoverState = {
    searchSource: number,
    searchSourceIcon: string
}

type DSYouTubeProps = {
    settings: DSSettings,
    dsIcon: HTMLImageElement,
    dsTitle: string
}

type DSSpotifyProps = {
    dsTitle: string
}

type DSSpotifyState = {
    src: string
}

type DSDeezerProps = {
    dsTitle: string
}

type DSDeezerState = {
    src: string
}

interface DSTrackInfo {
    track: string,
    artist: string,
    title: string,
    style: string | null
}

interface DSOptions {
    trackTitle: string,
    trackArtist?: string,
    profileTitle: string,
    getTrack: (icon: HTMLImageElement) => JQuery<HTMLElement>,
    getTrackName: (track: JQuery<HTMLElement>) => string,
    getArtistName: (icon: HTMLImageElement) => string,
    getStyle: () => string | null
}

interface DSSettings {
    defaultSearchSource: number,
    autoPlayTrack: boolean,
    autoPlayRelease: boolean
}

interface DSStorageSettings {
    settings: string | null
}

interface DSConstants {
    storageKey: string;
    classes: {
        dsIcon: string;
        nextBtn: string;
        prevBtn: string;
    };
    searchSources: {
        youTube: number;
        spotify: number;
        deezer: number;
    };
    urls: {
        logo: string;
        eye: string;
        youTube: string;
        spotify: string;
        deezer: string;
        settings: string;
        prev: string;
        next: string;
    };
    pages: {
        settings: string;
    };
    ga: {
        id: string;
        name: string;
        events: {
            youTube: string;
            spotify: string;
            deezer: string;
            clicked: string;
        };
        dimensions: {
            dimension2: string;
            dimension4: string;
            dimension5: string;
        }
    };
    youTube: {
        api: string;
        key: string;
    };
    spotify: {
        api: {
            token: string;
            search: string;
            embed: string;
        };
        auth: string;
    };
    deezer: {
        api: {
            search: string;
            embed: string;
        };
        auth: string;
    };
    player: {
        width: number;
        height: number;
    };
}