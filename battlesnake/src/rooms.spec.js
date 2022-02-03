import { describe } from 'mocha';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import faker from '@faker-js/faker';
import { addRoom, clearRooms, createRoom, deleteRoom, getRoom, getRooms } from './rooms.js';
import genID from './util/id.js';

chai.use(sinonChai);


describe('rooms.js', () => {
	let roomname, password, room;

	function generateInfo() {
		roomname = faker.lorem.word();
		password = faker.internet.password();
	}

	function generateRoom() {
		generateInfo();
		room = createRoom(roomname, password);
	}


	beforeEach(() => {
		clearRooms();

		generateRoom();
	});


	describe('Functions', () => {
		it('should return an empty array without adding rooms', () => {
			expect(getRooms()).to.be.an('array').that.is.empty;
		});

		it('should be able to create a room', () => {
			expect(room).to.have.property('name', roomname);
			expect(room).to.have.property('password', password);
			expect(room).to.have.property('id').that.is.a('string').with.lengthOf(8);
			expect(room).to.have.property('players').that.is.a('map').that.is.empty;

			expect(room).to.have.property('io').that.is.an('object');
			expect(room).to.have.property('sanitized').that.is.a('function');
			expect(room).to.have.property('addPlayer').that.is.a('function');
			expect(room).to.have.property('removePlayer').that.is.a('function');
			expect(room).to.have.property('close').that.is.a('function');
		});

		it('should be able to sanitize a room', () => {
			const sanitized = room.sanitized();
			expect(sanitized).to.have.all.keys('name', 'password', 'id', 'players');
			expect(sanitized).to.not.have.any.keys('io', 'sanitized', 'addPlayer', 'removePlayer', 'close');
		});

		it('should be able to add and get a room', () => {
			addRoom(room);

			const res = getRooms();
			expect(res).to.be.an('array').with.lengthOf(1);
			expect(res[0]).to.deep.equal(room);
		});

		it('should be able to get a room by id', () => {
			const targetRoom = room;
			const targetID = room.id;
			addRoom(room);

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

			room.close();
			expect(getRooms()).to.be.empty;
		});

		describe('Players', () => {
			let username, player, sanitizedPlayersStub, setupPlayerSocketStub;

			beforeEach(() => {
				// Fake player
				username = faker.internet.userName();
				player = {
					username,
					id: genID(),
				};

				// Stub
				sanitizedPlayersStub = sinon.stub(room, 'sanitizedPlayers');
				setupPlayerSocketStub = sinon.stub(room, 'setupPlayerSocket');
			});

			afterEach(() => {
				sanitizedPlayersStub.restore();
				setupPlayerSocketStub.restore();
			});

			it('should be able to add a player', () => {
				addRoom(room);

				room.addPlayer(player);

				expect(room.players.get(player.id)).to.deep.equal(player);

				expect(setupPlayerSocketStub).to.have.been.calledOnce;
				expect(setupPlayerSocketStub.getCall(0)).to.have.been.calledWith(player);
			});

			it('should be able to remove a player', () => {
				addRoom(room);

				room.addPlayer(player);
				room.removePlayer(player);

				expect(room.players.get(player.id)).to.be.undefined;

				expect(sanitizedPlayersStub).to.have.been.calledTwice;
			});
		});
	});
});
