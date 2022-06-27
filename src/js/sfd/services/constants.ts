const constants: DSConstants = {
    storageKey: 'settings',
    classes: {
        dsIcon: "click-icon-ds",
        nextBtn: "next-btn",
        prevBtn: "prev-btn"
    },
    searchSources: {
        youTube: 0,
        spotify: 1,
        deezer: 2
    },
    urls: {
        logo: "images/icon48.png",
        eye: "images/eye.png",
        youTube: "images/youtube.png",
        spotify: "images/spotify.png",
        deezer: "images/deezer.png",
        settings: "images/settings.png",
        prev: "images/prev.png",
        next: "images/next.png"
    },
    pages: {
        settings: "html/settings.html"
    },
    ga: {
        id: "UA-50788406-1",
        name: "discogsSearcher",
        events: {
            youTube: "YouTube",
            spotify: "Spotify",
            deezer: "Deezer",
            clicked: "clicked"
        },
        dimensions: {
            dimension2: "dimension2",
            dimension4: "dimension4",
            dimension5: "dimension5"
        }
    },
    youTube: {
        api: "https://www.googleapis.com/youtube/v3/search?part=snippet&q={q}&key={key}",
        key: process.env.YOUTUBE_KEY as string
    },
    spotify: {
        api: {
            token: "https://accounts.spotify.com/api/token",
            search: "https://api.spotify.com/v1/search?type=track&market=US&limit=1&q={q}",
            embed: "https://open.spotify.com/embed?uri={uri}"
        },
        auth: "YTM0YmRmYWY0ZWFiNDBiOTljN2JiYWEzYWFhMTA0NDc6MDhlNmVmNjQ5ZDQxNDM5M2I3MzFkYzE0YmVjZDk3MTU="
    },
    deezer: {
        api: {
            search: "https://api.deezer.com/search/track?q={q}&limit=1",
            embed: "https://www.deezer.com/plugins/player?format=classic&width={width}&height={height}&color=000000&layout=light&size=medium&type=tracks&id={trackId}"
        },
        auth: "frnn1og3OlkyIu2M96IvygSwlZiLlwgpvwJXqJ4HewETYBD2Jf"
    },
    player: {
        width: 420,
        height: 300
    }
}

export default constants