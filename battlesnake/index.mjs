import dotenv from 'dotenv';
import Ably from 'ably';
import redis from 'redis';

dotenv.config();

const ably = new Ably.Realtime(process.env.ABLY_API_KEY);
const db = redis.createClient({
	url: 'rediss://:1214dc8284be4bedbb6cd4087994f6db@eu1-lasting-finch-34286.upstash.io:34286',
});
await db.connect();
