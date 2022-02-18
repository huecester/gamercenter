import { describe } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { fs as memfs, vol } from 'memfs';
import fs from 'fs';

import getJS from './getJs.js';

describe('getJS.js', () => {
	let res;

	before(() => {
		sinon.stub(fs, 'readdirSync').callsFake(memfs.readdirSync);
		sinon.stub(fs, 'lstatSync').callsFake(memfs.lstatSync);

		const contents = {
			'./rooms.js': '',
			'./rooms.spec.js': '',
			'./test.js': '',
			'./test.spec.js': '',
			'./nest/one.js': '',
			'./nest/one.spec.js': '',
			'./nest/two.js': '',
			'./nest/two.spec.js': '',
			'./nest/anothernest/epic.js': '',
			'./nest/anothernest/epic.spec.js': '',
		};
		vol.fromJSON(contents, '/routes');
		res = getJS('/routes');
		vol.reset();

		sinon.restore();
	});

	it('should get all (nested) js files in directory', () => {
		expect(res).to.have.members([
			'/routes/test.js',
			'/routes/rooms.js',
			'/routes/nest/one.js',
			'/routes/nest/two.js',
			'/routes/nest/anothernest/epic.js',
		]);
	});

	it('should only get js files', () => {
		for (const file of res) {
			expect(file).to.match(/\.js$/).and.to.not.match(/\.spec\.js$/);
		}
	});
});
