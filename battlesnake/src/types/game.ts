// TODO:
// - round timers
// - win counter

import io from '../io';

// Base config variables
const TICK_RATE = 20;
const DIRECTION_BUFFER_SIZE = 2;
const FOOD_SPAWN_ATTEMPTS = 10;
const DEFAULT_FOOD_FACTOR = 1/100;
const DEFAULT_FOOD_MAX_FACTOR = 1/5;


// Helper functions
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
const clamp = (min: number, val: number, max: number) => Math.max(min, Math.min(max, val));
const clampDefault = (min: number, val: number | undefined, max: number, def: number) => val !== undefined ? clamp(min, val, max) : def;
const outOfBounds = (cell: number[], maxX: number, maxY: number) => cell[0] < 0 || cell[0] > maxX || cell[1] < 0 || cell[1] > maxY;
const isColliding = (cell1: number[], cell2: number[]) => cell1[0] == cell2[0] && cell1[1] == cell2[1];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min);
const randomCell = (maxX: number, maxY: number) => [getRandomInt(0, maxX), getRandomInt(0, maxY)];

function normalizeConfig(partialConfig?: PartialGameConfig): GameConfig {
	const boardMaxX = clampDefault(1, partialConfig?.boardMaxX, 100, 20);
	const boardMaxY = clampDefault(1, partialConfig?.boardMaxY, 100, 20);
	const boardSize = boardMaxX * boardMaxY;

	// If property exists, clamp; else, set to default value
	return {
		boardMaxX,
		boardMaxY,
		countdownLength: clampDefault(0, partialConfig?.countdownLength, 20, 3),
		gameSpeed: clampDefault(1, partialConfig?.gameSpeed, 20, 5),
		foodAmount: clampDefault(1, partialConfig?.foodAmount, Math.floor(boardSize * DEFAULT_FOOD_MAX_FACTOR), Math.floor(boardSize * DEFAULT_FOOD_FACTOR)),
	};
}

function getNowMs() {
	const time = process.hrtime();
	return time[0] * 1000 + time[1] / 1000000;
}

function isOpposite(orig: Direction, next: Direction) {
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

function applyDirection(cell: number[], dir: Direction) {
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


// Types
export interface PartialGameConfig {
	boardMaxX?: number;
	boardMaxY?: number;
	countdownLength?: number;
	gameSpeed?: number;
	foodAmount?: number;
}

export interface GameConfig {
	boardMaxX: number;
	boardMaxY: number;
	countdownLength: number;
	gameSpeed: number; // Updates/sec
	foodAmount: number;
	// initialBodyLength: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface BoardState {
	[color: string]: number[][];
}


export class Game {
	readonly id: string;
	config: GameConfig;

	previousMs = getNowMs();
	timeSinceLastUpdate = 0;

	players: GamePlayer[] = [];
	food: number[][] = [];

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

	findEmptyCell() {
		for (let i = 0; i < FOOD_SPAWN_ATTEMPTS; i++) {
			
		}
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

		this.checkCollisions();
		this.updateEntities();
	}

	checkCollisions() {
		for (const player of this.players) {
			// Player -> wall
			if (outOfBounds(player.head, this.config.boardMaxX, this.config.boardMaxY)) {
				player.dying = true;
			}

			// Player -> body
			else if (this.players.some(target => target.cells.some(cell => isColliding(player.head, cell)))) {
				player.dying = true;
			}

			// Player -> food
			else {
				for (const food of this.food) {
					if (isColliding(player.head, food)) {
						player.grow();
						this.food = this.food.filter(item => !isColliding(item, food));
					}
				}
			}
		}
	}
}


class GamePlayer {
	readonly color: string;

	// First element is head
	cells: number[][] = [];
	direction: Direction = 'right';
	newDirections: Direction[] = [];

	// State flags
	dying = false;

	constructor(color: string) {
		this.color = color;
	}

	get head() {
		return this.cells[0] ?? [-1, -1];
	}

	grow() {
		this.cells.push(this.cells[this.cells.length - 1]);
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
