import fs from 'fs';
import path from 'path';

export default function getJS(root) {
	let jsFiles = [];

	for (const file of fs.readdirSync(root)) {
		const fullFilepath = path.join(root, file);
		if (fs.lstatSync(fullFilepath).isDirectory()) {
			jsFiles = [...jsFiles, ...getJS(fullFilepath)];
		} else if (fullFilepath.match(/^.+(?<!\.spec)\.js$/i)) {
			jsFiles.push(fullFilepath);
		}
	}

	return jsFiles;
}
