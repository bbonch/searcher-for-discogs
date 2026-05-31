import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { arrow, autoUpdate, flip, FloatingPortal, offset, shift, useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react'
import DSPopover from './ds-popover';
import usePopover from '../hooks/usePopover';

const DSIcon: (props: DSIconProps) => JSX.Element = ({ settings }) => {
    const staticSides = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right",
    } as const;

    const logoUrl = chrome.runtime.getURL(constants.urls.logo) as string;

    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');

    const arrowRef = useRef<HTMLDivElement>(null);

    const { refs, floatingStyles, context, middlewareData, placement } = useFloating({
        placement: "right",
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [offset(10), flip({
            fallbackAxisSideDirection: 'end'
        }), shift(), arrow({
            element: arrowRef
        })],
        whileElementsMounted: autoUpdate
    });
    const click = useClick(context, { event: "mousedown" });
    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([
        click, dismiss
    ]);

    const { getTrackInfo, updateTrackStyle } = usePopover();

    useEffect(() => {
        const trackInfo = getTrackInfo(refs.reference.current as HTMLImageElement)
        setTitle(trackInfo.title)
    }, [refs])

    const onClick = useCallback<React.MouseEventHandler<HTMLImageElement>>((e) => {
        updateTrackStyle(e.currentTarget)
    }, [])

    const getArrowStyle: () => CSSProperties = useCallback(() => {
        const side = placement.split("-")[0] as keyof typeof staticSides;
        const staticSide = staticSides[side];
        const arrowLen = arrowRef.current ? arrowRef.current.offsetWidth : 0;
        const arrowStyle: CSSProperties = {
            left: middlewareData.arrow?.x,
            top: middlewareData.arrow?.y,
            [staticSide]: `${-arrowLen / 2}px`
        }

        switch (placement) {
            case 'right': {
                arrowStyle.borderBottomWidth = '1px'
                arrowStyle.borderLeftWidth = '1px'
            } break
            case 'left': {
                arrowStyle.borderTopWidth = '1px'
                arrowStyle.borderRightWidth = '1px'
            } break
            case 'bottom': {
                arrowStyle.borderTopWidth = '1px'
                arrowStyle.borderLeftWidth = '1px'
            } break
            case 'top': {
                arrowStyle.borderBottomWidth = '1px'
                arrowStyle.borderRightWidth = '1px'
            } break
        }

        return arrowStyle
    }, [middlewareData, placement])

    const newFloatingStyles: CSSProperties = { ...floatingStyles, zIndex: 100 }

    return <>
        <img ref={refs.setReference} {...getReferenceProps({
            onClick: onClick
        })} className={constants.classes.dsIcon} src={logoUrl} />
        {isOpen && <FloatingPortal>
            <div ref={refs.setFloating} style={newFloatingStyles} {...getFloatingProps()}>
                <DSPopover settings={settings} dsTitle={title} />
                <div
                    className='arrow'
                    ref={arrowRef}
                    style={getArrowStyle()}
                />
            </div>
        </FloatingPortal>}
    </>
}

export default DSIcon