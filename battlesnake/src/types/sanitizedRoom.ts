import { Room } from './room';

export class SanitizedRoom {
	readonly name;

	private constructor(name: string) {
		this.name = name;
	}

	static fromRoom(room: Room) {
		return new SanitizedRoom(room.name);
	}
}
