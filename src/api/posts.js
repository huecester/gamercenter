const router = require('express').Router();
const { Client } = require('pg');

// TODO replace mock data

router.get('/', async (req, res) => {
	const client = new Client();
	await client.connect();
	dbRes = await client.query('SELECT * FROM posts');

	res.json(await dbRes.rows);
});

module.exports = router;
