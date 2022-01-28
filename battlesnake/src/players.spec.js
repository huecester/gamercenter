import { describe } from 'mocha';
import { expect } from 'chai';
import faker from '@faker-js/faker';
import { createPlayer } from './players.js'

describe('players.js', () => {
	let username, player;

	beforeEach(() => {
		username = faker.internet.userName();
		player = createPlayer(username);
	});

	it('should be able to create a player', () => {
		expect(player).to.have.property('username', username);
		expect(player).to.have.property('id').that.is.a('string');
		expect(player).to.have.property('color').that.matches(/^#[0-9a-f]{6}$/i);
		expect(player).to.have.property('sanitized').that.is.a('function');
	});

	it('should be able to sanitize a player', () => {
		const sanitized = player.sanitized();
		expect(sanitized).to.have.all.keys('username', 'id', 'color', 'isHost');
		expect(sanitized).to.not.have.any.keys('sanitized');
	});
});
