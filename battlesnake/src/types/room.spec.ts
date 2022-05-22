import { describe } from 'mocha';
import { expect } from 'chai';
import faker from '@faker-js/faker';

import { Player } from './player';
import { Room } from './room';
import { SanitizedPlayer } from './sanitizedPlayer';
import { SanitizedRoom } from './sanitizedRoom';

describe('types/room', () => {
	let name, room;

	beforeEach(() => {
		name = faker.lorem.word();
		room = new Room(name);
	});

	it('should be able to be created', () => {
		expect(room).to.have.a.property('name').that.is.a('string').that.equals(name);
	});

	it('should be able to be sanitized', () => {
		const sanitized = room.sanitized();
		expect(sanitized).to.be.an.instanceOf(SanitizedRoom);
	});

	it('should be able to return sanitized players', () => {
		for (let i = 0; i < 10; i++) {
			room.registerPlayer(new Player(faker.internet.userName()));
		}
		const sanitized = room.sanitizedPlayers();
		expect(Object.values(sanitized)).to.each.be.an.instanceOf(SanitizedPlayer);
	});

	it('should be able to register a player', () => {
		const username = faker.internet.userName();
		const playerMock = new Player(username);
		room.registerPlayer(playerMock);

		const sanitized = room.sanitizedPlayers();
		expect(Object.keys(sanitized)).to.have.a.lengthOf(1);
		expect(Object.values(sanitized)[0]).to.have.a.property('username').that.equals(username);
	});
});
