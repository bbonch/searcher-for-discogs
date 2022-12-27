import React from 'react'
import usePopover from '../hooks/usePopover'

const DSIcon: (props: DSIconProps) => JSX.Element = ({ settings }) => {
    const logoUrl = chrome.runtime.getURL(constants.urls.logo) as string

    const { setupPopover } = usePopover()

    return <img className={constants.classes.dsIcon} onClick={(e) => setupPopover(e.currentTarget, settings)} src={logoUrl} />
}

export default DSIcon