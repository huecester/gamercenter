import { describe } from 'mocha';
import { expect } from 'chai';
import genID from './id.js';

describe('id.js', function () {
	it('should generate length 8 hex strings', function () {
		for (let i = 0; i < 10; i++) {
			let id = genID();
			expect(id).to.be.a('string').with.length(8).and.to.match(/^[0-9a-f]{8}$/i);
		}
	});
});
