const discogsOptionsMaster = {
    trackTitle: "td[class^='trackTitle'] span",
    trackArtist: ".artist_1mUch",
    profileTitle: ".title_1q3xW span a",
    getTrack: function (icon) {
        const prev = $(icon).parent().prev();
        const track = prev.is("span") ? prev : prev.find("span");

        return track;
    },
    getTrackName: function (track) {
        return $(track).html();
    },
    getArtistName: function (icon) {
        const trackArtist = $(icon).parent().parent().parent().find(this.trackArtist);
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

        const style = $(styleXPath.iterateNext()).next().text();

        return style;
    }
}

const discogsOptionsRelease = {
    trackTitle: "span.trackTitle_CTKp4",
    trackArtist: ".artist_3zAQD",
    profileTitle: ".title_1q3xW a",
    getTrack: function (icon) {
        const prev = $(icon).parent().prev();
        const track = prev.is("span") ? prev : prev.find("span");

        return track;
    },
    getTrackName: function (track) {
        return $(track).html();
    },
    getArtistName: function (icon) {
        const trackArtist = $(icon).parent().parent().parent().find(this.trackArtist);
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

        const style = $(styleXPath.iterateNext()).next().text();

        return style;
    }
}

const rymOptions = {
    trackTitle: '.tracklist_title > :first-child',
    profileTitle: ".album_info .artist",
    getTrack: function (icon) {
        return $(icon).parent().prev().find('span');
    },
    getTrackName: function (track) {
        let parts = $(track).text().split('–');
        let trackName = parts.length == 2 ? parts[1].trim() : parts[0].trim();

        return trackName;
    },
    getArtistName: function (icon) {
        const artistNameLink = $(icon).parent().prev().find('a');

        let artistName = $(this.profileTitle).html();
        if (artistNameLink.length > 0) {
            artistName = $(artistNameLink).text().trim();
        }
        artistName = artistName.replace('&amp;', '&').replace(/\(\d*\)/, '');

        return artistName;
    },
    getStyle: function () {
        return $("meta[itemprop='genre']")[0].content;
    }
};

let exportOptions = discogsOptionsRelease
if (window.location.href.match(".*discogs\.com/master.*")) {
    exportOptions = discogsOptionsMaster;
} else if (window.location.href.match(".*discogs\.com/release.*")) {
    exportOptions = discogsOptionsRelease;
} else if (window.location.host.match(".*rateyourmusic.*")) {
    exportOptions = rymOptions;
}

export default exportOptions