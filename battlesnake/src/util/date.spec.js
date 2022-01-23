import { describe } from 'mocha';
import { expect } from 'chai';
import parseDate from './date.js';

describe('date.js', () => {
	it('should correctly parse dates', () => {
		const parsedDate = parseDate(new Date(1642659898791));
		expect(parsedDate).to.be.a('string').that.matches(/ 2022\/[0-1]\d\/[0-3]\d - [0-2]\d:[0-5]\d:[0-5]\d /i);
	});
});
