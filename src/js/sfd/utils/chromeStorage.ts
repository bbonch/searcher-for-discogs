export const getSettings = (value: DSStorageSettings) => {
    const settings: DSSettings = {
        defaultSearchSource: constants.searchSources.youTube.value,
        autoPlayTrack: true,
        autoPlayRelease: true,
        apiToken: constants.youTube.key
    }

    if (value.settings == null || value.settings == "") {
        chrome.storage.sync.set({ [constants.storageKey]: JSON.stringify(settings) })
    } else {
        Object.assign(settings, JSON.parse(value.settings))
    }

    return settings
}