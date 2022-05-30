const fs = require('fs-extra');
const less = require('less');

var cssDir = 'searcher/css';
var files = [`${cssDir}/sfd`, `${cssDir}/settings`];

async function bundleCSS() {
    var allFiles = await fs.readdir(cssDir);
    for (var i = 0; i < files.length; i++) {
        var v = files[i];
        var input = await fs.readFile(`${v}.less`, { encoding: 'utf8' });
        var output = await less.render(input, { filename: `${v}.less` });
        await fs.outputFile(`${v}.css`, output.css, { encoding: 'utf8' });
    }
    for (var i = 0; i < allFiles.length; i++) {
        await fs.remove(`${cssDir}/${allFiles[i]}`);
    }
}

module.exports = bundleCSS