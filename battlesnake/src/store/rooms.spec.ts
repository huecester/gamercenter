import { describe } from 'mocha';
import { expect, use } from 'chai';
import chaiEach from 'chai-each';
import faker from '@faker-js/faker';

import { Room } from '../types/room';
import { SanitizedRoom } from '../types/sanitizedRoom';
import { addRoom, clearRooms, getRoom, getSanitizedRooms } from './rooms';

use(chaiEach);

describe('store/rooms', () => {
	let room;
	
	beforeEach(() => {
		room = new Room(faker.lorem.word());
	});

	afterEach(() => {
		clearRooms();
	});

	it('should be able to add rooms', () => {
		addRoom(room);
		expect(Object.keys(getSanitizedRooms())).to.have.a.lengthOf(1);
	});

	it('should be able to get rooms by ID', () => {
		const id = addRoom(room);
		expect(getRoom(id)).to.deep.equal(room);
	})

	it('should be able to clear rooms', () => {
		addRoom(room);
		clearRooms();

		expect(getSanitizedRooms()).to.be.empty;
	});

	it('should be able to get all rooms as sanitized', () => {
		for (let i = 0; i < 10; i++) {
			addRoom(new Room(faker.lorem.word()));
		}

		expect(Object.values(getSanitizedRooms())).to.each.be.an.instanceOf(SanitizedRoom);
	});
});
