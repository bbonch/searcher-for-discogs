import React, { useEffect, useState } from "react"

const DSSpotify: (props: DSSpotifyProps) => JSX.Element = ({ dsTitle }) => {
    const [src, setSrc] = useState('')

    useEffect(() => {
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
                        url: constants.spotify.api.search.replace("{q}", dsTitle),
                        type: "GET",
                        auth: "Bearer " + result.access_token,
                        method: "getQueryResult"
                    }, function (r) {
                        if (r.success) {
                            if (r.result != undefined) {
                                try {
                                    const uri = JSON.parse(r.result).tracks.items[0].uri;
                                    setSrc(constants.spotify.api.embed.replace("{uri}", uri));
                                } catch (e) { }
                            }
                        } else {
                            console.log(r.error);
                        }
                    });
                }
            }
        });
    }, [dsTitle])

    return <iframe src={src} height={constants.player.height} width={constants.player.width}></iframe>
}

export default DSSpotify