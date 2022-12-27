import React, { useEffect, useRef } from 'react'
import usePopover from '../hooks/usePopover'

const DSYouTube: (props: DSYouTubeProps) => JSX.Element = ({ settings, dsIcon, dsTitle }) => {
    const youTubeRef: React.RefObject<HTMLDivElement> = useRef(null)

    const { setupPopover, getNextIcon } = usePopover()

    const onPlayerReady = (e) => {
        if (settings.autoPlayTrack)
            e.target.playVideo();
    }

    const onPlayerStateChange = (e) => {
        if (e.data == 0) {
            if (!settings.autoPlayRelease) return;

            var nextIcon = getNextIcon(dsIcon)
            setupPopover(nextIcon, settings);
        }
    }

    useEffect(() => {
        chrome.runtime.sendMessage({
            url: constants.youTube.api.replace("{q}", dsTitle).replace("{key}", constants.youTube.key),
            type: "GET",
            method: "getQueryResult",
            referrer: window.location.origin
        }, function (r: any) {
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
                    new YT.Player(youTubeRef.current, {
                        height: constants.player.height,
                        width: constants.player.width,
                        videoId: videoId,
                        events: {
                            'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange
                        }
                    });
                }
            } else {
                console.log(r.error);
            }
        });
    }, [dsTitle])

    return <div ref={youTubeRef}></div>
}

export default DSYouTube