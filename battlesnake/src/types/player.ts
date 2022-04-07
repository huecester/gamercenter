import { Socket } from 'socket.io';

function randomColor() {
	return '#' + [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

export type Players = Map<string, Player>;

export class Player {
	readonly username: string;
	readonly color: string;

	readonly socket: Socket;

	constructor(username: string, socket: Socket) {
		this.username = username;
		this.color = randomColor();

		this.socket = socket;
	}

	sanitized() {
		return new SanitizedPlayer(this.username, this.color);
	}
}


export class SanitizedPlayer {
	readonly username: string;
	readonly color: string;

	constructor(username: string, color: string) {
		this.username = username;
		this.color = color;
	}
}

export type SanitizedPlayers = {
	[id: string]: SanitizedPlayer,
};
