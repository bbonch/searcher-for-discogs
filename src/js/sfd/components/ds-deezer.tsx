import React, { useState, useEffect } from "react"

const DSDeezer: (props: DSDeezerProps) => JSX.Element = ({ dsTitle }) => {
    const [src, setSrc] = useState('')

    useEffect(() => {
        chrome.runtime.sendMessage({
            url: constants.deezer.api.search.replace("{q}", dsTitle),
            type: "GET",
            auth: `Bearer ${constants.deezer.auth}`,
            method: "getQueryResult",
            referrer: window.location.origin
        }, function (r: any) {
            if (r.success) {
                const result = JSON.parse(r.result);
                if (result.data != undefined && result.data[0] != undefined)
                    setSrc(constants.deezer.api.embed
                        .replace("{trackId}", result.data[0].id)
                        .replace("{height}", constants.player.height.toString())
                        .replace("{width}", constants.player.width.toString()));
            } else {
                console.log(r.error);
            }
        });
    }, [dsTitle])

    return <iframe src={src} height={constants.player.height} width={constants.player.width}></iframe>
}

export default DSDeezer