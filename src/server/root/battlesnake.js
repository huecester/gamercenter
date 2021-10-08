const router = require('express').Router();

router.get('/', (req, res) => {
	res.json({
		text: 'Hello, battlesnake!',
	});
});

module.exports = {
	router,
	io: {
		onConnect(io, socket) {
			console.log('Connect.');
			socket.emit('message', 'Hello, world!');
			socket.on('disconnect', () => {
				console.log('Disconnect.');
			});
		},
	},
};
