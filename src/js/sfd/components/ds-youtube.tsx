import React, { createRef } from 'react'
import { setupPopover } from '../services/popover-service'
import { getNextIcon } from '../services/popover-service'

class DSYouTube extends React.Component<DSYouTubeProps> {
    settings: DSSettings
    dsIcon: HTMLImageElement
    dsTitle: string
    youTubeRef: React.RefObject<HTMLDivElement>

    constructor(props: DSYouTubeProps) {
        super(props)

        this.settings = props.settings
        this.dsIcon = props.dsIcon
        this.dsTitle = props.dsTitle

        this.youTubeRef = createRef()
    }

    onPlayerReady = (event) => {
        if (this.settings.autoPlayTrack)
            event.target.playVideo();
    }

    onPlayerStateChange = (event) => {
        if (event.data == 0) {
            if (!this.settings.autoPlayRelease) return;

            var nextIcon = getNextIcon(this.dsIcon)

            setupPopover(nextIcon, this.settings);
        }
    }

    loadVideo = () => {
        const $this = this;
        chrome.runtime.sendMessage({
            url: constants.youTube.api.replace("{q}", $this.dsTitle).replace("{key}", constants.youTube.key),
            type: "GET",
            method: "getQueryResult",
            referrer: window.location.origin
        }, function (r) {
            if (r.success) {
                const data = JSON.parse(r.result);

                let videoId = null;
                try {
                    for (var i = 0; i < data.items.length; i++) {
                        videoId = data.items[i].id.videoId;
                        if (videoId != null)
                            break;
                    }
                } catch (e) { }

                if (videoId != null) {
                    new YT.Player($this.youTubeRef.current, {
                        height: constants.player.height,
                        width: constants.player.width,
                        videoId: videoId,
                        events: {
                            'onReady': $this.onPlayerReady,
                            'onStateChange': $this.onPlayerStateChange
                        }
                    });
                }
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
            <div ref={this.youTubeRef}></div>
        )
    }
}

export default DSYouTube