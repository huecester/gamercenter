const express = require('express');
const db = require('../db.js');

// Initialize table
db.query('CREATE TABLE IF NOT EXISTS posts (id serial primary key, title text not null, content text not null)')
	.catch(err => console.error(err));

// Create router
const router = express.Router();

router.get('/', async (req, res) => {
	try {
		dbRes = await db.query('SELECT * FROM posts');
		res.json(dbRes.rows);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	};
});

module.exports = router;
