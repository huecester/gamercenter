import { describe } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { faker } from '@faker-js/faker';

import app from '../src/app';
import { clearRooms } from '../src/store/rooms';

chai.use(chaiHttp);

describe('Rooms', () => {
	let name, password;

	beforeEach(() => {
		name = faker.lorem.word();
		password = faker.internet.password();
	});

	afterEach(() => {
		clearRooms();
	});

	it('should be able to create rooms', async () => {
		const res = await chai.request(app)
			.post('/rooms')
			.type('form')
			.send({ name, password });
		expect(res).to.have.a.status(201);
		expect(res.text).to.be.a('string').that.matches(/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i);
	});

	it('should be able to get rooms after creating', async () => {
		const req = chai.request(app).keepOpen();

		const id = (await req.post('/rooms')
			.type('form')
			.send({ name, password }))
			.text;
		const res = await req.get('/rooms');

		expect(res).to.have.a.status(200);
		expect(res.body).to.be.an('object')
			.that.has.a.property(id)
				.that.is.an('object')
				.that.has.all.keys('name', 'players', 'password');

		const room = res.body[id];
		expect(room).to.have.a.property('name').that.equals(name);
		expect(room).to.have.a.property('password').that.is.true;
		expect(room).to.have.a.property('players').that.is.an('object').that.is.empty;

		req.close();
	});

	it('should be able to get rooms before creating', async () => {
		const res = await chai.request(app)
			.get('/rooms');
		expect(res).to.have.a.status(200);
		expect(res.body).to.be.an('object').that.is.empty;
	});

	it('should be able to create a room without a password', async () => {
		const req = chai.request(app).keepOpen();

		const id = (await req.post('/rooms')
			.type('form')
			.send({ name }))
			.text;
		const res = await req.get('/rooms');
		expect(res.body).to.have.a.property(id)
			.that.has.a.property('password')
			.that.is.false;

		req.close();
	});

	it('should accept extra data', async () => {
		const res = await chai.request(app)
			.post('/rooms')
			.type('form')
			.send({ name, password, gaming: true, other: 'bazinga' });
		expect(res).to.have.a.status(201);
	});

	it('should not accept json or other non-form data', async () => {
		const res = await chai.request(app)
			.post('/rooms')
			.type('json')
			.send({ name, password });
		expect(res).to.have.a.status(422);
	});

	it('should not accept a form without a name', async () => {
		const res = await chai.request(app)
			.post('/rooms')
			.type('form')
			.send({ password });
		expect(res).to.have.a.status(422);
	});

	it('should not accept an empty form', async () => {
		const res = await chai.request(app)
			.post('/rooms')
			.type('form')
			.send();
		expect(res).to.have.a.status(422);
	});
});
