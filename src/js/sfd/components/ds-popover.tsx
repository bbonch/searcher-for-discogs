import React, { useState } from 'react'
import DSYouTube from './ds-youtube'
import DSSpotify from './ds-spotify'
import DSDeezer from './ds-deezer'
import { sendEvent } from '../utils/analytics'
import usePopover from '../hooks/usePopover'
import { autoUpdate, flip, shift, useFloating, useClick, useDismiss, useInteractions, offset } from '@floating-ui/react'

const DSPopover: (props: DSPopoverProps) => JSX.Element = ({ settings, dsTitle }) => {
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

    const [opacity, setOpacity] = useState<number>(1);
    const [isSourcesDropdownOpen, setIsSourcesDropdownOpen] = useState<boolean>(false);

    const { refs, floatingStyles, context } = useFloating({
        placement: "bottom-start",
        open: isSourcesDropdownOpen,
        onOpenChange: setIsSourcesDropdownOpen,
        middleware: [flip(), shift(), offset(5)],
        whileElementsMounted: autoUpdate
    });
    const click = useClick(context, { event: "mousedown" });
    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions(
        [dismiss, click]
    );

    const { getSearchSourceIcon } = usePopover()

    const [searchSource, setSearchSource] = useState(settings.defaultSearchSource)
    const searchSourceIcon = getSearchSourceIcon(searchSource)

    const changeSearchSource = (searchSource: SearchSource) => {
        setIsSourcesDropdownOpen(false);
        setSearchSource(searchSource.value)
        sendEvent(searchSource.title)
    }

    const toggleOpacity = () => {
        setOpacity((opacity) => { return opacity == 1 ? 0.4 : 1 });
    }

    return <div className='popover' style={{ opacity: opacity }}>
        <div className={constants.classes.ds}>
            <div className="dropdown social-item">
                <button ref={refs.setReference} className="social-item" {...getReferenceProps()}>
                    <img src={searchSourceIcon} />
                </button>
                {isSourcesDropdownOpen && <ul className='dropdown-menu' ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
                    <li onClick={() => changeSearchSource(constants.searchSources.youTube)}><img alt={constants.searchSources.youTube.title} src={icons.youTube} /></li>
                    <li onClick={() => changeSearchSource(constants.searchSources.spotify)}><img alt={constants.searchSources.spotify.title} src={icons.spotify} /></li>
                    <li onClick={() => changeSearchSource(constants.searchSources.deezer)}><img alt={constants.searchSources.deezer.title} src={icons.deezer} /></li>
                </ul>}
            </div>
            <a className="social-item" target="_blank" href={settingsPage}><img className="settings-btn" src={icons.settings} /></a>
            <button onClick={toggleOpacity} className="social-item"><img src={icons.eye} /></button>
        </div>
        <div style={{ maxHeight: constants.player.height }}>
            {searchSource == constants.searchSources.youTube.value &&
                <div>
                    <DSYouTube settings={settings} dsTitle={dsTitle} />
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
    </div>
}

export default DSPopover