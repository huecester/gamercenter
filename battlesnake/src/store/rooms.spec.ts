import { describe } from 'mocha';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { addRoom, clearRooms, deleteRoom, getRoom, getSanitizedRooms } from './rooms';

describe('store/rooms', () => {
	let name, password;

	function getFirstID() {
		return Object.keys(getSanitizedRooms())[0];
	}

	function getFirstRoom() {
		return getRoom(getFirstID());
	}

	beforeEach(() => {
		name = faker.lorem.word();
		password = faker.internet.password();
	});

	afterEach(() => {
		clearRooms();
	});

	it('should be able to add and get rooms', () => {
		addRoom({ name, password });
		const room = getFirstRoom();
		expect(room).to.be.an('object');
		expect(room).to.have.a.property('name').that.equals(name);
		expect(room).to.have.a.property('password').that.equals(password);
	});

	it('should be able to delete rooms', () => {
		addRoom({ name, password });
		const id = getFirstID();
		deleteRoom(id);
		expect(Object.keys(getSanitizedRooms())).to.have.a.lengthOf(0);
	});

	it('should not be able to delete nonexistant rooms', () => {
		addRoom({ name, password });
		deleteRoom('gaming');
		expect(Object.keys(getSanitizedRooms())).to.have.a.lengthOf(1);
	});

	it('should be able to clear all rooms', () => {
		for (let i = 0; i < 10; i++) {
			addRoom({
				name: faker.lorem.word(),
				password: faker.internet.password(),
			});
		}
		expect(Object.keys(getSanitizedRooms())).to.have.a.lengthOf(10);

		clearRooms();
		expect(Object.keys(getSanitizedRooms())).to.have.a.lengthOf(0);
	});
});
