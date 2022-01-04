import client from '../lib/sanity.js';

export default async (req, res) => {
	console.log('GET /posts');
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
		console.log('Success.');
		res.json(posts);
	} catch (err) {
		console.error('Error:', err);
		res.sendStatus(500);
	}
}
