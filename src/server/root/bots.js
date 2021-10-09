const express = require('express');
const db = require('../db.js');

// Initialize table
db.query('CREATE TABLE IF NOT EXISTS bots (id SERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, link TEXT NOT NULL)')
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

module.exports = {
    router,
};