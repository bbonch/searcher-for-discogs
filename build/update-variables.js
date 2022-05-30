const fs = require('fs-extra');

async function updateVariables() {
    var manifest = await fs.readFile('searcher/manifest.json', 'utf8');
    var manifest = manifest.replace(/VERSION/g, process.env.npm_package_version);
    await fs.writeFile('searcher/manifest.json', manifest, 'utf8');
}

module.exports = updateVariables;