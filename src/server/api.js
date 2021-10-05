const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();

for (const apiName of fs.readdirSync(path.resolve(__dirname, 'api'))) {
	const apiPath = `/${apiName.slice(0, -3)}`;
	const apiFile = `./api/${apiName}`;
	const apiRouter = require(apiFile);

	router.use(apiPath, apiRouter);
};

router.use('/*', (req, res) => {
	res.sendStatus(404);
});

module.exports = router;
