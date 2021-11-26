import { Router } from 'express';
import db from '../db.mjs';
export const router = Router();

// Init table
db.query('CREATE TABLE IF NOT EXISTS posts (id SERIAL PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL, creation DATE NOT NULL DEFAULT CURRENT_DATE)')
	.catch(err => console.error(err));

router.get('/', async (req, res) => {
	try {
		const dbRes = await db.query('SELECT * FROM posts');
		res.json(dbRes.rows);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});
