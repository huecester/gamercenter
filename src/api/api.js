const fs = require('fs');
const path = require('path');

const router = require('express').Router();

for (const apiName of fs.readdirSync(__dirname).filter(file => !file.endsWith('api.js'))) {
	const apiPath = `/${apiName.slice(0, -3)}`;
	const apiFile = path.resolve(__dirname, apiName);
	router.use(apiPath, require(apiFile));
}

router.use('/*', (req, res) => {
	res.sendStatus(404).end();
});

module.exports = router;
