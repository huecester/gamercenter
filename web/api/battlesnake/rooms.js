import axios from 'axios';

export default async (req, res) => {
	console.log('GET /battlesnake/rooms');

	try {
		const rooms = await axios.get(`${process.env.UPSTASH_API_URL.trim()}/get/battlesnake:rooms`.trim(), {
			headers: {
				'Authorization': `Bearer ${process.env.UPSTASH_API_RO_KEY.trim()}`,
			},
		});
		console.log('Success.');
		res.json(JSON.parse(rooms.data.result));
	} catch (err) {
		console.error('Error:', err);
		res
			.status(500)
			.send('Internal Server Error');
	}
}
