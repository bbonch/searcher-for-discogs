function init() {
    ga('create', constants.ga.id, 'auto', { 'name': constants.ga.name });
}

function sendEvent(event) {
    ga(`${constants.ga.name}.send`, 'event', document.url, event);
}

function sendDimension(dimension, value) {
    ga(`${constants.ga.name}.set`, dimension, value);
}

export { init, sendEvent, sendDimension }