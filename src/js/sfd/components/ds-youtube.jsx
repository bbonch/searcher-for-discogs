'use-strict'

import { Component, createRef } from 'react'
import options from '../options'
import constants from '../constants'
import DSPopover from './ds-popover.jsx'

class DSYouTube extends Component {
    constructor(props) {
        super(props)
        this.settings = props.settings

        this.youTubeRef = createRef()

        this.localOptions = options.getOptions()
    }

    showPopup = (icon, title) => {
        $(icon).popover("destroy");
        $(icon).popover({
            content: "<ds-popover />",
            placement: "right",
            trigger: "manual",
            html: "true"
        });
        $(icon).popover("show");

        this.settings.title = title;
        const popoverElement = document.querySelector(".popover-content ds-popover");
        const popoverRoot = createRoot(popoverElement);
        popoverRoot.render(<DSPopover settings={this.settings} />);
    }

    handleVideo = (icon) => {
        var track = this.localOptions.getTrack(icon);
        $(`.${constants.classes.dsIcon}`).popover("destroy");
        track.addClass("visited");
        $(this.localOptions.trackTitle).removeClass("track-selected");
        $(this.localOptions.trackTitle).each(function (index, value) {
            if ($(value).hasClass("visited"))
                $(value).addClass("track-visited");
        });
        track.removeClass("track-visited");
        track.addClass("track-selected");

        var trackName = this.localOptions.getTrackName(track);
        var trackArtistName = this.localOptions.getArtistName(icon);
        var title = trackArtistName + " " + trackName.trim();
        title = encodeURIComponent(title.trim());

        this.showPopup(icon, title);
    }

    getIcon = (track) => {
        var icon = $(track).next();
        var parent = $(track).parent();
        var depth = 0;
        while (!icon.hasClass(constants.classes.dsIcon) && depth < 5) {
            icon = $(parent).next();
            parent = $(track).parent();
            depth++;
        }

        return icon;
    }

    getNextTrack = (selectedTrack) => {
        var parent = $(selectedTrack).parent();
        var nextTrack = parent.next().find(this.localOptions.trackTitle).get(0);
        var depth = 0;
        while (nextTrack == null && depth < 5) {
            parent = parent.parent();
            nextTrack = parent.next().find(this.localOptions.trackTitle).get(0);
            depth++;
        }

        return nextTrack;
    }

    onPlayerReady = (event) => {
        if (this.settings.autoPlayTrack)
            event.target.playVideo();
    }

    onPlayerStateChange = (event) => {
        if (event.data == 0) {
            if (!this.settings.autoPlayRelease) return;

            var selectedTrack = $(this.localOptions.trackTitle + ".track-selected").get(0);
            var nextTrack = this.getNextTrack(selectedTrack);
            if (nextTrack == undefined) {
                nextTrack = $(this.localOptions.trackTitle).get(0);
            }
            var nextIcon = this.getIcon(nextTrack);

            this.handleVideo(nextIcon);
        }
    }

    loadVideo = () => {
        const $this = this;
        chrome.runtime.sendMessage({
            url: constants.youTube.api.replace("{q}", $this.settings.title).replace("{key}", constants.youTube.key),
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
                } catch (e) {
                }

                if (videoId != null && videoId != "") {
                    new YT.Player($this.youTubeRef.current, {
                        height: $this.settings.height,
                        width: $this.settings.width,
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