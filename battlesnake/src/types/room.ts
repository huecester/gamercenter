export type Rooms = Map<string, Room>;

export interface RoomForm {
	name: string,
	password?: string,
}

export class Room {
	readonly name: string;
	// players: Player[];
	readonly password: string | null;

	constructor(name: string, password?: string) {
		this.name = name;
		this.password = password?.length && password?.length > 0 ? password : null;
	}

	static fromForm(form: RoomForm) {
		return new Room(form.name, form.password);
	}

	sanitized() {
		return new SanitizedRoom(this.name, this.password !== null);
	}
}


export class SanitizedRoom {
	readonly name: string;
	readonly password: boolean;

	constructor(name: string, password: boolean) {
		this.name = name;
		this.password = password;
	}
}

export type SanitizedRooms = {
	[id: string]: SanitizedRoom,
};
