export const init = () => {
    ga('create', constants.ga.id, 'auto', { 'name': constants.ga.name });
}

export const sendEvent = (event: string) => {
    ga(`${constants.ga.name}.send`, 'event', document.URL, event);
}

export const sendDimension = (dimension: string, value: string) => {
    ga(`${constants.ga.name}.set`, dimension, value);
}