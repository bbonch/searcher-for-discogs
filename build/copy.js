const fs = require('fs-extra');

async function copy() {
    await fs.copy('src', 'searcher');
}

module.exports = copy;