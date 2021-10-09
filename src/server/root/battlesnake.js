// Packages
const express = require('express');

// Mock
const testRooms = [
	{
		name: 'bazinga room',
		id: 'deadbeef',
		players: ['aaa', 'bbb', 'greg'],
		password: 'abc123',
	},
	{
		name: 'bad room',
		id: '123456',
		players: ['one', 'two', 'bob'],
		password: null,
	},
];

// API
const router = express.Router();

router.get('/rooms', (req, res) => {
	res.json(testRooms);
});

module.exports = {
	router,
	io: {
		onConnect(io, socket) {
			console.log('Connect.');
			socket.emit('message', 'Hello, world!');
			socket.on('disconnect', () => {
				console.log('Disconnect.');
			});
		},
	},
};
