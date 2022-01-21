export function parseDate(date) {
	const year = date.getFullYear().toString().padStart(4, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');

	const hour = date.getHours().toString().padStart(2, '0');
	const minute = date.getMinutes().toString().padStart(2, '0');
	const second = date.getSeconds().toString().padStart(2, '0');

	return ` ${year}/${month}/${day} - ${hour}:${minute}:${second} `;
}

export function parseStatusCode(code) {
	const codeString = code.toString().padEnd(3);
	if (codeString.length !== 3) return codeString;

	let color = '';
	switch (codeString.charAt(0)) {
		case '1':
			color = `\x1b[44m\x1b[37m`;
			break;
		case '2':
			color = `\x1b[42m\x1b[37m`;
			break;
		case '3':
			color = `\x1b[45m\x1b[37m`;
			break;
		case '4':
			color = `\x1b[43m\x1b[37m`;
			break;
		case '5':
			color = `\x1b[41m\x1b[37m`;
			break;
	}
	return `${color} ${codeString.padEnd(3)} \x1b[0m`;
}

export function parseMethod(method) {
	let color = '';
	switch (method) {
		case 'GET':
			color = `\x1b[42m\x1b[37m`;
			break;
		case 'POST':
			color = `\x1b[44m\x1b[37m`;
			break;
		case 'PUT':
			color = `\x1b[46m\x1b[37m`;
			break;
		case 'PATCH':
			color = `\x1b[45m\x1b[37m`;
			break;
		case 'DELETE':
			color = `\x1b[41m\x1b[37m`;
			break;
		case 'HEAD':
			color = `\x1b[47m\x1b[30m`;
			break;
		case 'OPTIONS':
			color = `\x1b[43m\x1b[30m`;
			break;
	}
	return `${color} ${method.padEnd(7)} \x1b[0m`;
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
