const zipFolder = require('zip-folder');

function zip(buildType) {
    if (buildType == 'prod')
        zipFolder('searcher', 'searcher.zip', function (err) {
            if (err)
                console.log(err);
        });
}

module.exports = zip