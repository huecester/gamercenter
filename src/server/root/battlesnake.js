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

const createPlayer = (name, socket) => {
	return {
		name,
		socket,
		id: genRandHex(16),
		isHost: false,
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
	const { name, password } = req.body;
	if (!name) {
		res.sendStatus(400);
		return;
	}

	const newRoom = createRoom(name, password || null);
	console.log(`Battlesnake: Creating new room ${newRoom.name} with id ${newRoom.id}`);
	rooms.push(newRoom);
	res.status(201).json({ id: newRoom.id });
});

module.exports = {
	router,
	io: {
		onConnect(io, socket) {
			socket.on('join', data => {
				const room = rooms.find(room => room.id === data.id);
				if (!room) {
					socket.emit('close', 'notfound');
					return;
				} else if (!data.username) {
					socket.emit('close', 'nousername');
					return;
				};

				const newPlayer = createPlayer(data.username, socket);

				// Set to host if first player
				if (room.players.length <= 0) {
					newPlayer.isHost = true;
				}

				newPlayer.socket.join(room.id);
				room.push(newPlayer);
				newPlayer.socket.emit('joined', { host: newPlayer.isHost });


				newPlayer.socket.on('disconnect', () => {
					room.players = room.players.filter(player => player.id !== newPlayer.id);
					if (newPlayer.isHost) {
						io.of(room.id).emit('close', 'hostleft');
					};
				});
			});
		},
	},
};
