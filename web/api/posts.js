import client from '../lib/sanity.js';

const getPosts = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const posts = await client.fetch`*[_type == 'post'] {
	_createdAt,
	title,
	'body': body[] {
		_type == 'block' => @,
		_type == 'image' => @ {
			_key,
			_type,
			'url': asset->url,
		},
	},
}`;
			resolve(posts);
		} catch (err) {
			reject(err);
		}
	});
}

export default async (req, res) => {
	console.log(`${req.method} /posts`);
	res.setHeader('Allow', 'GET, HEAD, OPTIONS');

	switch (req.method) {
		case 'HEAD':
		case 'OPTIONS':
			return res.status(204).end();

		case 'GET':
			try {
				const posts = await getPosts();
				console.log('Success.');
				res.json(posts);
			} catch (err) {
				console.error('Error:', err);
				res
					.status(500)
					.send('Internal Server Error');
			}
			return;

		default:
			console.log('Method not allowed.');
			return res
				.status(405)
				.send('Method Not Allowed');
	}
}
