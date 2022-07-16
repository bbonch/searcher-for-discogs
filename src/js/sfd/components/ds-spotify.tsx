import React from "react"

class DSSpotify extends React.Component<DSSpotifyProps, DSSpotifyState> {
    dsTitle: string

    constructor(props: DSSpotifyProps) {
        super(props)

        this.dsTitle = props.dsTitle

        this.state = { src: '' }
    }

    loadVideo = () => {
        const $this = this;
        chrome.runtime.sendMessage({
            url: constants.spotify.api.token,
            type: "POST",
            contentType: "application/x-www-form-urlencoded",
            auth: `Basic ${constants.spotify.auth}`,
            data: 'grant_type=client_credentials',
            method: "getQueryResult",
            referrer: window.location.origin
        }, function (r: any) {
            if (r.success) {
                const result = JSON.parse(r.result)
                if (result != undefined && result.access_token != undefined) {
                    chrome.runtime.sendMessage({
                        url: constants.spotify.api.search.replace("{q}", $this.dsTitle),
                        type: "GET",
                        auth: "Bearer " + result.access_token,
                        method: "getQueryResult"
                    }, function (r) {
                        if (r.success) {
                            if (r.result != undefined) {
                                try {
                                    const uri = JSON.parse(r.result).tracks.items[0].uri;
                                    $this.setState({ src: constants.spotify.api.embed.replace("{uri}", uri) });
                                } catch (e) { }
                            }
                        } else {
                            console.log(r.error);
                        }
                    });
                }
            }
        });
    }

    componentDidMount() {
        this.loadVideo();
    }

    render() {
        return (
            <iframe src={this.state.src} height={constants.player.height} width={constants.player.width} frameBorder="0"></iframe>
        )
    }
}

export default DSSpotify