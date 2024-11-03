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

    const settingChanged = (name: string, value: number | string | boolean | null) => {
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

        <div className='settings-api-wrapper'>
            <div className='settings-title'>API Key</div>
        
            <input
                type='text'
                className='api-token'
                value={settings.apiToken ?? ''}
                onChange={(event) => {
                    settingChanged('apiToken', event.target.value)
                }}
            />
            

            <details>
                <summary>Why you may need to enter your own API Key</summary>
                There is a usage quote imposed by Google that limits each API Key to 100 searches per day.<br />
                This extension comes with an API Key that is shared among all users.<br />
                If you are experiencing issues with the extension, you may need to enter your own API Key.<br />
                This is a free and simple process that requires a Google account and can be done by following the steps below:<br />
                <a href="https://blog-proxy.rapidapi.com/how-to-get-youtube-api-key/" target="_blank">
                    How to get your own YouTube API key
                </a>
            </details>

        </div>
    </div>;
}

chrome.storage.sync.get(constants.storageKey, function (value: DSStorageSettings) {
    const settings = getSettings(value)

    const settingsElement = document.getElementById('settings') as HTMLElement
    const root = createRoot(settingsElement)
    root.render(<Settings settings={settings} />)
});
