import { SanitizedRoom } from './sanitizedRoom';

export class Room {
	readonly name;

	constructor(name: string) {
		this.name = name;
	}

	sanitized() {
		return new SanitizedRoom(this);
	}
}
