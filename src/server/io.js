// Packages
const path = require('path');
const fs = require('fs');
const getJS = require('./getJS.js');


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
