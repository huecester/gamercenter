const path = require('path');
const getJS = require('./getJS.js');

const pathsToApiPaths = (root, dirs) => {
    return dirs.map(file => {
        const parsedFile = path.parse(file);
        delete parsedFile.base;
        delete parsedFile.ext;
        return parsedFile;
    }).map(file => path.join('/', path.relative(root, path.format(file))));
}

const rootDir = './root';
console.log(pathsToApiPaths(rootDir, getJS(rootDir)));