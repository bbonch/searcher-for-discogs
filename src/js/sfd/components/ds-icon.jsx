'use strict'

import { Component, createRef } from 'react'
import { createRoot } from 'react-dom/client'
import constants from '../constants'
import options from '../options'
import DSPopover from './ds-popover.jsx'
import { Popover } from 'bootstrap'

class DSIcon extends Component {
    constructor(props) {
        super(props)

        this.iconRef = createRef()

        this.logoUrl = chrome.runtime.getURL(constants.urls.logo)
        this.localOptions = options.getOptions()
    }

    handleClick = () => {
        this.updateTrackStyle();

        const trackInfo = this.getTrackInfo();
        this.updateGA(trackInfo);

        const dsIcon = $(this.iconRef.current);
        const popover = Popover.getInstance(dsIcon);
        if (popover != null) {
            popover.toggle();
        } else {
            this.showPopup(trackInfo.title);
        }

        $(`.${constants.classes.dsIcon}`).each((i, element) => {
            if (element == dsIcon.get(0))
                return;

            const popover = Popover.getInstance(element);
            if (popover != null) {
                popover.hide();
            }
        });
    }

    updateTrackStyle = () => {
        const track = this.localOptions.getTrack(this.iconRef.current);
        track.addClass("visited");
        $(this.localOptions.trackTitle).removeClass("track-selected");
        $(this.localOptions.trackTitle).each((i, element) => {
            if ($(element).hasClass("visited"))
                $(element).addClass("track-visited");
        });
        track.removeClass("track-visited");
        track.addClass("track-selected");
    }

    getTrackInfo = () => {
        const track = this.localOptions.getTrack(this.iconRef.current);
        const trackName = this.localOptions.getTrackName(track);
        const trackArtistName = this.localOptions.getArtistName(this.iconRef.current);
        const title = encodeURIComponent(`${trackArtistName} ${trackName}`.trim());

        let style = '';
        try {
            var heads = document.querySelectorAll('.head');
            heads.forEach(function (v) {
                if (v.innerHTML == 'Style:' && v.nextSibling.nextSibling.querySelector('a') != undefined) {
                    style = v.nextSibling.nextSibling.querySelector('a').innerText;
                }
            });
        } catch (e) {
        }

        return {
            trackName: trackName,
            artistName: trackArtistName,
            title: title,
            style: style
        }
    }

    updateGA = (trackInfo) => {
        ga(constants.ga.name + '.send', 'event', document.url, 'clicked');
        ga(`${constants.ga.name}.set`, 'dimension2', trackInfo.trackArtistName);
        if (trackInfo.style != '')
            ga(`${constants.ga.name}.set`, 'dimension4', trackInfo.style);
        ga(`${constants.ga.name}.set`, 'dimension5', trackInfo.trackName);
    }

    showPopup = (title) => {
        const dsIcon = $(this.iconRef.current)
        const content = document.createElement("div");
        const popover = new Popover(dsIcon, {
            content: content,
            placement: "right",
            trigger: "manual",
            html: true
        });
        popover.show();

        const height = this.localOptions.videoFrameHeight;
        const width = this.localOptions.videoFrameWidth;
        const settings = { ...this.props.settings, title: title, height: height, width: width };

        const popoverRoot = createRoot(content);
        popoverRoot.render(<DSPopover settings={settings} />);
    }

    render() {
        return (
            <img ref={this.iconRef} className={constants.classes.dsIcon} onClick={this.handleClick} src={this.logoUrl} />
        )
    }
}

export default DSIcon