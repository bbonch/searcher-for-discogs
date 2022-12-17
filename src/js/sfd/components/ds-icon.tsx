import React from 'react'
import { setupPopover } from '../hooks/usePopover'

const DSIcon: (props: DSIconProps) => JSX.Element = ({ settings }) => {
    const logoUrl = chrome.runtime.getURL(constants.urls.logo) as string

    return <img className={constants.classes.dsIcon} onClick={(e) => setupPopover(e.currentTarget, settings)} src={logoUrl} />
}

export default DSIcon