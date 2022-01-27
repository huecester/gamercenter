import genID from './util/id.js';

export function createPlayer(username) {
	return {
		username,
		id: genID(),
		color: genColor(),
		isHost: false,

		sanitized() {
			return {
				username: this.username,
				id: this.id,
				color: this.color,
				isHost: this.isHost,
			}
		},
	}
}

function genColor() {
	return `#${[...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
}
