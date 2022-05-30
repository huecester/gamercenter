import { Socket } from 'socket.io';
import { SanitizedPlayer } from './sanitizedPlayer';

export class Player {
	readonly username;
	readonly socket;

	constructor(username: string, socket: Socket) {
		this.username = username;
		this.socket = socket;
	}

	sanitized() {
		return new SanitizedPlayer(this);
	}
}
