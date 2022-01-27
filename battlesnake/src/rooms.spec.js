import { describe } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import faker from '@faker-js/faker';
import { addRoom, clearRooms, createRoom, deleteRoom, getRoom, getRooms } from './rooms.js';


describe('rooms.js', () => {
	let roomname, password, room, mock;
	const io = {
		in() {},
		emit() {},
	};

	function generateInfo() {
		roomname = faker.lorem.word();
		password = faker.internet.password();
	}

	function generateRoom() {
		generateInfo();
		room = createRoom(roomname, password, io);
	}


	beforeEach(() => {
		clearRooms();

		mock = sinon.mock(io);
		mock.expects('in').once().returns(io);
		generateRoom();
	});

	afterEach(() => {
		mock.restore();
	});


	describe('Functions', () => {
		it('should return an empty array without adding rooms', () => {
			expect(getRooms()).to.be.an('array').that.is.empty;
		});

		it('should be able to create a room', () => {
			expect(room).to.have.property('name', roomname);
			expect(room).to.have.property('password', password);
			expect(room).to.have.property('id').that.is.a('string').with.length(8);
			expect(room).to.have.property('players').that.is.a('map').that.is.empty;

			expect(room).to.have.property('io').that.is.an('object');
			expect(room).to.have.property('sanitized').that.is.a('function');
			expect(room).to.have.property('addPlayer').that.is.a('function');
			expect(room).to.have.property('removePlayer').that.is.a('function');
			expect(room).to.have.property('close').that.is.a('function');
		});

		it('should be able to sanitize a room', () => {
			const sanitized = room.sanitized();
			expect(sanitized).to.have.property('name', roomname);
			expect(sanitized).to.have.property('password').that.equals(true);
			expect(sanitized).to.have.property('id').that.is.a('string').with.length(8);
			expect(sanitized).to.have.property('players').that.is.an('array').that.is.empty;

			expect(sanitized).to.not.have.property('io');
			expect(sanitized).to.not.have.property('sanitized');
			expect(sanitized).to.not.have.property('addPlayer');
			expect(sanitized).to.not.have.property('removePlayer');
			expect(sanitized).to.not.have.property('close');
		});

		it('should be able to add and get a room', () => {
			addRoom(room);

			const res = getRooms();
			expect(res).to.be.an('array').with.length(1);
			expect(res[0]).to.deep.equal(room);
		});

		it('should be able to get a room by id', () => {
			const targetRoom = room;
			const targetID = room.id;
			addRoom(room);

			mock.restore();
			for (let i = 0; i < 10; i++) {
				generateRoom();
				addRoom(room);
			}

			const resRoom = getRoom(targetID);
			expect(targetRoom).to.deep.equal(resRoom);
		});

		it('should be able to delete a room by id', () => {
			addRoom(room);
			deleteRoom(room.id);
			expect(getRooms()).to.be.empty;
		});
	});

	describe('Rooms', () => {
		it('should be able to close', () => {
			addRoom(room);
			mock.expects('emit').once().withExactArgs('close', undefined);

			room.close();
			expect(getRooms()).to.be.empty;
		});
	});
});
