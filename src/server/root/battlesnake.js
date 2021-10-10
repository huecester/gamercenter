// Packages
const express = require('express');

// Helper functions
const genRandHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');


// Rooms
const rooms = [];

// Factories
const createRoom = (name, password) => {
	return {
		name,
		password,
		id: genRandHex(16),
		players: [],
	};
};


// API
const router = express.Router();

router.get('/rooms', (req, res) => {
	res.json(rooms.map(room => {
		room.password = room.password ? true : false;
		return room;
	}));
});

router.post('/rooms', (req, res) => {
	console.log('Body:', req.body);
	const { name, password } = req.body;
	if (!name) {
		res.sendStatus(400);
		return;
	}
	const newRoom = createRoom(name, password || null);
	rooms.push(newRoom);
	res.status(201).json({ id: newRoom.id });
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
