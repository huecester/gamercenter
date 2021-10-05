const express = require('express');
const db = require('../db.js');

// Initialize table
db.query('CREATE TABLE IF NOT EXISTS bots (id serial primary key, name text not null, description text not null, link text not null)')
	.catch(err => console.error(err));

// Create router
const router = express.Router();

router.get('/', async (req, res) => {
	try {
		dbRes = await db.query('SELECT * FROM bots');
		res.json(dbRes.rows);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	};
});

module.exports = router;
