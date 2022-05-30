import { describe } from 'mocha';
import { expect, use } from 'chai';
import chaiEach from 'chai-each';
import faker from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

import { Room } from '../types/room';
import { SanitizedRoom } from '../types/sanitizedRoom';
import { addRoom, clearRooms, getRoom, getSanitizedRooms } from './rooms';

use(chaiEach);

describe('store/rooms', () => {
	let room, id;
	
	beforeEach(() => {
		id = uuidv4();
		room = new Room(faker.lorem.word(), id);
	});

	afterEach(() => {
		clearRooms();
	});

	it('should be able to add rooms', () => {
		addRoom(room);
		expect(Object.keys(getSanitizedRooms())).to.have.a.lengthOf(1);
	});

	it('should be able to get rooms by ID', () => {
		addRoom(room);
		expect(getRoom(id)).to.deep.equal(room);
	});

	it('should be able to clear rooms', () => {
		addRoom(room);
		clearRooms();

		expect(getSanitizedRooms()).to.be.empty;
	});

	it('should be able to get all rooms as sanitized', () => {
		for (let i = 0; i < 10; i++) {
			addRoom(new Room(uuidv4(), faker.lorem.word()));
		}

		expect(Object.values(getSanitizedRooms())).to.each.be.an.instanceOf(SanitizedRoom);
	});
});
