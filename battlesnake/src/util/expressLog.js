import chalk from 'chalk';
import parseDate from './date.js';

export function parseStatusCode(code) {
	const codeString = code.toString().padEnd(3);
	if (codeString.length !== 3) return codeString;

	let color = str => str;
	switch (codeString.charAt(0)) {
		case '1':
			color = chalk.bgBlue.white;
			break;
		case '2':
			color = chalk.bgGreen.white;
			break;
		case '3':
			color = chalk.bgMagenta.white;
			break;
		case '4':
			color = chalk.bgYellow.white;
			break;
		case '5':
			color = chalk.bgRed.white;
			break;
	}
	return color(` ${codeString.padEnd(3)} `);
}

export function parseMethod(method) {
	let color = str => str;
	switch (method) {
		case 'GET':
			color = chalk.bgGreen.white;
			break;
		case 'POST':
			color = chalk.bgBlue.white;
			break;
		case 'PUT':
			color = chalk.bgCyan.white;
			break;
		case 'PATCH':
			color = chalk.bgMagenta.white;
			break;
		case 'DELETE':
			color = chalk.bgRed.white;
			break;
		case 'HEAD':
			color = chalk.bgWhite.black;
			break;
		case 'OPTIONS':
			color = chalk.bgYellow.black;
			break;
	}
	return color(` ${method.padEnd(7)} `);
}

export default function logger(req, res, next) {
	// [REST] yyyy/mm/dd - HH:mm:ss | 200 | 111.111.111.111 | GET      "/path"
	const msg = ['[REST] '];
	msg.push(parseDate(new Date()));
	msg.push(parseStatusCode(res.statusCode));
	msg.push(` ${(req.header('x-forwarded-for') || req.connection.remoteAddress).padEnd(15)} `);
	msg.push(`${parseMethod(req.method)} ${req.url}`);

	console.log(msg.join('|'))
	next();
}
