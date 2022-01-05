import dotenv from 'dotenv';
import Ably from 'ably';

dotenv.config();

const ably = new Ably.Realtime(process.env.ABLY_API_KEY);
const channel = ably.channels.get('messages');

channel.subscribe('msg', msg => {
	console.log('Received message:', msg);
});

ably.connection.on('connected', () => {
	console.log('Connected to channel.');
	channel.publish('msg', 'Hello, world!');
});
