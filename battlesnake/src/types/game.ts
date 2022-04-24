// TODO:
// - round timers
// - win counter

import io from '../io';

// Base config variables
const TICK_RATE = 20;
const DIRECTION_BUFFER_SIZE = 2;


// Helper functions
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
const getNowMs = () => {
	const time = process.hrtime();
	return time[0] * 1000 + time[1] / 1000000;
};
const clamp = (min: number, val: number, max: number) => Math.max(min, Math.min(max, val));
const isOpposite = (orig: Direction, next: Direction) => {
	switch (orig) {
		case 'right':
			return next !== 'left';
		case 'left':
			return next !== 'right';
		case 'up':
			return next !== 'down';
		case 'down':
			return next !== 'up';
	}
}
const applyDirection = (cell: number[], dir: Direction) => {
	switch (dir) {
		case 'right':
			return [cell[0] + 1, cell[1]];
		case 'left':
			return [cell[0] - 1, cell[1]];
		case 'up':
			return [cell[0], cell[1] + 1];
		case 'down':
			return [cell[0], cell[1] - 1];
	}
}

function normalizeConfig(partialConfig?: PartialGameConfig): GameConfig {
	// If property exists, clamp; else, set to default value
	return {
		countdownLength: partialConfig?.countdownLength ? clamp(0, partialConfig.countdownLength, 20) : 3,
		gameSpeed: partialConfig?.gameSpeed ? clamp(1, partialConfig.gameSpeed, 20) : 5,
	};
}


// Types
export interface PartialGameConfig {
	countdownLength?: number;
	gameSpeed?: number;
}

export interface GameConfig {
	countdownLength: number;
	gameSpeed: number; // Updates/sec
	// initialBodyLength: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface BoardState {
	[color: string]: number[][];
}


export class Game {
	readonly id: string;
	players: GamePlayer[] = [];
	config: GameConfig;

	previousMs = getNowMs();
	timeSinceLastUpdate = 0;

	constructor(id: string, config?: PartialGameConfig) {
		this.id = id;
		this.config = normalizeConfig(config);
	}

	async start() {
		for (let i = this.config.countdownLength; i > 0; i--) {
			io.to(this.id).emit('countdown', i);
			await sleep(1000);
		}
		io.to(this.id).emit('start');
		this.init();
		this.loop();
	}

	init() {
		// Initialize players
		// Initialize food
	}

	loop() {
		setTimeout(this.loop, 1000 / TICK_RATE);
		const nowMs = getNowMs();
		const delta = (nowMs - this.previousMs) / 1000;
		this.timeSinceLastUpdate += delta;

		if (this.timeSinceLastUpdate >= 1000 / this.config.gameSpeed) {
			this.update();
		}

		this.previousMs = nowMs;
	}

	update() {
		// Update players
		for (const player of this.players) {
			player.update();
		}
	}
}


class GamePlayer {
	readonly color: string;

	// first element is head
	cells: number[][] = [];
	direction: Direction = 'right';
	newDirections: Direction[] = [];

	constructor(color: string) {
		this.color = color;
	}

	get head() {
		return this.cells[0] ?? [-1, -1];
	}

	bufferDirection(direction: Direction) {
		this.newDirections.push(direction);
	}

	update() {
		// Update direction
		for (const direction of this.newDirections.slice(0, DIRECTION_BUFFER_SIZE)) {
			if (!isOpposite(this.direction, direction)) {
				this.direction = direction;
				break;
			}
		}
		this.newDirections = [];

		// Update body
		// this.cells should never be empty, so newCell should never be [-1, -1]
		const newCell = this.cells.pop() ?? [-1, -1];
		this.cells.unshift(applyDirection(newCell, this.direction));
	}
}
