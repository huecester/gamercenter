import { describe } from 'mocha';
import { expect } from 'chai';
import { mock, restore } from 'sinon';
import faker from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

import { Room } from './room';
import { SanitizedRoom } from './sanitizedRoom';

describe('types/room', () => {
	let name, room;

	function createPlayerMock() {
		const username = faker.internet.userName();
		const playerApi = {
			username,
			sanitized() {
				return { username: this.username };
			},
			socket: {
				join() { /* empty */ },
				on() { /* empty */ },
			},
		};
		return [playerApi, mock(playerApi), mock(playerApi.socket)];
	}

	beforeEach(() => {
		name = faker.lorem.word();
		room = new Room(name, uuidv4());
	});

	afterEach(() => {
		restore();
	});

	it('should be able to be created', () => {
		expect(room).to.have.a.property('name').that.is.a('string').that.equals(name);
	});

	it('should be able to be sanitized', () => {
		const sanitized = room.sanitized();
		expect(sanitized).to.be.an.instanceOf(SanitizedRoom);
	});

	it('should be able to return sanitized players', () => {
		const playerMocks = [];

		for (let i = 0; i < 10; i++) {
			const [playerApi, playerMock] = createPlayerMock();
			playerMock.expects('sanitized').once();
			room.registerPlayer(playerApi);
			playerMocks.push(playerMock);
		}
		room.sanitizedPlayers();

		playerMocks.forEach(mock => mock.verify());
	});

	it('should be able to register a player', () => {
		const [playerApi, _, socketMock] = createPlayerMock();

		socketMock.expects('join').once().withExactArgs(room.id);
		socketMock.expects('on').once();

		room.registerPlayer(playerApi);

		socketMock.verify();

		const sanitized = room.sanitizedPlayers();
		expect(Object.keys(sanitized)).to.have.a.lengthOf(1);
		expect(Object.values(sanitized)[0]).to.have.a.property('username').that.equals(playerApi.username);
	});
});
