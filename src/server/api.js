// Packages
const fs = require('fs');
const path = require('path');
const express = require('express');
const { getJS, pathToApiPath } = require('./pathHelpers.js');

// Init
const router = express.Router();


// Register routers in root path if js file contains router
const rootPath = path.resolve(__dirname, './root');
for (const jsFile of getJS(rootPath)) {
	const module = require('./' + path.relative(__dirname, jsFile));
	if (module.router) {
		const apiPath = pathToApiPath(rootPath, jsFile);
		router.use(apiPath, module.router);
	};
};

// Send 404 to all invalid requests to /api
router.use('/*', (req, res) => {
	res.sendStatus(404);
});

module.exports = router;
