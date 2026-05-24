const discogsOptionsMaster: DSOptions = {
    trackTitle: "td[class^='trackTitle'] span",
    trackArtist: ".artist__Aq2S",
    profileTitle: "a.link_PKPcS",
    getTrack: function (icon) {
        const prev = $(icon).parent().prev();
        const track = prev.is("span") ? prev : prev.find("span");

        return track;
    },
    getTrackName: function (track) {
        return $(track).html();
    },
    getArtistName: function (this: DSOptions, icon) {
        const trackArtist = $(icon).parent().parent().parent().find(this.trackArtist as string);
        const trackArtistLink = trackArtist.find("a");

        let artistName = '';
        if (trackArtistLink.length > 0) {
            artistName = trackArtistLink.html();
        }
        else {
            artistName = $(this.profileTitle).html();
        }
        artistName = artistName.replace('&amp;', '&').replace(/\(\d*\)/, '');

        return artistName;
    },
    getStyle: function () {
        const styleXPath = document.evaluate("//th[contains(., 'Style')]", document, null, XPathResult.ANY_TYPE, null);
        if (styleXPath == null)
            return null;

        const iterateNextResult = styleXPath.iterateNext();
        if (iterateNextResult == null)
            return null;

        const style = $(iterateNextResult).next().text();

        return style;
    }
}

const discogsOptionsRelease: DSOptions = {
    trackTitle: "span[class^='trackTitle']",
    trackArtist: ".artist_VsG56",
    profileTitle: "a.link_PKPcS",
    getTrack: function (dsIcon) {
        const prev = $(dsIcon).parent().prev();
        const track = prev.is("span") ? prev : prev.find("span");

        return track;
    },
    getTrackName: function (track) {
        return $(track).html();
    },
    getArtistName: function (this: DSOptions, dsIcon) {
        const trackArtist = $(dsIcon).closest("tr").find(this.trackArtist as string);
        const trackArtistLink = trackArtist.find("a");

        let artistName = '';
        if (trackArtistLink.length > 0) {
            artistName = trackArtistLink.html();
        }
        else {
            artistName = $(this.profileTitle).html();
        }
        artistName = artistName.replace('&amp;', '&').replace(/\(\d*\)/, '');

        return artistName;
    },
    getStyle: function () {
        const styleXPath = document.evaluate("//th[contains(., 'Style')]", document, null, XPathResult.ANY_TYPE, null);
        if (styleXPath == null)
            return null;

        const iterateNextResult = styleXPath.iterateNext();
        if (iterateNextResult == null)
            return null;

        const style = $(iterateNextResult).next().text();

        return style;
    }
}

const lastfmOptions: DSOptions = {
    trackTitle: ".chartlist-row:not(:has(.chartlist-play-button)) .chartlist-name a",
    profileTitle: ".header-new-title",
    getTrack: function (dsIcon) {
        return $(dsIcon).parent().prev();
    },
    getTrackName: function (track) {
        return $(track).text().trim();
    },
    getArtistName: function (dsIcon) {
        const rowArtist = $(dsIcon).closest("tr").find(".chartlist-artist a, .chartlist-artist").first();
        const headerCrumb = $(".header-new-crumb").first();

        let artistName = '';
        if (rowArtist.length > 0 && rowArtist.text().trim().length > 0) {
            artistName = rowArtist.text().trim();
        } else if (headerCrumb.length > 0) {
            artistName = headerCrumb.text().trim();
        } else {
            artistName = $(this.profileTitle).text().trim();
        }
        artistName = artistName.replace('&amp;', '&').replace(/\(\d*\)/, '');

        return artistName;
    },
    getStyle: function () {
        return null;
    }
};

const rymOptions: DSOptions = {
    trackTitle: '.tracklist_title > :first-child',
    profileTitle: ".album_info .artist",
    getTrack: function (dsIcon) {
        return $(dsIcon).parent().prev().find('span');
    },
    getTrackName: function (track) {
        let parts = $(track).text().split('–');
        let trackName = parts.length == 2 ? parts[1].trim() : parts[0].trim();

        return trackName;
    },
    getArtistName: function (dsIcon) {
        const artistNameLink = $(dsIcon).parent().prev().find('a');

        let artistName = $(this.profileTitle).html();
        if (artistNameLink.length > 0) {
            artistName = $(artistNameLink).text().trim();
        }
        artistName = artistName.replace('&amp;', '&').replace(/\(\d*\)/, '');

        return artistName;
    },
    getStyle: function () {
        return $("meta[itemprop='genre']")[0].textContent;
    }
};

let exportOptions = discogsOptionsRelease
if (window.location.href.match(".*discogs\.com/master.*")) {
    exportOptions = discogsOptionsMaster;
} else if (window.location.href.match(".*discogs\.com/release.*")) {
    exportOptions = discogsOptionsRelease;
} else if (window.location.host.match(".*rateyourmusic.*")) {
    exportOptions = rymOptions;
} else if (window.location.host.match(".*last\.fm.*")) {
    exportOptions = lastfmOptions;
}

export default exportOptions