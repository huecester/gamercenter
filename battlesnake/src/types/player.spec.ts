import { describe } from 'mocha';
import { expect } from 'chai';
import faker from '@faker-js/faker';

import { Player } from './player';
import { SanitizedPlayer } from './sanitizedPlayer';

describe('types/player', () => {
	let username, player;

	beforeEach(() => {
		username = faker.internet.userName();
		player = new Player(username);
	});

	it('should be able to be created', () => {
		expect(player).to.have.a.property('username').that.equals(username);
	});

	it('should be able to be sanitized', () => {
		const sanitized = player.sanitized();
		expect(sanitized).to.be.an.instanceOf(SanitizedPlayer);
	});
});
