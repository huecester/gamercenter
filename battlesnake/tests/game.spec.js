import { describe } from 'mocha';
import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';
import { io as Client } from 'socket.io-client';
import sinon from 'sinon';
import faker from '@faker-js/faker';
import { createServer } from 'http';
import axiosModule from 'axios';

import { clearRooms } from '../src/rooms.js'
import app from '../src/app.js';
import io from '../src/io.js';

chai.use(chaiHTTP);


describe('Game page', () => {
	let roomname, password, username, axios;
	let httpServer, port;

	function generateFakeData() {
		roomname = faker.lorem.word();
		password = faker.internet.password();
		username = faker.internet.userName();
	}

	function createRoom(usePassword) {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await axios.post('/rooms', {
					roomname,
					password: (usePassword) ? password : undefined,
				});
				resolve(res.data);
			} catch (err) {
				reject(err);
			}
		});
	}

	function createClient() {
		return new Client(`http://localhost:${port}`);
	}

	before(done => {
		httpServer = app;
		httpServer.listen(() => {
			port = httpServer.address().port;
			axios = axiosModule.create({
				baseURL: `http://localhost:${port}`,
			});
			done();
		});
	});

	beforeEach(() => {
		generateFakeData();
	});

	afterEach(() => {
		io.disconnectSockets();
	});

	after(() => {
		httpServer.close();
		io.close();
	});

	describe('Joining', done => {
		it('should be able to join a room', done => {
			createRoom().then(id => {
				const client = createClient();
				client.emit('join', { id }, res => {
					expect(res).to.have.property('room');
					expect(res).to.not.have.property('err');
					done();
				});
			});
		});

		it('should not be able to join a room that does not exist', () => {

		});

		it('should be able to join a room with a password', () => {

		});

		it('should not be able to join a room with an incorrect password', () => {

		});

		it('should timeout the room after 5 seconds', () => {

		});

		it('should timeout a client after 2 seconds', () => {

		});
	});

	describe('Messaging', () => {
		it('should be able to send a message', () => {

		});

		it('should slice all messages to a max of 64 characters', () => {

		});
	});

	describe('Leaving', () => {
		it('should be able to leave', () => {

		});

		it('should disconnect all clients after the host leaves', () => {

		});
		
		it('should not disconnect clients when a non-host leaves', () => {

		});

		it('should not be able to join a room that has been closed', () => {

		});
	});
});
