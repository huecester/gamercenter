import { describe } from 'mocha';
import { expect } from 'chai';
import faker from '@faker-js/faker';
import { addRoom, clearRooms, createRoom, getRooms } from './rooms.js';


describe('rooms.js', () => {
	let roomname, password, room;

	beforeEach(() => {
		clearRooms();
		roomname = faker.lorem.word();
		password = faker.internet.password();
		room = createRoom(roomname, password);
	});

	it('should return an empty array without adding rooms', () => {
		expect(getRooms()).to.be.an('array').that.is.empty;
	});

	it('should be able to create a room', () => {
		expect(room).to.have.property('name', roomname);
		expect(room).to.have.property('password', password);
		expect(room).to.have.property('id').that.is.a('string').with.length(8);
		expect(room).to.have.property('players').that.is.an('array').that.is.empty;
		expect(room).to.have.property('sanitized').that.is.a('function');
	});

	it('should be able to sanitize a room', () => {
		const sanitized = room.sanitized();
		expect(sanitized).to.have.property('name', roomname);
		expect(sanitized).to.have.property('password').that.equals(true);
		expect(sanitized).to.have.property('id').that.is.a('string').with.length(8);
		expect(sanitized).to.have.property('players').that.is.an('array').that.is.empty;
	});

	it('should be able to add and get a room', () => {
		addRoom(room);

		const res = getRooms();
		expect(res).to.be.an('array').with.length(1);
		expect(res[0]).to.deep.equal(room);
	});
});
