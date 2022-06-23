import { createRoot } from 'react-dom/client';
import { createRef, Component } from 'react'

class Setting extends Component {
    constructor(props) {
        super(props);

        this.input = createRef();

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        let changedValue = null;
        if (this.props.type == 'radio') {
            changedValue = event.target.value;
        } else if (this.props.type == 'checkbox') {
            changedValue = event.target.checked;
        } else {
            changedValue = event.target.value;
        }
        this.props.onChange(this.props.name, changedValue);
    }

    render() {
        return (
            <div className={'setting setting-' + this.props.type}>
                <input
                    type={this.props.type}
                    name={this.props.name}
                    ref={this.input}
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

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultSearchSource: constants.searchSources.youTube,
            autoPlayTrack: true,
            autoPlayRelease: true
        };

        const thisReact = this;
        chrome.storage.sync.get('settings', function (value) {
            if (value.settings == undefined || value.settings == "") {
                chrome.storage.sync.set({ 'settings': JSON.stringify(thisReact.state) });
            } else {
                const stateCopy = Object.assign(thisReact.state, JSON.parse(value.settings));
                thisReact.setState(stateCopy);
            }
        });
    }

    settingChanged(name, value) {
        let stateCopy = Object.assign({}, this.state);
        stateCopy[name] = value;
        this.setState(stateCopy, function () {
            chrome.storage.sync.set({ 'settings': JSON.stringify(this.state) });
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
                    onChange={(name, value) => this.settingChanged(name, value)}
                >
                    <Setting
                        type='checkbox'
                        name='autoPlayTrack'
                        title='Autoplay track'
                        checked={this.state.autoPlayTrack}
                        onChange={(name, value) => this.settingChanged(name, value)}
                    />
                    <Setting
                        type='checkbox'
                        name='autoPlayRelease'
                        title='Autoplay release'
                        checked={this.state.autoPlayRelease}
                        onChange={(name, value) => this.settingChanged(name, value)}
                    />
                </Setting>
                <Setting
                    type='radio'
                    name='defaultSearchSource'
                    value={constants.searchSources.spotify}
                    title='Spotify'
                    checked={this.state.defaultSearchSource == constants.searchSources.spotify}
                    onChange={(name, value) => this.settingChanged(name, value)}
                />
                <Setting
                    type='radio'
                    name='defaultSearchSource'
                    value={constants.searchSources.deezer}
                    title='Deezer'
                    checked={this.state.defaultSearchSource == constants.searchSources.deezer}
                    onChange={(name, value) => this.settingChanged(name, value)}
                />
            </div>
        );
    }
}

const root = createRoot(document.getElementById('settings'))
root.render(<Settings />)