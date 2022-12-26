let gtag: Gtag.Gtag = () => { }

export const init = () => {
    window.dataLayer = window.dataLayer || [];
    gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', constants.ga.id, {
        'custom_map': {
            'dimension1': 'artist',
            'dimension2': 'style',
            'dimension3': 'track'
        }
    });
}

export const sendEvent = (event: string) => {
    gtag('event', event)
}

export const sendDimension = (dimension: string, value: string) => {
    gtag('event', `${dimension}_dimension`, { [dimension]: value })
}