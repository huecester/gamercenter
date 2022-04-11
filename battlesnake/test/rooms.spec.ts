import { describe } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { createServer as createHttpServer } from 'http';
import { io as IOClient } from 'socket.io-client';

import app from '../src/app';
import io from '../src/io';
import { clearRooms } from '../src/store/rooms';
import { JoinError } from '../src/types/data';

chai.use(chaiHttp);

describe('Rooms', () => {
	describe('API', () => {
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

		describe('Timeouts', () => {
			let clock;

			before(() => {
				clock = sinon.useFakeTimers();
			});

			after(() => {
				clock.restore();
			});

			it('should timeout a room after 5 seconds without a connection', async () => {
				const req = chai.request(app).keepOpen();
				const id = (await req.post('/rooms')
					.type('form')
					.send({ name, password }))
					.text;

				clock.tick(4999);
				{
					const res = await req.get('/rooms');
					expect(res.body).to.have.a.property(id);
				}

				clock.tick(1);
				{
					const res = await req.get('/rooms');
					expect(res.body).to.be.an('object').that.is.empty;
				}

				req.close();
			});
		});
	});

	describe('Socket.IO', () => {
		const PORT = 8000;

		let username, id, password;
		let req, server, client;

		before(done => {
			server = createHttpServer(app);
			io.attach(server, {
				serveClient: false,
			});
			server.listen(PORT, () => {
				req = chai.request(server).keepOpen();
				done();
			});
		});

		beforeEach(async () => {
			password = faker.internet.password();
			const form = {
				name: faker.lorem.word(),
				password,
			};

			id = (await req.post('/rooms')
				.type('form')
				.send(form))
				.text;
			username = faker.internet.userName();
			client = IOClient(`http://localhost:${PORT}/rooms`);
		});

		afterEach(() => {
			clearRooms();
			client.off();
			client.disconnect();
		});

		after(() => {
			req.close();
			server.close();
		});

		describe('Joining', () => {
			it('should be able to connect', done => {
				req.post('/rooms')
					.type('form')
					.send({ name: faker.lorem.word() })
					.then(res => {
						client.emit('join', { username, id: res.text }, data => {
							expect(data).to.be.an('object')
								.that.has.a.property('players')
								.that.is.an('object');

							const player = Object.values(data.players)[0];
							expect(player).to.be.an('object');
							expect(player).to.have.a.property('username').that.equals(username);
							expect(player).to.have.a.property('color').that.is.a('string').that.matches(/^#[a-f0-9]{6}$/i);

							done();
						});
					});
			});

			it('should be able to connect with a password', done => {
				client.emit('join', { username, id, password }, data => {
					expect(data).to.not.have.property('err');
					done();
				});
			});

			it('should not be able to connect without a name', done => {
				client.emit('join', { id, password }, data => {
					expect(data).to.have.a.property('err').that.equals(JoinError.NOUSERNAME);
					done();
				});
			});

			it('should not be able to connect without an ID', done => {
				client.emit('join', { username, password }, data => {
					expect(data).to.have.a.property('err').that.equals(JoinError.NOTFOUND);
					done();
				});
			});

			it('should not be able to connect with an unknown ID', done => {
				client.emit('join', { username, id: 'bazinga', password }, data => {
					expect(data).to.have.a.property('err').that.equals(JoinError.NOTFOUND);
					done();
				});
			});

			it('should not be able to connect without a password', done => {
				client.emit('join', { username, id }, data => {
					expect(data).to.have.a.property('err').that.equals(JoinError.BADPASS);
					done();
				});
			});

			it('should not be able to connect with an incorrect password', done => {
				client.emit('join', { username, id, password: 'bazinga' }, data => {
					expect(data).to.have.a.property('err').that.equals(JoinError.BADPASS);
					done();
				});
			});
		});

		describe('Messages', () => {
			it('should be able to send messages', done => {
				const msg = faker.lorem.sentence(5);

				client.on('msg', (resUsername, resMsg) => {
					expect(resUsername).to.be.a('string').that.equals(username);
					expect(resMsg).to.be.a('string').that.equals(msg);
					done();
				});

				client.emit('join', { username, id, password }, () => {
					client.emit('msg', msg);
				});
			});

			it('should limit messages to 64 characters', done => {
				const msg = faker.lorem.sentences(20);

				client.on('msg', (resUsername, resMsg) => {
					expect(resMsg).to.equal(msg.slice(0, 64));
					done();
				});

				client.emit('join', { username, id, password }, () => {
					client.emit('msg', msg);
				});
			});

			it('should be able to send messages between clients', done => {
				const msg = faker.lorem.sentence(5);
				const username2 = faker.internet.userName();
				const client2 = IOClient(`http://localhost:${PORT}/rooms`);

				client2.on('msg', (_, resMsg) => {
					expect(resMsg).to.equal(msg);
					client2.close();
					done();
				});

				client2.emit('join', { username: username2, id, password }, () => {
					client.emit('join', { username, id, password }, () => {
						client.emit('msg', msg);
					});
				});
			});
		});
	});
});
