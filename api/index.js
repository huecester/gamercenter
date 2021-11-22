import express from 'express';
import { join, relative } from 'path';
import { readdirSync, lstatSync } from 'fs';
// Init
const app = express();

// Helper functions
const getMJS = (dir, rel) => {
	let mjsFiles = [];

	for (const file of readdirSync(dir)) {
		const filePath = join(dir, file);
		if (file.endsWith('.mjs')) {
			mjsFiles.push(relative(rel, filePath));
		} else if (lstatSync(filePath).isDirectory()) {
			mjsFiles = [
				...mjsFiles,
				...getMJS(filePath, rel),
			];
		}
	}

	return mjsFiles;
}

// Routes
// Get paths
const rootPath = './api';
const searchDir = './routes';

const filePaths = getMJS(join(rootPath, searchDir), rootPath).map(path => `./${path}`);

const paths = {}
for (const filePath of filePaths) {
	const apiPath = join('/', relative('./routes', filePath.slice(0, -4)));
	paths[apiPath] = filePath;
}

// Register modules
for (const apiPath in paths) {
	(async () => {
		try {
			const module = await import(paths[apiPath]);
			if (module.router) {
				app.use(apiPath, module.router);
			}
		} catch (err) {
			console.error(err);
		}
	})();
}

export default app;
