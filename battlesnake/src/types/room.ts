import { SanitizedRoom } from './sanitizedRoom';

export class Room {
	readonly name;

	constructor(name: string) {
		this.name = name;
	}

	sanitized() {
		return SanitizedRoom.fromRoom(this);
	}
}
