import { SanitizedPlayer } from './sanitizedPlayer';

export class Player {
	readonly username;

	constructor(username: string) {
		this.username = username;
	}

	sanitized() {
		return new SanitizedPlayer(this);
	}
}
