import { describe } from 'mocha';
import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import faker from '@faker-js/faker';

import app from '../src/app';
import { Room } from '../src/types/room';
import { addRoom, clearRooms } from '../src/store/rooms';

use(chaiHttp);

describe('Rooms', () => {
	let name;

	beforeEach(() => {
		name = faker.lorem.word();
	});

	afterEach(() => {
		clearRooms();
	});

	it('should be able to get rooms', async () => {
		const room = new Room(name);
		addRoom(room);

		const res = await request(app).get('/rooms');
		expect(Object.keys(res.body)).to.have.a.lengthOf(1);
		expect(Object.values(res.body)[0]).to.have.a.property('name')
			.that.is.a('string')
			.that.equals(name);
	});

	it('should be able to create rooms', async () => {
		{
			const res = await request(app).post('/rooms')
				.send({ name });
			expect(res.status).to.equal(201);
		}

		{
			const res = await request(app).get('/rooms');
			expect(Object.keys(res.body)).to.have.a.lengthOf(1);
		}
	});
});
