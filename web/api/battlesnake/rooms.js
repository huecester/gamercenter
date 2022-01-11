import axios from 'axios';

const getRooms = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const rooms = await axios.get(`${process.env.UPSTASH_API_URL.trim()}/get/battlesnake:rooms`.trim(), {
				headers: {
					'Authorization': `Bearer ${process.env.UPSTASH_API_RO_KEY.trim()}`,
				},
			});
			resolve(JSON.parse(rooms.data.result));
		} catch (err) {
			reject(err);
		}
	});
}

export default async (req, res) => {
	console.log(`${req.method} /battlesnake/rooms`);
	res.setHeader('Allow', 'GET, POST, HEAD, OPTIONS');

	switch (req.method) {
		case 'HEAD':
		case 'OPTIONS':
			return res
				.status(204)
				.end();

		case 'GET':
			try {
				const rooms = await getRooms();
				console.log('Success.');
				res
					.status(200)
					.json(rooms);
			} catch (err) {
				console.log('Error:', err);
				res
					.status('500')
					.end();
			}
			return;

		default:
			console.log('Method not allowed.');
			return res
				.status(405)
				.end();
	}
}

