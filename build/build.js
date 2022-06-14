const clean = require('./clean');
const copy = require('./copy');
const updateVariables = require('./update-variables');
const zip = require('./zip');

var args = process.argv.slice(2);
var buildType = getParameter(args, 'buildType');
if (buildType == '') buildType = 'test';

function getParameter(args, key) {
    var value = '';
    args.forEach(function (v, i, a) {
        var keyValue = v.split('=');
        if (keyValue == undefined || keyValue.length < 2)
            return;
        if (key == keyValue[0])
            value = keyValue[1];
    });
    return value;
}

async function build() {
    await clean(buildType);
    await copy();
    await updateVariables();
    zip(buildType);
}

build();