import { describe } from 'mocha';
import { expect } from 'chai';
import { parseMethod, parseStatusCode } from './expressLog.js';

describe('log.js', () => {

	it('should correctly parse methods', () => {
		expect(parseMethod('GET')).to.equal('\x1b[42m\x1b[37m GET     \u001b[39m\u001b[49m');
		expect(parseMethod('POST')).to.equal('\x1b[44m\x1b[37m POST    \u001b[39m\u001b[49m');
		expect(parseMethod('PUT')).to.equal('\x1b[46m\x1b[37m PUT     \u001b[39m\u001b[49m');
		expect(parseMethod('PATCH')).to.equal('\x1b[45m\x1b[37m PATCH   \u001b[39m\u001b[49m');
		expect(parseMethod('DELETE')).to.equal('\x1b[41m\x1b[37m DELETE  \u001b[39m\u001b[49m');
		expect(parseMethod('HEAD')).to.equal('\x1b[47m\x1b[30m HEAD    \u001b[39m\u001b[49m');
		expect(parseMethod('OPTIONS')).to.equal('\x1b[43m\x1b[30m OPTIONS \u001b[39m\u001b[49m');
	});

	it('should correctly parse status codes', () => {
		expect(parseStatusCode(100)).to.equal('\x1b[44m\x1b[37m 100 \u001b[39m\u001b[49m');
		expect(parseStatusCode(200)).to.equal('\x1b[42m\x1b[37m 200 \u001b[39m\u001b[49m');
		expect(parseStatusCode(300)).to.equal('\x1b[45m\x1b[37m 300 \u001b[39m\u001b[49m');
		expect(parseStatusCode(400)).to.equal('\x1b[43m\x1b[37m 400 \u001b[39m\u001b[49m');
		expect(parseStatusCode(500)).to.equal('\x1b[41m\x1b[37m 500 \u001b[39m\u001b[49m');
	});

	it('should not color invalid methods', () => {
		expect(parseMethod('BAZINGA')).to.equal(' BAZINGA ');
	});

	it('should not color invalid status codes', () => {
		expect(parseStatusCode(600)).to.equal(' 600 ');
	});

	it('should pad status codes shorter than 3 digits', () => {
		expect(parseStatusCode(10)).to.equal('\x1b[44m\x1b[37m 10  \u001b[39m\u001b[49m')
		expect(parseStatusCode(69)).to.equal(' 69  ');
	})
});
