import { genID } from '../hex.mjs';
import createGame from './game.mjs';

export default (name, password) => ({
	name,
	id: genID(),
	players: [],
	password,
	max: 8,
	onclose: null,
	game: null,
	started: false,
	gridSize: 20,

	// init
	ioInit(io) {
		this.io = io;
		this.game = createGame(this.io);
	},


	// sanitization
	sanitized() {
		return {
			name: this.name,
			id: this.id,
			players: this.players.map(player => player.sanitized()),
			password: (this.password) ? true : false,
			gridSize: this.gridSize,
		};
	},

	sanitizedPlayers() {
		return this.players.map(player => player.sanitized());
	},

	// player management
	add(adding) {
		// check for limit
		if (this.players.length >= this.max) return false;

		this.players.push(adding);
		adding.socket.join(this.id);
		this.io.emit('player', adding.username, 'join', this.sanitizedPlayers());

		// init listeners
		adding.socket.on('msg', msg => {
			this.io.emit('msg', msg.slice(0, 64), adding.username);
		});
		adding.socket.on('start', () => {
			if (!adding.isHost) return;
			this.start();
		});
		adding.socket.on('dir', direction => adding.nextDirections.push(direction));
		adding.socket.on('disconnect', () => this.remove(adding));

		return true;
	},

	remove(removing) {
		if (removing.isHost) {
			this.io.emit('err', 'hostleft');
			this.close();
			return;
		}
		this.players = this.players.filter(player => player.id !== removing.id);
		this.game.players = this.game.players.filter(player => player.id !== removing.id);
		this.io.emit('player', removing.username, 'leave', this.sanitizedPlayers());
	},

	// room management
	start() {
		if (this.game.started) return;
		this.game.started = true;
		this.game.players = this.players;

		let n = 3;
		const intervalID = setInterval(() => {
			this.io.emit('countdown', n);
			if (n-- <= 0) {
				clearInterval(intervalID);
				this.game.start();
			}
		}, 1000);
	},

	close() {
		this.io.disconnectSockets();
		this.onclose();
	},
});
