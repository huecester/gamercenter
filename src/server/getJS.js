const path = require('path');
const fs = require('fs');

const getJS = dir => {
    const contents = fs.readdirSync(dir);
    let jsFiles = contents.filter(file => file.endsWith('.js'));
    let jsPaths = jsFiles.map(file => path.join(dir, file));
    for (const searchFile of contents.filter(file => fs.lstatSync(path.resolve(dir, file)).isDirectory())) {
        jsPaths = [...jsPaths, ...getJS(path.join(dir, searchFile))];
    };
    return jsPaths;
};

module.exports = getJS;