import { describe } from 'mocha';
import { expect } from 'chai';
import { addRoom, clearRooms, createRoom, getRooms } from './rooms.js';

describe('rooms.js', () => {
	beforeEach(() => {
		clearRooms();
	});

	it('should return an empty array without adding rooms', () => {
		expect(getRooms()).to.be.an('array').that.is.empty;
	});

	it('should be able to create a room', () => {
		const room = createRoom('bazinga', 'gaming');

		expect(room).to.have.property('name', 'bazinga');
		expect(room).to.have.property('password', 'gaming');
		expect(room).to.have.property('id').that.is.a('string').with.length(8);
		expect(room).to.have.property('players').that.is.an('array').that.is.empty;
	});

	it('should be able to add and get a room', () => {
		const room = createRoom('bangin', 'secretpass');
		addRoom(room);

		const res = getRooms();
		expect(res).to.be.an('array').with.length(1);
		expect(res[0]).to.deep.equal(room);
	});
});
