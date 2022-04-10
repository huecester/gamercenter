import { BroadcastOperator, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Player, Players, SanitizedPlayers } from './player';
import { ServerToClientEvents } from '../io';

export type Rooms = Map<string, Room>;

export interface RoomForm {
	name: string,
	password?: string,
}

export class Room {
	readonly name: string;
	players: Players = new Map();
	readonly password: string | null;

	readonly io: BroadcastOperator<ServerToClientEvents, null>;

	constructor(name: string, io: BroadcastOperator<ServerToClientEvents, null>, password?: string) {
		this.name = name.slice(0, 32);
		this.password = password?.length && password?.length > 0 ? password.slice(0, 32) : null;

		this.io = io;
	}

	static fromForm(form: RoomForm, io: BroadcastOperator<ServerToClientEvents, null>) {
		return new Room(form.name, io, form.password);
	}

	sanitizedPlayers() {
		const sanitizedPlayers: SanitizedPlayers = {};
		for (const [id, player] of this.players) {
			sanitizedPlayers[id] = player.sanitized();
		}
		return sanitizedPlayers;
	}

	sanitized() {
		return new SanitizedRoom(this.name, this.sanitizedPlayers(), this.password !== null);
	}

	addPlayer(username: string, socket: Socket) {
		const id = uuidv4();
		const player = new Player(username, socket);

		socket.on('msg', (msg: string) => {
			this.io.emit('msg', player.username, msg.slice(0, 64));
		});

		this.players.set(id, player);
		this.io.emit('join', player.username, this.sanitizedPlayers());
	}

	removePlayer(id: string) {
		const player = this.players.get(id);
		if (player) {
			const username = player.username;
			this.players.delete(id);
			this.io.emit('leave', username, this.sanitizedPlayers());
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
