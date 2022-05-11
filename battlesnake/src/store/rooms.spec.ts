import { describe } from 'mocha';
import { expect, use } from 'chai';
import chaiEach from 'chai-each';

import { SanitizedRoom } from '../types/sanitizedRoom';
import { getSanitizedRooms } from './rooms'

use(chaiEach);

describe('store/rooms', () => {
	it('should be able to get all rooms as sanitized', () => {
		const rooms = getSanitizedRooms();

		expect(rooms).to.each.be.an.instanceof(SanitizedRoom);
	});
});
