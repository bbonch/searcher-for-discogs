'use-strict'

import { Component } from 'react'
import DSYouTube from './ds-youtube.jsx'
import DSSpotify from './ds-spotify.jsx'
import DSDeezer from './ds-deezer.jsx'
import { sendEvent } from '../analytics-service'
import { setupPopover, getNextIcon, getPrevIcon } from '../popover-service'
import constants from '../constants'

class DSPopover extends Component {
    constructor(props) {
        super(props)

        this.settings = props.settings
        this.dsIcon = props.dsIcon
        this.dsTitle = props.dsTitle
        this.state = { defaultSearchSource: this.settings.defaultSearchSource }

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

    changeSearchSource = (searchSource) => {
        this.setState({
            defaultSearchSource: searchSource
        })
    }

    getSearchSourceUrl = () => {
        if (this.settings) {
            let gaEvent = '';
            let icon = '';
            switch (this.state.defaultSearchSource) {
                case constants.searchSources.youTube:
                    {
                        gaEvent = constants.ga.events.youTube;
                        icon = this.icons.youTube;
                    } break;
                case constants.searchSources.spotify:
                    {
                        gaEvent = constants.ga.events.spotify;
                        icon = this.icons.spotify;
                    } break;
                case constants.searchSources.deezer:
                    {
                        gaEvent = constants.ga.events.deezer;
                        icon = this.icons.deezer;
                    } break;
            }

            sendEvent(gaEvent);

            return icon;
        }
    }

    toggleOpacity = () => {
        this.opacity = this.opacity == 1 ? 0.4 : 1;
        $(".popover").css("opacity", this.opacity);
    }

    changeTrack = (getNewIcon) => {
        const newIcon = getNewIcon(this.dsIcon);

        setupPopover(newIcon, this.settings);
    }

    render() {
        return (
            <>
                <div className="discogs-searcher">
                    <div className="dropdown social-item">
                        <button className="social-item" data-bs-toggle="dropdown">
                            <img src={this.getSearchSourceUrl()} />
                        </button>
                        <ul className="dropdown-menu">
                            <li onClick={() => this.changeSearchSource(constants.searchSources.youTube)}><img src={this.icons.youTube} /></li>
                            <li onClick={() => this.changeSearchSource(constants.searchSources.spotify)}><img src={this.icons.spotify} /></li>
                            <li onClick={() => this.changeSearchSource(constants.searchSources.deezer)}><img src={this.icons.deezer} /></li>
                        </ul>
                    </div>
                    <a className="social-item" target="_blank" href={this.settingsPage}><img className="settings-btn" src={this.icons.settings} /></a>
                    <button onClick={() => this.changeTrack(getPrevIcon)} className="social-item"><img className="prev-btn" src={this.icons.prev} /></button>
                    <button onClick={() => this.changeTrack(getNextIcon)} className="social-item"><img className="next-btn" src={this.icons.next} /></button>
                    <button onClick={this.toggleOpacity} className="social-item"><img src={this.icons.eye} /></button>
                </div>
                <div style={{ maxHeight: constants.player.height }}>
                    {this.state.defaultSearchSource == constants.searchSources.youTube &&
                        <div>
                            <DSYouTube settings={this.settings} dsTitle={this.dsTitle} dsIcon={this.dsIcon} />
                        </div>
                    }
                    {this.state.defaultSearchSource == constants.searchSources.spotify &&
                        <div>
                            <DSSpotify dsTitle={this.dsTitle} />
                        </div>
                    }
                    {this.state.defaultSearchSource == constants.searchSources.deezer &&
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