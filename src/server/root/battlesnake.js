// Packages
const express = require('express');

// Helper functions
const genRandHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');


// Rooms
let rooms = [];

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
		socket,
		id: genRandHex(16),
		color: `#${genRandHex(6)}`,
		isHost: false,
	};
};

// Helpers
const parsedPlayer = player => {
	return {
		username: player.username,
		id: player.id,
		color: player.color,
		isHost: player.isHost,
	};
};

// API
const router = express.Router();

router.get('/rooms', (req, res) => {
	console.log('Battlesnake: GET /rooms');
	res.json(rooms.map(room => {
		return {
			...room,
			password: room.password ? true : false,
			players: room.players.map(player => player.username),
		};
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
				// Disconnect if room does not exist
				const room = rooms.find(room => room.id === data.id);
				if (!room) {
					socket.emit('close', 'notfound');
					return;
				} else if (!data.username) {
					socket.emit('close', 'nousername');
					return;
				};

				// Initialize player function (call at bottom)
				const initializePlayer = () => {
					// Create new player
					const newPlayer = createPlayer(data.username, socket);

					// Set to host if first player
					if (room.players.length <= 0) {
						newPlayer.isHost = true;
					}

					// Add player to room
					console.log(`Battlesnake: ${newPlayer.username} [${newPlayer.id}] isHost ${newPlayer.isHost} joining room ${room.id}.`);
					socket.join(room.id);
					room.players.push(newPlayer);
					socket.emit('joined', {
						isHost: newPlayer.isHost,
						players: room.players.map(player => parsedPlayer(player)),
					});

					// Join notification
					io.in(room.id).emit('join', {
						player: newPlayer.username,
						players: room.players.map(player => parsedPlayer(player)),
					});


					// Messages
					socket.on('message', message => {
						console.log(`Battlesnake: ${newPlayer.username} [${room.id}]: ${message}`);
						io.in(room.id).emit('message', {
							author: newPlayer.username,
							message: message.slice(0, Math.max(message.length, 256)),
						});
					});

					socket.on('disconnect', () => {
						console.log(`Battlesnake: ${newPlayer.username} [${newPlayer.id}] isHost ${newPlayer.isHost} leaving room ${room.id}.`);
						room.players = room.players.filter(player => player.id !== newPlayer.id);

						// Leave notification
						io.in(room.id).emit('leave', {
							player: newPlayer.username,
							players: room.players.map(player => parsedPlayer(player)),
						});

						// Close room if leaving player is host
						if (newPlayer.isHost) {
							console.log(`Battlesnake: Closing room ${room.id}.`);
							io.in(room.id).emit('close', 'hostleft');
							rooms = rooms.filter(existingRoom => existingRoom.id !== room.id);
						};
					});
				};

				// Ask for password if needed before initializing player
				if (room.password) {
					socket.emit('password');
					socket.on('password', password => {
						password === room.password ? initializePlayer() : socket.emit('close', 'wrongpassword');
					});
				} else {
					initializePlayer();
				};
			});
		},
	},
};
