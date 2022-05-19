import { describe } from 'mocha';
import { expect } from 'chai';
import faker from '@faker-js/faker';

import { Player } from './player';
import { SanitizedPlayer } from './sanitizedPlayer';

describe('types/sanitizedPlayer', () => {
	let username, player, sanitized;

	beforeEach(() => {
		username = faker.internet.userName();
		player = new Player(username);
		sanitized = new SanitizedPlayer(player);
	});

	it('should be able to be created properly', () => {
		expect(sanitized).to.have.a.property('username').that.equals(username);
	});
});
