import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Player, Players, SanitizedPlayers } from './player';
import io from '../io';

export type Rooms = Map<string, Room>;

export interface RoomForm {
	name: string,
	password?: string,
}

export class Room {
	readonly name: string;
	readonly id: string;
	players: Players = new Map();
	readonly password: string | null;

	readonly timeoutID?: NodeJS.Timeout;

	constructor(name: string, id: string, timeoutID: NodeJS.Timeout, password?: string) {
		this.name = name.trim().slice(0, 32);
		this.id = id;
		this.password = password?.length && password?.length > 0 ? password.trim().slice(0, 32) : null;

		this.timeoutID = timeoutID;
	}

	static fromForm(form: RoomForm, id: string, timeoutID: NodeJS.Timeout) {
		return new Room(form.name, id, timeoutID, form.password);
	}

	get sanitizedPlayers() {
		const sanitizedPlayers: SanitizedPlayers = {};
		for (const [id, player] of this.players) {
			sanitizedPlayers[id] = player.sanitized;
		}
		return sanitizedPlayers;
	}

	get sanitized() {
		return new SanitizedRoom(this.name, this.sanitizedPlayers, this.password !== null);
	}

	emitMsg(author: string, msg: string) { io.to(this.id).emit('msg', author, msg.slice(0, 64)); }
	emitJoin(player: string, players: SanitizedPlayers) { io.to(this.id).emit('join', player, players); }
	emitLeave(player: string, players: SanitizedPlayers) { io.to(this.id).emit('leave', player, players); }

	addPlayer(username: string, socket: Socket) {
		// If timeoutID still exists, player is first to join and is host
		let player: Player;
		if (this.timeoutID) {
			clearTimeout(this.timeoutID);
			player = new Player(username, socket, true);
		} else {
			player = new Player(username, socket);
		}

		socket.join(this.id);
		socket.on('msg', (msg: string) => {
			this.emitMsg(player.username, msg.slice(0, 64));
		});

		const id = uuidv4();
		this.players.set(id, player);
		this.emitJoin(player.username, this.sanitizedPlayers);
	}

	removePlayer(id: string) {
		const player = this.players.get(id);
		if (player) {
			const username = player.username;
			this.players.delete(id);
			this.emitLeave(username, this.sanitizedPlayers);
		}
	}
}


export class SanitizedRoom {
	readonly name: string;
	readonly players: SanitizedPlayers;
	readonly password: boolean;

	constructor(name: string, players: SanitizedPlayers, password: boolean) {
		this.name = name;
		this.players = players;
		this.password = password;
	}
}

export type SanitizedRooms = {
	[id: string]: SanitizedRoom,
};
