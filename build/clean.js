const fs = require('fs-extra');

async function clean(buildType) {
    await fs.remove('searcher');
    if (buildType == 'prod')
        await fs.remove('searcher.zip');
}

module.exports = clean;