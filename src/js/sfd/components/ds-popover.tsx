import React, { useState } from 'react'
import DSYouTube from './ds-youtube'
import DSSpotify from './ds-spotify'
import DSDeezer from './ds-deezer'
import { sendEvent } from '../utils/analytics'
import usePopover from '../hooks/usePopover'

const DSPopover: (props: DSPopoverProps) => JSX.Element = ({ settings, dsIcon, dsTitle }) => {
    const icons: { eye: string; youTube: string; spotify: string; deezer: string; settings: string; prev: string; next: string } = {
        eye: chrome.runtime.getURL(constants.urls.eye),
        youTube: chrome.runtime.getURL(constants.urls.youTube),
        spotify: chrome.runtime.getURL(constants.urls.spotify),
        deezer: chrome.runtime.getURL(constants.urls.deezer),
        settings: chrome.runtime.getURL(constants.urls.settings),
        prev: chrome.runtime.getURL(constants.urls.prev),
        next: chrome.runtime.getURL(constants.urls.next)
    }
    const settingsPage: string = chrome.runtime.getURL(constants.pages.settings)
    let opacity: number = 1

    const { setupPopover, getNextIcon, getPrevIcon, getSearchSourceIcon } = usePopover()

    const [searchSource, setSearchSource] = useState(settings.defaultSearchSource)
    const searchSourceIcon = getSearchSourceIcon(searchSource)

    const changeSearchSource = (searchSource: SearchSource) => {
        setSearchSource(searchSource.value)
        sendEvent(searchSource.title)
    }

    const toggleOpacity = () => {
        opacity = opacity == 1 ? 0.4 : 1;
        $(".popover").css("opacity", opacity);
    }

    const changeTrack = (getNewIcon: (selectedIcon: HTMLImageElement) => HTMLImageElement | null) => {
        const newIcon = getNewIcon(dsIcon);
        setupPopover(newIcon, settings);
    }

    return <>
        <div className={constants.classes.ds}>
            <div className="dropdown social-item">
                <button className="social-item" data-bs-toggle="dropdown">
                    <img src={searchSourceIcon} />
                </button>
                <ul className="dropdown-menu">
                    <li onClick={() => changeSearchSource(constants.searchSources.youTube)}><img alt={constants.searchSources.youTube.title} src={icons.youTube} /></li>
                    <li onClick={() => changeSearchSource(constants.searchSources.spotify)}><img alt={constants.searchSources.spotify.title} src={icons.spotify} /></li>
                    <li onClick={() => changeSearchSource(constants.searchSources.deezer)}><img alt={constants.searchSources.deezer.title} src={icons.deezer} /></li>
                </ul>
            </div>
            <a className="social-item" target="_blank" href={settingsPage}><img className="settings-btn" src={icons.settings} /></a>
            <button onClick={() => changeTrack(getPrevIcon)} className="social-item"><img className="prev-btn" src={icons.prev} /></button>
            <button onClick={() => changeTrack(getNextIcon)} className="social-item"><img className="next-btn" src={icons.next} /></button>
            <button onClick={toggleOpacity} className="social-item"><img src={icons.eye} /></button>
        </div>
        <div style={{ maxHeight: constants.player.height }}>
            {searchSource == constants.searchSources.youTube.value &&
                <div>
                    <DSYouTube settings={settings} dsTitle={dsTitle} dsIcon={dsIcon} />
                </div>
            }
            {searchSource == constants.searchSources.spotify.value &&
                <div>
                    <DSSpotify dsTitle={dsTitle} />
                </div>
            }
            {searchSource == constants.searchSources.deezer.value &&
                <div>
                    <DSDeezer dsTitle={dsTitle} />
                </div>
            }
        </div>
    </>
}

export default DSPopover