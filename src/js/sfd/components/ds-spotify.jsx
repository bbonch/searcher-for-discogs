'use-strict'

import { Component } from "react"
import constants from "../constants"

class DSSpotify extends Component {
    constructor(props) {
        super(props)
        this.settings = props.settings
        this.state = { src: null }
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
        }, function (r) {
            if (r.success) {
                const result = JSON.parse(r.result)
                if (result != undefined && result.access_token != undefined) {
                    chrome.runtime.sendMessage({
                        url: constants.spotify.api.search.replace("{q}", $this.settings.title),
                        type: "GET",
                        auth: "Bearer " + result.access_token,
                        method: "getQueryResult"
                    }, function (r) {
                        if (r.success) {
                            if (r.result != undefined) {
                                var uri = "";
                                try {
                                    uri = JSON.parse(r.result).tracks.items[0].uri;
                                } catch (e) {
                                }

                                if (uri != "") {
                                    $this.setState({ src: constants.spotify.api.embed.replace("{uri}", uri) });
                                }
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
            <iframe src={this.state.src} height={this.settings.height} width={this.settings.width} frameBorder="0"></iframe>
        )
    }
}

export default DSSpotify