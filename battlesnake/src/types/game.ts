import io from '../io';

// Base config variables
const TICK_RATE = 20;

// Helper functions
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
const getNowMs = () => {
	const time = process.hrtime();
	return time[0] * 1000 + time[1] / 1000000;
};
const clamp = (min: number, val: number, max: number) => Math.max(min, Math.min(max, val));


export interface PartialGameConfig {
	countdownLength?: number;
	gameSpeed?: number;
}

export interface GameConfig {
	countdownLength: number;
	gameSpeed: number; // Updates/sec
	// initialBodyLength: number;
}

function normalizeConfig(partialConfig?: PartialGameConfig): GameConfig {
	// If property exists, clamp; else, set to default value
	return {
		countdownLength: partialConfig?.countdownLength ? clamp(0, partialConfig.countdownLength, 20) : 3,
		gameSpeed: partialConfig?.gameSpeed ? clamp(1, partialConfig.gameSpeed, 20) : 5,
	};
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
			io.of('/rooms').to(this.id).emit('countdown', i);
			await sleep(1000);
		}
		io.of('/rooms').to(this.id).emit('start');
		this.loop();
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
		console.log('bob');
	}
}


class GamePlayer {
	readonly color: string;
	body: Body = new Body;

	constructor(color: string) {
		this.color = color;
	}
}


type Direction = 'up' | 'down' | 'left' | 'right';

class Body {
	cells: number[][] = [];
	direction: Direction = 'right';
	newDirections: Direction[] = [];

	bufferDirection(direction: Direction) {
		this.newDirections.push(direction);
	}

	update() {
		// TODO update body
	}
}
