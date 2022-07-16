import React from "react"

class DSDeezer extends React.Component<DSDeezerProps, DSDeezerState> {
    dsTitle: string

    constructor(props: DSDeezerProps) {
        super(props)

        this.dsTitle = props.dsTitle

        this.state = { src: '' }
    }

    loadVideo = () => {
        const $this = this;
        chrome.runtime.sendMessage({
            url: constants.deezer.api.search.replace("{q}", $this.dsTitle),
            type: "GET",
            auth: `Bearer ${constants.deezer.auth}`,
            method: "getQueryResult",
            referrer: window.location.origin
        }, function (r: any) {
            if (r.success) {
                const result = JSON.parse(r.result);
                if (result.data != undefined && result.data[0] != undefined)
                    $this.setState({
                        src: constants.deezer.api.embed
                            .replace("{trackId}", result.data[0].id)
                            .replace("{height}", constants.player.height.toString())
                            .replace("{width}", constants.player.width.toString())
                    });
            } else {
                console.log(r.error);
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

export default DSDeezer