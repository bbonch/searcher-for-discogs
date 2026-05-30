# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Chrome extension (Manifest V3) that injects a click-icon next to track titles on Discogs (release/master pages), RateYourMusic, and Last.fm. Clicking the icon opens a popover with a YouTube/Spotify/Deezer player for that track.

## Commands

- `yarn install` — install deps.
- `yarn build-webpack` — dev build: runs webpack (`--mode=development`) then `build/build.js buildType=test`. Output lands in `searcher/` (load this directory as an unpacked extension in `chrome://extensions`).
- `yarn release-webpack` — production build: webpack `--mode=production`, then packaged into `searcher.zip` via `build/zip.js`.
- `yarn test` — Jest (jsdom, ts-jest). Single test: `yarn test tests/sfd.test.tsx -t "<name pattern>"`.
- `yarn test-debug` — Jest with `--inspect-brk --runInBand` for debugging.

A `.env` file with `YOUTUBE_KEY=...` is required for the YouTube player; it's injected at build time via `dotenv-webpack`. Without it the YouTube source silently fails.

## Architecture

### Two-stage build
Webpack only compiles `src/js/sfd/{sfd,settings}.tsx` and the SCSS into `dist/`. The Node script `build/build.js` then:
1. `clean.js` — removes `searcher/` (and `searcher.zip` for prod).
2. `copy.js` — assembles the unpacked extension in `searcher/` by copying `dist/`, `src/images`, `src/html`, `src/js/libs` (vendor JS — `yt.js`, `gtag.js`), `src/background.js`, and `src/manifest.json`.
3. `update-variables.js` — replaces the literal string `VERSION` in `searcher/manifest.json` with `process.env.npm_package_version` (sourced from `package.json`). To bump the extension version, edit `package.json`'s `version` field — the manifest picks it up automatically.
4. `zip.js` — packages for prod builds.

### Content script entry (`src/js/sfd/sfd.tsx`)
Runs on every matched page. Reads settings from `chrome.storage.sync` (key from `constants.storageKey`), then `attachIcons` queries `options.trackTitle`, marks each matched element with `data-ds-attached`, inserts a `<span>` after it (or its `<a>` parent), and mounts a React 18 `DSIcon` root into it. A `MutationObserver` on `document.body` re-runs `attachIcons` on DOM changes, throttled via `requestAnimationFrame` + a `scheduled` flag — Discogs and RYM re-render lists client-side, so re-attaching matters.

### Per-site `options` strategy (`src/js/sfd/utils/options.ts`)
The single biggest source of fragility. A `DSOptions` object is chosen by URL match (discogs master vs. release, RYM, Last.fm) and exported as the default. Each implements the same shape — `trackTitle` selector plus `getTrack`/`getTrackName`/`getArtistName`/`getStyle` — using jQuery against site-specific DOM. Discogs uses hashed CSS class names (e.g. `artist__Aq2S`, `link_PKPcS`) that change when Discogs redeploys; selector breakage on a site is the most common bug class, fixed by updating the corresponding `DSOptions` block, not the React layer.

### Popover (`components/ds-icon.tsx`, `components/ds-popover.tsx`, `hooks/usePopover.tsx`)
Floating UI (`@floating-ui/react`) drives placement: `useFloating` with `offset(10) / flip / shift / arrow` middleware, `useClick` + `useDismiss` interactions, `autoUpdate` for repositioning. Arrow border styles are computed manually per `placement` in `ds-icon.tsx`. `usePopover` reads track/artist/style via the active `DSOptions` and fires GA events. The popover renders one of `ds-youtube`, `ds-spotify`, or `ds-deezer` depending on the user's `defaultSearchSource` setting; prev/next buttons cycle between sources.

Note: the codebase was migrated from Bootstrap popovers to Floating UI (commit `4c5f9ec`). Don't reintroduce `@popperjs/core` or Bootstrap APIs even though `@popperjs/core` is still in `devDependencies`.

### Globals via webpack `ProvidePlugin`
`$` / `jQuery` and `constants` (from `utils/constants.ts`) are provided as globals — referenced without imports throughout the codebase. `chrome`, `constants`, `YT`, `dataLayer` are declared in `src/types.d.ts`. When adding new TS files, you can use these without importing them.

### Settings page
A separate webpack entry `src/js/sfd/settings.tsx` rendered into `src/html/settings.html` (declared as `options_page` in the manifest). Settings persist to `chrome.storage.sync` under `constants.storageKey`; `utils/chromeStorage.ts` is the read/write adapter and applies defaults to missing fields.

### Manifest matches
Content script + CSS run on `*.discogs.com`, `rateyourmusic.com`, `www.last.fm`. Adding a new site means: a new `DSOptions` block, a URL branch in `options.ts`, and entries in both `content_scripts.matches` and `web_accessible_resources.matches` in `manifest.json`.

## Tests

A single Jest file `tests/sfd.test.tsx` exercises the content-script entry. Tests rely on `@testing-library/react` and run under jsdom; ts-jest handles `.tsx`. There is no lint script — ESLint runs as a webpack plugin during builds.
