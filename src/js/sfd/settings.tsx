import { createRoot } from 'react-dom/client';
import React from 'react'
import '../../css/settings.scss'

class Setting extends React.Component<SettingProps> {
    constructor(props: SettingProps) {
        super(props);
    }

    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let changedValue: number | boolean | null = null;
        if (this.props.type == 'radio') {
            changedValue = parseInt(event.target.value);
        } else if (this.props.type == 'checkbox') {
            changedValue = event.target.checked;
        }

        this.props.onChange(this.props.name, changedValue);
    }

    render() {
        return (
            <div className={'setting setting-' + this.props.type}>
                <input
                    type={this.props.type}
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.onChange}
                    checked={this.props.checked}
                />
                <span>{this.props.title}</span>
                <div className='setting-children'>{this.props.children}</div>
            </div>
        );
    }
}

class Settings extends React.Component<{}, DSSettings> {
    constructor(props: {}) {
        super(props);

        this.state = {
            defaultSearchSource: constants.searchSources.youTube,
            autoPlayTrack: true,
            autoPlayRelease: true
        };

        const $this = this;
        chrome.storage.sync.get(constants.storageKey, function (value: DSStorageSettings) {
            if (value.settings == null || value.settings == "") {
                chrome.storage.sync.set({ [constants.storageKey]: JSON.stringify($this.state) });
            } else {
                const stateCopy = Object.assign($this.state, JSON.parse(value.settings));
                $this.setState(stateCopy);
            }
        });
    }

    settingChanged = (name: string, value: number | boolean | null) => {
        if (value == null)
            return;
            
        const stateCopy: DSSettings = Object.assign({}, this.state);
        stateCopy[name] = value;
        this.setState(stateCopy, function () {
            chrome.storage.sync.set({ [constants.storageKey]: JSON.stringify(this.state) });
        });
    }

    render() {
        return (
            <div className='settings'>
                <div className='settings-title'>Default search source</div>
                <Setting
                    type='radio'
                    name='defaultSearchSource'
                    value={constants.searchSources.youTube}
                    title='YouTube'
                    checked={this.state.defaultSearchSource == constants.searchSources.youTube}
                    onChange={this.settingChanged}
                >
                    <Setting
                        type='checkbox'
                        name='autoPlayTrack'
                        title='Autoplay track'
                        checked={this.state.autoPlayTrack}
                        onChange={this.settingChanged}
                    />
                    <Setting
                        type='checkbox'
                        name='autoPlayRelease'
                        title='Autoplay release'
                        checked={this.state.autoPlayRelease}
                        onChange={this.settingChanged}
                    />
                </Setting>
                <Setting
                    type='radio'
                    name='defaultSearchSource'
                    value={constants.searchSources.spotify}
                    title='Spotify'
                    checked={this.state.defaultSearchSource == constants.searchSources.spotify}
                    onChange={this.settingChanged}
                />
                <Setting
                    type='radio'
                    name='defaultSearchSource'
                    value={constants.searchSources.deezer}
                    title='Deezer'
                    checked={this.state.defaultSearchSource == constants.searchSources.deezer}
                    onChange={this.settingChanged}
                />
            </div>
        );
    }
}

const settingsElement = document.getElementById('settings') as HTMLElement
const root = createRoot(settingsElement)
root.render(<Settings />)