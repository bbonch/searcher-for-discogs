const discogsOptionsMaster = {
    trackTitle: "span.tracklist_track_title",
    trackArtist: ".tracklist_track_artists",
    profileTitle: ".profile #profile_title a",
    videoFrameWidth: 420,
    videoFrameHeight: 300,
    getTrack: function (icon) {
        const prev = $(icon).parent().prev();
        const track = prev.is("span") ? prev : prev.find("span");

        return track;
    },
    getTrackName: function (track) {
        return $(track).html();
    },
    getArtistName: function (icon) {
        const trackArtist = $(icon).parent().parent().find(this.trackArtist);
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
    }
}

const discogsOptionsRelease = {
    trackTitle: "span.trackTitle_CTKp4",
    trackArtist: ".artist_3zAQD",
    profileTitle: ".title_1q3xW a",
    videoFrameWidth: 420,
    videoFrameHeight: 300,
    getTrack: function (icon) {
        const prev = $(icon).parent().prev();
        const track = prev.is("span") ? prev : prev.find("span");

        return track;
    },
    getTrackName: function (track) {
        return $(track).html();
    },
    getArtistName: function (icon) {
        const trackArtist = $(icon).parent().parent().find(this.trackArtist);
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
    }
}

const rymOptions = {
    trackTitle: '.tracklist_title > :first-child',
    profileTitle: ".album_info .artist",
    videoFrameWidth: 420,
    videoFrameHeight: 300,
    getTrack: function (icon) {
        return $(icon).parent().prev();
    },
    getTrackName: function (track) {
        let parts = $(track).text().split('-');
        let trackName = parts.length == 2 ? parts[1].trim() : parts[0].trim();

        return trackName;
    },
    getArtistName: function (icon) {
        const artistNameLink = $(icon).prev().children();
        
        let artistName = $(this.profileTitle).html();
        if (artistNameLink.length == 1 && $(artistNameLink[0]).is('a')) {
            artistName = $(artistNameLink[0]).text().trim();
        }
        artistName = artistName.replace('&amp;', '&').replace(/\(\d*\)/, '');

        return artistName;
    }
};

export default {
    getOptions() {
        if (window.location.href.match(".*discogs\.com/master.*")) {
            return discogsOptionsMaster;
        } else if (window.location.href.match(".*discogs\.com/release.*")) {
            return discogsOptionsRelease;
        } else if (window.location.host.match(".*rateyourmusic.*")) {
            return rymOptions;
        } else {
            return discogsOptionsRelease;
        }
    }
}