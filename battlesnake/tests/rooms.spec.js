import { describe } from 'mocha';
import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';
import faker from '@faker-js/faker';

import { clearRooms } from '../src/rooms.js';
import app from '../src/app.js';


chai.use(chaiHTTP);

let roomname;
let password;

describe('Rooms API', () => {
	beforeEach(() => {
		clearRooms();
		roomname = faker.lorem.word();
		password = faker.internet.password();
	});

	// Basic API functions
	it('should respond with an empty array with GET /rooms', async () => {
		const res = await chai.request(app).get('/rooms');

		expect(res).to.have.property('status', 200);
		expect(res).to.have.property('body').that.deep.equals([]);
	});

	it('should be able to create a room with POST /rooms', async () => {
		const postRes = await chai.request(app).post('/rooms').send({
			roomname,
			password,
		});
		expect(postRes).to.have.property('status', 201);

		const getRes = await chai.request(app).get('/rooms');
		expect(getRes).to.have.property('status', 200);
		expect(getRes).to.have.property('body').that.is.an('array').with.length(1);
	});


	// Creating rooms
	it('should properly return a room after creating it', async () => {
		await chai.request(app).post('/rooms').send({
			roomname,
			password,
		});

		const res = await chai.request(app).get('/rooms');
		const room = res.body[0];
		expect(room).to.have.property('name', roomname);
		expect(room).to.have.property('password', true);
	});

	it('should slice roomname to 32 characters', async () => {
		await chai.request(app).post('/rooms').send({
			roomname: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz',
			password,
		});

		const res = await chai.request(app).get('/rooms');
		const room = res.body[0];
		expect(room).to.have.property('name', 'abcdefghijklmnopqrstuvwxyzabcdef');
	});

	it('should respond with HTTP 400 if roomname is not sent', async () => {
		const res = await chai.request(app).post('/rooms').send({
			password,
		});
		expect(res).to.have.property('status', 400);
	});


	// Password
	it('should send a room with password set to false if password is null', async () => {
		await chai.request(app).post('/rooms').send({
			roomname,
			password: null,
		});

		const res = await chai.request(app).get('/rooms');
		const room = res.body[0];
		expect(room).to.have.property('password', false);
	});

	it('should send a room with password set to false if password is undefined', async () => {
		await chai.request(app).post('/rooms').send({
			roomname,
		});

		const res = await chai.request(app).get('/rooms');
		const room = res.body[0];
		expect(room).to.have.property('password', false);
	});

	it('should send a room with password set to false if password is an empty string', async () => {
		await chai.request(app).post('/rooms').send({
			roomname,
			password: '',
		});

		const res = await chai.request(app).get('/rooms');
		const room = res.body[0];
		expect(room).to.have.property('password', false);
	});
});
