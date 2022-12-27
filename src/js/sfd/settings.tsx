import { createRoot } from 'react-dom/client';
import React, { useState } from 'react'
import '../../css/settings.scss'
import { getSettings } from './utils/chromeStorage';

const Setting: (props: SettingProps) => JSX.Element = ({ name, type, onChange, checked, title, value, children }) => {
    return <div className={'setting setting-' + type}>
        <input
            type={type}
            name={name}
            value={value}
            onChange={(event) => {
                let changedValue: number | boolean | null = null;
                if (type == 'radio') {
                    changedValue = parseInt(event.target.value);
                } else if (type == 'checkbox') {
                    changedValue = event.target.checked;
                }

                onChange(name, changedValue);
            }}
            checked={checked}
        />
        <span>{title}</span>
        <div className='setting-children'>{children}</div>
    </div>
}

const Settings: (props: SettingsProps) => JSX.Element = (props) => {
    const [settings, setSettings] = useState<DSSettings>(props.settings)

    const settingChanged = (name: string, value: number | boolean | null) => {
        if (value == null)
            return;

        const settingsCopy = {
            ...settings,
            [name]: value
        };
        setSettings(settingsCopy);
        chrome.storage.sync.set({ [constants.storageKey]: JSON.stringify(settingsCopy) });
    }

    return <div className='settings'>
        <div className='settings-title'>Default search source</div>
        <Setting
            type='radio'
            name='defaultSearchSource'
            value={constants.searchSources.youTube.value}
            title='YouTube'
            checked={settings.defaultSearchSource == constants.searchSources.youTube.value}
            onChange={settingChanged}
        >
            <Setting
                type='checkbox'
                name='autoPlayTrack'
                title='Autoplay track'
                checked={settings.autoPlayTrack}
                onChange={settingChanged}
            />
            <Setting
                type='checkbox'
                name='autoPlayRelease'
                title='Autoplay release'
                checked={settings.autoPlayRelease}
                onChange={settingChanged}
            />
        </Setting>
        <Setting
            type='radio'
            name='defaultSearchSource'
            value={constants.searchSources.spotify.value}
            title='Spotify'
            checked={settings.defaultSearchSource == constants.searchSources.spotify.value}
            onChange={settingChanged}
        />
        <Setting
            type='radio'
            name='defaultSearchSource'
            value={constants.searchSources.deezer.value}
            title='Deezer'
            checked={settings.defaultSearchSource == constants.searchSources.deezer.value}
            onChange={settingChanged}
        />
    </div>;
}

chrome.storage.sync.get(constants.storageKey, function (value: DSStorageSettings) {
    const settings = getSettings(value)

    const settingsElement = document.getElementById('settings') as HTMLElement
    const root = createRoot(settingsElement)
    root.render(<Settings settings={settings} />)
});
