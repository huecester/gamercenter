import { describe } from 'mocha';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { Player } from './player';

describe('types/players', () => {
	let username;

	beforeEach(() => {
		username = faker.internet.userName();
	});

	it('should be able to be created properly', () => {
		const player = new Player(username);
		expect(player).to.be.an('object');
		expect(player).to.have.a.property('username').that.equals(username);
		expect(player).to.have.a.property('color').that.matches(/^#[a-f0-9]{6}$/i);
	});

	it('should be able to be sanitized', () => {
		const player = new Player(username);
		const sanitized = player.sanitized();

		expect(sanitized).to.have.all.keys('username', 'color');
	});
});
