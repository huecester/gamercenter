import { describe } from 'mocha';
import chai, { expect } from 'chai';
import { mock } from 'sinon';
import sinonChai from 'sinon-chai';
import { faker } from '@faker-js/faker';

import { Room } from './room';

chai.use(sinonChai);

describe('types/room', () => {
	let name, password;
	
	beforeEach(() => {
		name = faker.lorem.word();
		password = faker.internet.password();
	});

	it('should be able to be created properly', () => {
		const room = new Room(name);
		expect(room).to.be.an('object').that.has.a.property('name').that.equals(name);
	});

	it('should set password to null if password is not provided', () => {
		const room = new Room(name);
		expect(room).to.have.property('password').that.equals(null);
	});

	it('should set password to null if password is an empty string', () => {
		const room = new Room(name, {}, '');
		expect(room).to.have.property('password').that.equals(null);
	});

	it('should be able to have a password', () => {
		const room = new Room(name, {}, password);
		expect(room).to.have.property('password').that.equals(password);
	});

	it('should be able to be created from a form', () => {
		const form = { name, password };
		const room = Room.fromForm(form);

		expect(room).to.have.property('name').that.equals(name);
		expect(room).to.have.property('password').that.equals(password);
	});

	it('should be able to be sanitized', () => {
		const room = new Room(name, {}, password);
		const sanitized = room.sanitized();

		expect(sanitized).to.have.all.keys('name', 'players', 'password');
	});

	it('should be able to add and setup a player', () => {
		// Data
		const username = faker.internet.userName();

		// Mocks
		const ioApi = {
			emit() {},
		};
		const ioMock = mock(ioApi);
		ioMock.expects('emit').once().withArgs('join', username);

		const socketApi = {
			on() {},
		};
		const socketMock = mock(socketApi);
		socketMock.expects('on').once().withArgs('msg');

		// Tests
		const room = new Room(name, ioApi);
		room.addPlayer(username, socketApi);

		const player = room.players.values().next().value;
		expect(player).to.be.an('object').with.property('username').that.equals(username);

		ioMock.verify();
		socketMock.verify();
	});

	it('should be able to remove a player', () => {
		const username = faker.internet.userName();

		const ioApi = {
			emit() {},
		};
		const ioMock = mock(ioApi);
		const emitMock = ioMock.expects('emit').twice();

		const room = new Room(name, ioApi);
		room.addPlayer(username, { on() {} });
		
		const id = room.players.entries().next().value[0];
		room.removePlayer(id);

		expect(emitMock.getCall(1)).to.have.been.calledWith('leave', username);

		ioMock.verify();
	});
});
