import { Room } from './room';

export class SanitizedRoom {
	readonly name;

	constructor(room: Room) {
		this.name = room.name;
	}
}
