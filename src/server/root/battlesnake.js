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

const createPlayer = (username, socket) => {
	return {
		username,
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
		room.players = room.players.map(player => player.username);
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

				socket.join(room.id);
				room.players.push(newPlayer);
				socket.emit('joined', {
					isHost: newPlayer.isHost,
					players: room.players.map(player => {
						delete player.socket;
						return player;
					}),
				});

				io.in(room.id).emit('join', {
					player: newPlayer.username,
					players: room.players.map(player => {
						delete player.socket;
						return player;
					}),
				});

				socket.on('disconnect', () => {
					room.players = room.players.filter(player => player.id !== newPlayer.id);
					io.in(room.id).emit('leave', {
						player: newPlayer.username,
						players: room.players.map(player => {
							delete player.socket;
							return player;
						}),
					});
					if (newPlayer.isHost) {
						io.in(room.id).emit('close', 'hostleft');
					};
				});
			});
		},
	},
};
