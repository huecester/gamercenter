import parseDate from './date.js';

export default function logger(socket, [event, ...args], next) {
	// [IO] yyyy/mm/dd - HH:mm:ss | 111.111.111.111 | event           => data
	const msg = ['[IO] '];
	msg.push(parseDate(new Date()));
	msg.push(` ${socket.request.connection.remoteAddress.padEnd(15)} `);
	msg.push(` ${event.padEnd(16)} => ${args.slice(0, -1).join(' | ')}`)

	console.log(msg.join('|'));
	next();
}
