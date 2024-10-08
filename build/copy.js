const fs = require('fs-extra');

async function copyExtension() {
    await fs.copy('dist', 'searcher/dist');
    await fs.copy('src/images', 'searcher/images');
    await fs.copy('src/html', 'searcher/html');
    await fs.copy('src/js/libs', 'searcher/libs');
    await fs.copy('src/background.js', 'searcher/background.js');
    await fs.copy('src/manifest.json', 'searcher/manifest.json');
}

module.exports = copyExtension;