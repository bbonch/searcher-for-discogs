'use strict'

import { Component } from 'react'
import { setupPopover } from '../popover-service'

class DSIcon extends Component {
    constructor(props) {
        super(props)

        this.settings = this.props.settings

        this.logoUrl = chrome.runtime.getURL(constants.urls.logo)
    }

    render() {
        return (
            <img className={constants.classes.dsIcon} onClick={(e) => setupPopover(e.target, this.settings)} src={this.logoUrl} />
        )
    }
}

export default DSIcon