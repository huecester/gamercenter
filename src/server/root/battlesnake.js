// Packages
const express = require('express');

// Helper functions
const genRandHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
const genID = () => genRandHex(8);


// Rooms
let rooms = [];


// Factories
const initCreateRoom = io => {
	return (name, password) => {
		const id = genID();

		return {
			id,
			timeoutID: null,
			name: name.trim().slice(0, 32),
			password: password?.trim().slice(0, 32) || null,
			io: io.in(id),
			players: [],
			maxPlayers: 8,

			parsedPlayers() {
				return this.players.map(player => player.parsed());
			},

			close() {
				console.log(`Battlesnake: Closing room ${this.id}.`);
				rooms = rooms.filter(room => room.id !== this.id);
			},

			addPlayer(player) {
				console.log(`Battlesnake: ${player.username} [${player.id}] ${player.isHost ? 'host ' : ''}joining room ${this.name} [${this.id}].`);
				player.socket.join(this.id);

				// Register player
				this.players.push(player);
				player.socket.emit('joined', {
					isHost: player.isHost,
					roomName: this.name,
				});

				// Notify players
				this.io.emit('join', {
					player: player.username,
					players: this.parsedPlayers(),
					id: genID(),
				});

				// Event handlers
				// Messages
				player.socket.on('message', message => {
					console.log(`Battlesnake: ${player.username}@${this.name} [${player.id}@${this.id}]: ${message}`);
					this.io.emit('message', {
						author: player.username,
						message: message.trim().slice(0, 256),
						id: genID(),
					});
				});
			},

			removePlayer(target) {
				console.log(`Battlesnake: ${target.username} [${target.id}] ${target.isHost ? 'host ' : ''}leaving room ${this.name} [${this.id}].`);

				// Remove player
				this.players = this.players.filter(player => player.id !== target.id);

				// Leave notification
				this.io.emit('leave', {
					player: target.username,
					players: this.parsedPlayers(),
					id: genID(),
				});

				// Close room if target is host
				if (target.isHost) {
					this.io.emit('close', 'hostleft');
					this.close();
				};
			},
		};
	};
};

let createRoom;

// TODO add statuses
const createPlayer = (username, socket) => {
	return {
		username: username.trim().slice(0, 32),
		socket,
		id: genID(),
		color: `#${genRandHex(6)}`,
		status: 'dead',
		isHost: false,

		parsed() {
			return {
				id: this.id,
				username: this.username,
				color: this.color,
				status: this.status,
				isHost: this.isHost,
			};
		},
	};
};


// API
const router = express.Router();

router.get('/rooms', (req, res) => {
	console.log('Battlesnake: GET /rooms.');
	res.json(rooms.filter(room => room.players.length < room.maxPlayers).map(room => {
		return {
			name: room.name,
			id: room.id,
			password: room.password ? true : false,
			players: room.players.map(player => {
				return {
					username: player.username,
					id: player.id,
				};
			}),
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
	newRoom.timeoutID = setTimeout(() => newRoom.close(), 5000);
	console.log(`Battlesnake: Creating new room ${newRoom.name} with id ${newRoom.id}.`);
	rooms.push(newRoom);
	res.status(201).json({ id: newRoom.id });
});

module.exports = {
	router,
	io: {
		init(io) {
			createRoom = initCreateRoom(io);
		},
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
				} else if (room.players.length >= room.maxPlayers) {
					socket.emit('close', 'roomfull');
					return;
				};

				// Initialize player function (call at bottom)
				const initializePlayer = () => {
					// Create new player
					const newPlayer = createPlayer(data.username, socket);

					// If first player:
					// 		- Set player as host
					// 		- Remove room timeout
					if (room.players.length <= 0) {
						newPlayer.isHost = true;
						clearTimeout(room.timeoutID);
						delete room.timeoutID;
					}

					// Add player to room
					room.addPlayer(newPlayer);

					// Remove player from room
					socket.on('disconnect', () => {
						room?.removePlayer(newPlayer);
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
