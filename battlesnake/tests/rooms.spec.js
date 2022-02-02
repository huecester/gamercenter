import { describe } from 'mocha';
import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';
import faker from '@faker-js/faker';

import { clearRooms } from '../src/rooms.js';
import app from '../src/app.js';

chai.use(chaiHTTP);


describe('Rooms page', () => {
	let roomname, password;

	function createRoom() {
		return chai.request(app).post('/rooms').send({ roomname, password });
	}

	function getRooms() {
		return chai.request(app).get('/rooms');
	}

	beforeEach(() => {
		clearRooms();
		roomname = faker.lorem.word();
		password = faker.internet.password();
	});

	describe('Basic API', () => {
		it('should respond with an empty array with GET /rooms', async () => {
			const res = await getRooms();

			expect(res).to.have.property('status', 200);
			expect(res).to.have.property('body').that.deep.equals([]);
		});

		it('should be able to create a room with POST /rooms', async () => {
			const postRes = await createRoom();
			expect(postRes).to.have.property('status', 201);

			const getRes = await chai.request(app).get('/rooms');
			expect(getRes).to.have.property('status', 200);
			expect(getRes).to.have.property('body').that.is.an('array').with.length(1);
		});
	});


	describe('Creating rooms', () => {
		it('should properly return a room after creating it', async () => {
			await createRoom();

			const res = await chai.request(app).get('/rooms');
			const room = res.body[0];
			expect(room).to.have.property('name', roomname);
			expect(room).to.have.property('password', true);
		});

		it('should slice roomname to 32 characters', async () => {
			roomname = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz';
			await createRoom();

			const res = await chai.request(app).get('/rooms');
			const room = res.body[0];
			expect(room).to.have.property('name', 'abcdefghijklmnopqrstuvwxyzabcdef');
		});

		it('should respond with HTTP 400 if roomname is not sent', async () => {
			roomname = undefined;
			const res = await createRoom();
			expect(res).to.have.property('status', 400);
		});
	});


	describe('Passwords', () => {
		it('should send a room with password set to false if password is null', async () => {
			password = null;
			await createRoom();

			const res = await chai.request(app).get('/rooms');
			const room = res.body[0];
			expect(room).to.have.property('password', false);
		});

		it('should send a room with password set to false if password is undefined', async () => {
			password = undefined;
			await createRoom();

			const res = await chai.request(app).get('/rooms');
			const room = res.body[0];
			expect(room).to.have.property('password', false);
		});

		it('should send a room with password set to false if password is an empty string', async () => {
			password = '';
			await createRoom();

			const res = await chai.request(app).get('/rooms');
			const room = res.body[0];
			expect(room).to.have.property('password', false);
		});
	});
});
