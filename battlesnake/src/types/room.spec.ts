import { describe } from 'mocha';
import { expect } from 'chai';
import faker from '@faker-js/faker';

import { Room } from './room';
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
		expect(sanitized).to.be.an.instanceof(SanitizedRoom);
	});
});
