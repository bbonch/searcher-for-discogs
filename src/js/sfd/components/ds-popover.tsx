import React from 'react'
import DSYouTube from './ds-youtube'
import DSSpotify from './ds-spotify'
import DSDeezer from './ds-deezer'
import { sendEvent } from '../services/analytics-service'
import { setupPopover, getNextIcon, getPrevIcon, getSearchSourceIcon } from '../services/popover-service'

class DSPopover extends React.Component<DSPopoverProps, DSPopoverState> {
    private settings: DSSettings
    private dsIcon: HTMLImageElement
    private dsTitle: string
    private icons: { eye: string; youTube: string; spotify: string; deezer: string; settings: string; prev: string; next: string }
    private settingsPage: string
    private opacity: number

    constructor(props: DSPopoverProps) {
        super(props)

        this.settings = props.settings
        this.dsIcon = props.dsIcon
        this.dsTitle = props.dsTitle
        this.state = {
            searchSource: this.settings.defaultSearchSource,
            searchSourceIcon: getSearchSourceIcon(this.settings.defaultSearchSource)
        }

        this.icons = {
            eye: chrome.runtime.getURL(constants.urls.eye),
            youTube: chrome.runtime.getURL(constants.urls.youTube),
            spotify: chrome.runtime.getURL(constants.urls.spotify),
            deezer: chrome.runtime.getURL(constants.urls.deezer),
            settings: chrome.runtime.getURL(constants.urls.settings),
            prev: chrome.runtime.getURL(constants.urls.prev),
            next: chrome.runtime.getURL(constants.urls.next)
        }
        this.settingsPage = chrome.runtime.getURL(constants.pages.settings)
        this.opacity = 1
    }

    changeSearchSource = (searchSource: number, searchSourceIcon: string, searchSourceEvent: string) => {
        this.setState({
            searchSource: searchSource,
            searchSourceIcon: searchSourceIcon
        })

        sendEvent(searchSourceEvent)
    }

    toggleOpacity = () => {
        this.opacity = this.opacity == 1 ? 0.4 : 1;
        $(".popover").css("opacity", this.opacity);
    }

    changeTrack = (getNewIcon: (selectedIcon: HTMLImageElement) => HTMLImageElement | null) => {
        const newIcon = getNewIcon(this.dsIcon);

        setupPopover(newIcon, this.settings);
    }

    render() {
        return (
            <>
                <div className="discogs-searcher">
                    <div className="dropdown social-item">
                        <button className="social-item" data-bs-toggle="dropdown">
                            <img src={this.state.searchSourceIcon} />
                        </button>
                        <ul className="dropdown-menu">
                            <li onClick={() => this.changeSearchSource(constants.searchSources.youTube, this.icons.youTube, constants.ga.events.youTube)}><img src={this.icons.youTube} /></li>
                            <li onClick={() => this.changeSearchSource(constants.searchSources.spotify, this.icons.spotify, constants.ga.events.spotify)}><img src={this.icons.spotify} /></li>
                            <li onClick={() => this.changeSearchSource(constants.searchSources.deezer, this.icons.deezer, constants.ga.events.deezer)}><img src={this.icons.deezer} /></li>
                        </ul>
                    </div>
                    <a className="social-item" target="_blank" href={this.settingsPage}><img className="settings-btn" src={this.icons.settings} /></a>
                    <button onClick={() => this.changeTrack(getPrevIcon)} className="social-item"><img className="prev-btn" src={this.icons.prev} /></button>
                    <button onClick={() => this.changeTrack(getNextIcon)} className="social-item"><img className="next-btn" src={this.icons.next} /></button>
                    <button onClick={this.toggleOpacity} className="social-item"><img src={this.icons.eye} /></button>
                </div>
                <div style={{ maxHeight: constants.player.height }}>
                    {this.state.searchSource == constants.searchSources.youTube &&
                        <div>
                            <DSYouTube settings={this.settings} dsTitle={this.dsTitle} dsIcon={this.dsIcon} />
                        </div>
                    }
                    {this.state.searchSource == constants.searchSources.spotify &&
                        <div>
                            <DSSpotify dsTitle={this.dsTitle} />
                        </div>
                    }
                    {this.state.searchSource == constants.searchSources.deezer &&
                        <div>
                            <DSDeezer dsTitle={this.dsTitle} />
                        </div>
                    }
                </div>
            </>
        )
    }
}

export default DSPopover