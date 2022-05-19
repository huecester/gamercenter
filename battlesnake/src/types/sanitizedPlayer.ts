import { Player } from './player';

export class SanitizedPlayer {
	readonly username;

	constructor(player: Player) {
		this.username = player.username;
	}
}
