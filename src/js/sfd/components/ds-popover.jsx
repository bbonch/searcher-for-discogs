'use-strict'

import { Component } from 'react'
import { createRoot } from 'react-dom/client'
import options from '../options'
import constants from '../constants'
import DSYouTube from './ds-youtube.jsx'
import DSSpotify from './ds-spotify.jsx'
import DSDeezer from './ds-deezer.jsx'

class DSPopover extends Component {
    constructor(props) {
        super(props)
        this.settings = props.settings
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
        this.localOptions = options.getOptions()
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
                        gaEvent = 'YouTube';
                        icon = this.icons.youTube;
                    } break;
                case constants.searchSources.spotify:
                    {
                        gaEvent = 'Spotify';
                        icon = this.icons.spotify;
                    } break;
                case constants.searchSources.deezer:
                    {
                        gaEvent = 'Deezer';
                        icon = this.icons.deezer;
                    } break;
            }

            ga('discogsSearcher.send', 'event', document.url, gaEvent);

            return icon;
        }
    }

    toggleOpacity = () => {
        this.opacity = this.opacity == 1 ? 0.4 : 1;
        $(".popover").css("opacity", this.opacity);
    }

    prevClicked = () => {
        $(`.${constants.classes.dsIcon}`).popover("destroy");

        var selectedTrack = $(this.localOptions.trackTitle + ".track-selected").get(0);
        var prevTrack = this.getPrevTrack(selectedTrack);
        if (prevTrack == undefined)
            return;
        var icon = this.getIcon(prevTrack);

        this.handleVideo(icon);
    }

    nextClicked = () => {
        $(`.${constants.classes.dsIcon}`).popover("destroy");

        var selectedTrack = $(this.localOptions.trackTitle + ".track-selected").get(0);
        var nextTrack = this.getNextTrack(selectedTrack);
        if (nextTrack == undefined)
            return;
        var icon = this.getIcon(nextTrack);

        this.handleVideo(icon);
    }

    showPopup = (icon, title) => {
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
        var icon = $(track).parent().find(`.${constants.classes.dsIcon}`);

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

    getPrevTrack = (selectedTrack) => {
        var parent = $(selectedTrack).parent();
        var prevTrack = parent.prev().find(this.localOptions.trackTitle).get(0);
        var depth = 0;
        while (prevTrack == null && depth < 5) {
            parent = parent.parent();
            prevTrack = parent.prev().find(this.localOptions.trackTitle).get(0);
            depth++;
        }

        return prevTrack;
    }

    render() {
        return (
            <div className="ds-content">
                <div className="discogs-searcher">
                    <div className="dropdown social-item">
                        <button className="social-item" data-toggle="dropdown">
                            <img src={this.getSearchSourceUrl()} />
                        </button>
                        <ul className="dropdown-menu">
                            <li onClick={() => this.changeSearchSource('youtube')}><img src={this.icons.youTube} /></li>
                            <li onClick={() => this.changeSearchSource('spotify')}><img src={this.icons.spotify} /></li>
                            <li onClick={() => this.changeSearchSource('deezer')}><img src={this.icons.deezer} /></li>
                        </ul>
                    </div>
                    <a className="social-item" target="_blank" href={this.settingsPage}><img className="settings-btn" src={this.icons.settings} /></a>
                    <button onClick={this.prevClicked} className="social-item"><img className="prev-btn" src={this.icons.prev} /></button>
                    <button onClick={this.nextClicked} className="social-item"><img className="next-btn" src={this.icons.next} /></button>
                    <button onClick={this.toggleOpacity} className="social-item"><img src={this.icons.eye} /></button>
                </div>
                <div style={{ maxHeight: this.settings.height }}>
                    {this.state.defaultSearchSource == constants.searchSources.youTube &&
                        <div>
                            <DSYouTube settings={this.settings} />
                        </div>
                    }
                    {this.state.defaultSearchSource == constants.searchSources.spotify &&
                        <div>
                            <DSSpotify settings={this.settings} />
                        </div>
                    }
                    {this.state.defaultSearchSource == constants.searchSources.deezer &&
                        <div>
                            <DSDeezer settings={this.settings} />
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default DSPopover