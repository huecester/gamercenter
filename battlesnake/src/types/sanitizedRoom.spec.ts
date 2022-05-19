import { describe } from 'mocha';
import { expect } from 'chai';
import faker from '@faker-js/faker';

import { Room } from './room';
import { SanitizedRoom } from './sanitizedRoom';

describe('types/sanitizedRoom', () => {
	let name, room, sanitized;

	beforeEach(() => {
		name = faker.lorem.word();
		room = new Room(name);
		sanitized = new SanitizedRoom(room);
	});

	it('should be able to be created properly', () => {
		expect(sanitized).to.have.a.property('name').that.is.a('string').that.equals(name);
	});
});
