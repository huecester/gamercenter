// Packages
const path = require('path');
const fs = require('fs');
const { getJS, pathToApiPath } = require('./pathHelpers.js');


// Get handlers from files
const rootPath = path.resolve(__dirname, './root');
let initHandlers = {};
let onConnectHandlers = {};

for (const jsFile of getJS(rootPath)) {
	const module = require('./' + path.relative(__dirname, jsFile));
	if (module.io) {
		const apiPath = pathToApiPath(rootPath, jsFile);
		if (module.io.init) { initHandlers[apiPath] = module.io.init; };
		if (module.io.onConnect) { onConnectHandlers[apiPath] = module.io.onConnect; };
	};
};

module.exports = {
	init(io) {
		for (const namespace in initHandlers) {
			initHandlers[namespace](io.of(namespace));
		};
	},
	setupOnConnect(io) {
		for (const namespace in onConnectHandlers) {
			const namespacedIO = io.of(namespace);
			namespacedIO.on('connection', socket => {
				try {
					onConnectHandlers[namespace](namespacedIO, socket);
				} catch (err) {
					console.error(err);
					socket.disconnect();
				};
			});
		};
	},
};
