import React from 'react'
import { setupPopover } from '../services/popover-service'

class DSIcon extends React.Component<DSIconProps> {
    private logoUrl: string;

    constructor(props: DSIconProps) {
        super(props)

        this.logoUrl = chrome.runtime.getURL(constants.urls.logo)
    }

    render() {
        return (
            <img className={constants.classes.dsIcon} onClick={(e) => setupPopover(e.currentTarget, this.props.settings)} src={this.logoUrl} />
        )
    }
}

export default DSIcon