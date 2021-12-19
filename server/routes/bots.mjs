import db from '../db.mjs'
import { Router } from 'express';
export const router = Router();

router.get('/', async (req, res) => {
	try {
		const dbRes = await db.query('SELECT * FROM bots');
		res.json(dbRes.rows);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

