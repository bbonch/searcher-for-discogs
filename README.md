<div align='center'>
  <img alt='Searcher for Discogs' src='https://github.com/bbonch/searcher-for-discogs/blob/main/src/images/icon.png'/>
</div>

# Searcher for Discogs
Allows to listen to tracks on Discogs by clicking on small icon next to track title. It simply grabs artist and track name on release/master page and shows popup with music/video player from such streaming services as YouTube, Spotify and Deezer.

## Installation

### Chrome Web Store
Install extension directly from [Chrome Web Store](https://chrome.google.com/webstore/detail/searcher-for-discogs/kfaklaicipagejpdmnefheakeoikempa)

#### YouTube quota usage
There is a limit of **80000** clicks for YouTube player per day per **all** users (*It is likely that at the end of day YouTube player stops working because of quota*)

### Build locally
- Clone repository with `git clone https://github.com/bbonch/searcher-for-discogs.git` or download zip
- Change into the new directory
- Run `yarn install`
- Update `.env.example`
    - Remove extension .example so it is simply `.env`
    - [Create](https://rapidapi.com/blog/how-to-get-youtube-api-key) your own YouTube DATA API key
    - Update `.env` with your key
    - YouTube player does not work without key
- Run yarn build-webpack
- Find the `searcher` folder in the directory
- Go to `chrome://extensions` in a new Chrome tab
- Click 'Developer mode' in the upper-right corner
- Click 'Load unpacked' and choose the `searcher` folder
    - If you also have extension from Chrome Web Store disable it
- Reload release/master page

#### YouTube quota usage
There is a limit of **10000** clicks for YouTube player per day per **you**

## Usage

- Go to [Discogs](https://www.discogs.com/master/8585-The-Prodigy-Experience)
- <img src='https://github.com/bbonch/searcher-for-discogs/blob/main/screenshots/1.png' height='300' />
- Click on extension icon next to title 'Jericho'
- <img src='https://github.com/bbonch/searcher-for-discogs/blob/main/screenshots/2.png' height='300' />
- To close popup click on icon again

## UI
To be continued

## Settings
To be continued
