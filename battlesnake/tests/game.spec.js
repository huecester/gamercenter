import { describe } from 'mocha';
import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';
import sinon from 'sinon';
import faker from '@faker-js/faker';

import { clearRooms } from '../src/rooms.js'
import app from '../src/app.js';

chai.use(chaiHTTP);


describe('Game page', () => {
	let roomname, password, id, username;

	describe('Joining', () => {
		it('should be able to join a room', () => {

		});

		it('should not be able to join a room that does not exist', () => {

		});

		it('should be able to join a room with a password', () => {

		});

		it('should not be able to join a room with an incorrect password', () => {

		});

		it('should timeout the room after 5 seconds', () => {

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
