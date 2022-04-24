import { Socket } from 'socket.io';

function randomColor() {
	return '#' + [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

export type Players = Map<string, Player>;

export class Player {
	readonly username: string;
	readonly color: string;
	readonly host: boolean;

	readonly socket: Socket;

	constructor(username: string, socket: Socket, host = false) {
		this.username = username;
		this.color = randomColor();
		this.host = host;

		this.socket = socket;
	}

	get sanitized() {
		return new SanitizedPlayer(this.username, this.color, this.host);
	}
}


export class SanitizedPlayer {
	readonly username: string;
	readonly color: string;
	readonly host: boolean;

	constructor(username: string, color: string, host: boolean) {
		this.username = username;
		this.color = color;
		this.host = host;
	}
}

export type SanitizedPlayers = {
	[id: string]: SanitizedPlayer,
};
