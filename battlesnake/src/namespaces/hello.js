export function init() {
	console.log('Initializing...');
	console.log('Hello, world!');
	console.log('Done.');
}

export function onConnection(socket) {
	console.log('Hello, socket!');
	socket.emit('msg', 'Hello!');
	socket.disconnect();
}
