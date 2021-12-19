const ms = () => {
	const time = process.hrtime();
	return time[0] * 1000 + time[1] / 1000000;
}

export default (io, room) => ({
	gridSize: 20,
	speed: 5,
	maxFood: 2,

	io,
	started: false,
	players: [],
	room,
	foods: [],

	isColliding(s1, s2) {
		return s1[0] === s2[0] && s1[1] === s2[1];
	},

	randomEmpty() {
		let random;
		for (let maxIter = 10; maxIter > 0; maxIter--) {
			random = [Math.floor(Math.random() * this.gridSize), Math.floor(Math.random() * this.gridSize)];
			if (this.players.some(player => player.body.some(seg => this.isColliding(random, seg)))) continue;
			return random;
		}
		return [-1, -1];
	},

	init() {
		let i = 0;
		for (const player of this.players) {
			this.room.players.get(player.id).status = 'alive';
			player.status = 'alive';
			player.body = [[i, 2], [i, 1], [i, 0]];
			player.direction = 'down';
			i++;
		}

		this.foods = [];
		for (let food = this.maxFood; food > 0; food--) {
			this.foods.push(this.randomEmpty());
		}

		this.room.updatePlayers();
	},

	update() {
		for (const player of this.players.filter(player => player.status === 'alive')) {
			// handle next directions
			let nextDir;
			player.nextDirections = player.nextDirections.slice(0, 5);
			while (player.nextDirections.length > 0) {
				const testDir = player.nextDirections.shift();
				if (player.validDirection(testDir)) {
					nextDir = testDir;
					player.nextDirections = player.nextDirections.slice(0, 2);
					break;
				}
			}
			if (nextDir) {
				player.direction = nextDir;
			}

			// move body
			player.body.pop();
			player.body.unshift([player.body[0][0], player.body[0][1]]);
			switch (player.direction) {
				case 'up':
					player.body[0][1]--;
					break;
				case 'down':
					player.body[0][1]++;
					break;
				case 'left':
					player.body[0][0]--;
					break;
				case 'right':
					player.body[0][0]++;
					break;
			}


			// test collision
			const head = player.body[0];

			// food
			for (const food of this.foods) {
				if (this.isColliding(head, food)) {
					const lastSegment = player.body[player.body.length - 1];
					player.body.push([lastSegment[0], lastSegment[1]]);
					this.foods = this.foods.filter(f => f[0] !== food[0] || f[1] !== food[1]);
					this.foods.push(this.randomEmpty());
				}
			}

			// death with others
			if (this.players.filter(target => target.id !== player.id)
					.some(target => target.body
					.some(seg => this.isColliding(head, seg)))) {
				this.room.players.get(player.id).status = 'dead';
				this.room.updatePlayers();
				player.status = 'dead';
				player.body = [];
			}

			// death with self
			if (player.body.slice(1).some(seg => this.isColliding(head, seg))) {
				this.room.players.get(player.id).status = 'dead';
				this.room.updatePlayers();
				player.status = 'dead';
				player.body = [];
			}

			// void
			if (head[0] < 0 || head[0] >= this.gridSize || head[1] < 0 || head[1] >= this.gridSize) {
				this.room.players.get(player.id).status = 'dead';
				this.room.updatePlayers();
				player.status = 'dead';
				player.body = [];
			}
		}

		io.volatile.emit('render', [
			...this.players.filter(player => player.status === 'alive').map(player => ({
				color: player.color,
				pos: player.body,
			})),
			{
				color: '#ff0000',
				pos: this.foods,
			},
		]);

		// test winner
		const alive = this.players.filter(player => player.status === 'alive');
		if (alive.length <= 1) {
			if (alive.length === 1) {
				this.room.players.get(alive[0].id).status = 'winner';
				this.room.updatePlayers();
				return alive[0].username;
			} else {
				return 'No one';
			}
		}
	},

	start() {
		// constants
		const tickRate = 20;
		const tickLengthMs = 1000 / tickRate;
		const updateRate = 1 / this.speed;

		// game loop timing
		let tick = 0;
		let render = 0;
		let prev = ms();

		// update timing
		let timeSinceLastUpdate = 0;

		const loop = () => {
			const nextID = setTimeout(loop, tickLengthMs);
			const now = ms();
			const delta = (now - prev) / 1000;
			timeSinceLastUpdate += delta;

			if (timeSinceLastUpdate >= updateRate) {
				const winner = this.update();
				if (winner) {
					clearTimeout(nextID);
					this.io.emit('win', winner);
					this.started = false;
				}
				if (render >= 200) {
					clearTimeout(nextID);
					this.started = false;
					this.io.emit('win', 'System')
				}
				timeSinceLastUpdate = 0;
				render++;
			}

			prev = now;
			tick++;
		}
		this.init();
		loop();
	},
});
