// Packages
const path = require('path');
const fs = require('fs');


// Get all handler files in ./io
const getJS = dir => {
	const contents = fs.readdirSync(dir);
	let jsFiles = contents.filter(file => file.endsWith('.js'));
	let jsPaths = jsFiles.map(file => path.join(dir, file));
	for (const searchFile of contents.filter(file => fs.lstatSync(path.resolve(dir, file)).isDirectory())) {
		jsPaths = [...jsPaths, ...getJS(path.join(dir, searchFile))];
	};
	return jsPaths;
};


// Get handlers from files
let initHandlers = [];
let onConnectHandlers = [];
for (const path of getJS('./io')) {
	const module = require(`./${path.slice(3)}`);
	initHandlers = [...initHandlers, module.init];
	onConnectHandlers = [...onConnectHandlers, module.onConnect];
};

module.exports = {
	init(io) {

	},
	onConnect(io, socket) {

	},
	onDisconnect(io, socket) {

	},
};
