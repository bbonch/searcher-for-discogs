function init() {
    ga('create', constants.ga.id, 'auto', { 'name': constants.ga.name });
}

function sendEvent(event: string) {
    ga(`${constants.ga.name}.send`, 'event', document.URL, event);
}

function sendDimension(dimension: string, value: string) {
    ga(`${constants.ga.name}.set`, dimension, value);
}

export { init, sendEvent, sendDimension }