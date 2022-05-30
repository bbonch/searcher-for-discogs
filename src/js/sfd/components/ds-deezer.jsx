'use-strict'

import { Component } from "react"
import constants from "../constants"

class DSDeezer extends Component {
    constructor(props) {
        super(props)
        this.settings = props.settings
        this.state = { src: null }
    }

    loadVideo = () => {
        const $this = this;
        chrome.runtime.sendMessage({
            url: constants.deezer.api.search.replace("{q}", $this.settings.title),
            type: "GET",
            auth: `Bearer ${constants.deezer.auth}`,
            method: "getQueryResult",
            referrer: window.location.origin
        }, function (r) {
            if (r.success) {
                const result = JSON.parse(r.result);
                if (result.data != undefined && result.data[0] != undefined)
                    $this.setState({
                        src: constants.deezer.api.embed
                            .replace("{trackId}", result.data[0].id)
                            .replace("{height}", $this.settings.height)
                            .replace("{width}", $this.settings.width)
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
            <iframe src={this.state.src} height={this.settings.height} width={this.settings.width} frameBorder="0"></iframe>
        )
    }
}

export default DSDeezer