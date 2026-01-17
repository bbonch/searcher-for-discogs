import React, { useEffect, useRef } from 'react'

const DSYouTube: (props: DSYouTubeProps) => JSX.Element = ({ settings, dsTitle }) => {
    const youTubeRef: React.RefObject<HTMLDivElement> = useRef(null)

    const onPlayerReady = (e) => {
        if (settings.autoPlayTrack)
            e.target.playVideo();
    }

    useEffect(() => {
        chrome.runtime.sendMessage({
            url: constants.youTube.api.replace("{q}", dsTitle).replace("{key}", settings.apiToken || constants.youTube.key),
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
                            'onReady': onPlayerReady
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