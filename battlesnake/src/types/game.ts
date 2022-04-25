// TODO:
// - Link with rooms and Socket.IO
// - Init player bodies
// - Tests

// Ideas:
// - round timers
// - win counter
// - better system for random food when empty not found in time

import io from '../io';

// Base config variables
const TICK_RATE = 20;
const DIRECTION_BUFFER_SIZE = 2;
const MAX_RANDOM_EMPTY_CELL_ATTEMPTS = 5;
const DEFAULT_FOOD_FACTOR = 1/100;
const DEFAULT_FOOD_MAX_FACTOR = 1/5;
const FOOD_COLOR = '#ff0000';


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

export type SanitizedGamePlayers = {
	[id: string]: SanitizedGamePlayer,
}

type PlayerState = 'alive' | 'dead' | 'winner';


export class Game {
	readonly id: string;
	config: GameConfig;

	previousMs = getNowMs();
	timeSinceLastUpdate = 0;
	nextLoop?: NodeJS.Timeout;

	players: GamePlayer[] = [];
	food: number[][] = [];
	
	// State flags
	noMoreFood = false;

	constructor(id: string, config?: PartialGameConfig) {
		this.id = id;
		this.config = normalizeConfig(config);
	}

	get sanitizedPlayers() {
		const sanitizedPlayers: SanitizedGamePlayers = {};
		for (const player of this.players) {
			sanitizedPlayers[player.id] = player.sanitized;
		}
		return sanitizedPlayers;
	}

	get sanitizedBoard() {
		const board: BoardState = {};

		// Players
		for (const player of this.players) {
			board[player.color] = player.cells;
		}

		// Food
		board[FOOD_COLOR] = this.food;

		return board;
	}

	emitCountdown(seconds: number) { io.to(this.id).emit('countdown', seconds); }
	emitStart() { io.to(this.id).emit('start'); }
	emitWall(player: string) { io.to(this.id).emit('wall', player); }
	emitKilled(player: string, killer: string) { io.to(this.id).emit('killed', player, killer); }
	emitBoard() { io.to(this.id).emit('board', this.sanitizedBoard); }
	emitPlayers() { io.to(this.id).emit('players', this.sanitizedPlayers); }
	emitWinner(winner: string | null) { io.to(this.id).emit('winner', winner); }

	async start(players: GamePlayer[]) {
		this.players = players;
		this.init();

		for (let i = this.config.countdownLength; i > 0; i--) {
			this.emitCountdown(i);
			await sleep(1000);
		}

		this.emitStart();
		this.loop();
	}

	init() {
		// Initialize state flags
		this.noMoreFood = false;

		// Initialize food
		for (let i = 0; i < this.config.foodAmount; i++) {
			const cell = this.findEmptyCell();
			if (cell) {
				this.food.push(cell);
			} else {
				this.noMoreFood = true;
				break;
			}
		}

		// Initialize players
		for (const player of this.players) {
			player.state = 'alive';
			player.killer = '';
			player.newDirections = [];
		}
	}

	loop() {
		this.nextLoop = setTimeout(this.loop, 1000 / TICK_RATE);
		const nowMs = getNowMs();
		const delta = (nowMs - this.previousMs) / 1000;
		this.timeSinceLastUpdate += delta;

		if (this.timeSinceLastUpdate >= 1000 / this.config.gameSpeed) {
			this.update();
		}

		this.previousMs = nowMs;
	}

	stopLoop() {
		if (this.nextLoop) {
			clearTimeout(this.nextLoop);
			this.nextLoop = undefined;
		}
	}

	update() {
		// Update players
		for (const player of this.players.filter(player => player.state === 'alive')) {
			player.update();
		}

		this.checkCollisions();
		this.updateEntities();

		const winner = this.checkWinner();
		if (winner !== undefined) {
			this.emitPlayers();

			if (winner !== null) {
				this.emitWinner(winner);
			} else {
				this.emitWinner(null);
			}

			this.stopLoop();
			return;
		}

		this.emitBoard();
	}

	findEmptyCell() {
		for (let i = 0; i < MAX_RANDOM_EMPTY_CELL_ATTEMPTS; i++) {
			const cell = randomCell(this.config.boardMaxX, this.config.boardMaxY);
			if (!this.players.some(player => player.cells.some(bodyCell => isColliding(bodyCell, cell)))
				&& !this.food.some(food => isColliding(food, cell))) {
					return cell;
				}
		}
		return null;
	}

	checkCollisions() {
		for (const player of this.players) {
			// Player -> wall
			if (outOfBounds(player.head, this.config.boardMaxX, this.config.boardMaxY)) {
				player.deathType = 'wall';
			}

			else {
				out: {
					// Player -> body
					for (const target of this.players) {
						if (target.cells.some(cell => isColliding(player.head, cell))) {
							player.deathType = 'player';
							player.killer = target.username;
							break out;
						}
					}

					// Player -> food
					for (const food of this.food) {
						if (isColliding(player.head, food)) {
							player.grow();
							this.food = this.food.filter(item => !isColliding(item, food));
							break out;
						}
					}
				}
			}
		}
	}

	updateEntities() {
		// Refill food
		if (!this.noMoreFood) {
			for (let i = 0; i < this.config.foodAmount - this.food.length; i++) {
				const cell = this.findEmptyCell();
				if (cell) {
					this.food.push(cell);
				} else {
					this.noMoreFood = true;
					break;
				}
			}
		}

		// Dying players
		let updatePlayers = false;
		for (const player of this.players.filter(player => player.deathType)) {
			updatePlayers = true;
			player.state = 'dead';
			player.cells = [];
			switch (player.deathType) {
				case 'wall':
					this.emitWall(player.username);
					break;
				case 'player':
					this.emitKilled(player.username, player.killer);
					break;
			}
		}

		// Update players if necessary
		if (updatePlayers) {
			this.emitPlayers();
		}
	}

	checkWinner() {
		const alivePlayers = this.players.filter(player => player.state === 'alive');
		if (alivePlayers.length === 1) {
			const winner = alivePlayers[0];
			winner.state = 'winner';
			return winner.username;
		} else if (alivePlayers.length === 0) {
			return null;
		} else {
			return undefined;
		}
	}
}


class GamePlayer {
	readonly username: string;
	readonly id: string;
	readonly color: string;

	// First element is head
	cells: number[][] = [];
	direction: Direction = 'right';
	newDirections: Direction[] = [];

	// State flags
	state: PlayerState = 'alive';
	deathType: null | 'wall' | 'player' = null;
	killer = '';

	constructor(username: string, id: string, color: string) {
		this.username = username;
		this.id = id;
		this.color = color;
	}

	get head() {
		return this.cells[0] ?? [-1, -1];
	}

	get sanitized() {
		return new SanitizedGamePlayer(this.username, this.color, this.state);
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

class SanitizedGamePlayer {
	readonly username: string;
	readonly color: string;
	readonly state: PlayerState;

	constructor(username: string, color: string, state: PlayerState) {
		this.username = username;
		this.color = color;
		this.state = state;
	}
}
