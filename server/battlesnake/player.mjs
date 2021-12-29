import { genColor } from '../hex.mjs';

export default (username, id, socket) => ({
	username,
	id,
	isHost: false,
	socket,
	color: genColor(),
	status: 'dead',
	body: [],
	direction: 'down',
	nextDirections: [],

	sanitized() {
		return {
			username: this.username,
			id: this.id,
			isHost: this.isHost,
			status: this.status,
			color: this.color,
		};
	},

	validDirection(dir) {
		switch (dir) {
			case 'up':
				return (this.direction !== 'down') ? true : false;
			case 'down':
				return (this.direction !== 'up') ? true : false;
			case 'left':
				return (this.direction !== 'right') ? true : false;
			case 'right':
				return (this.direction !== 'left') ? true : false;
			default:
				return false;
		}
	},
});


