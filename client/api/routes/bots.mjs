import { Router } from 'express';
import db from '../db.mjs';
export const router = Router();

// Init table
db.query('CREATE TABLE IF NOT EXISTS bots (id SERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, link TEXT NOT NULL)')
	.catch(err => console.error(err));

router.get('/', async (req, res) => {
	try {
		const dbRes = await db.query('SELECT * FROM bots');
		res.json(dbRes.rows);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});
