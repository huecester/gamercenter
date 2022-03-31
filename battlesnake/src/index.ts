import 'dotenv/config';
import express from 'express';

const port = process.env.PORT || 8000;
const app = express();


app.get('/', (req, res) => {
	res.send('Hello, world!');
});

app.get('/:thing', (req, res) => {
	res.send(`Hello, ${req.params.thing}!`);
});


app.listen(port, () => {
	console.log(`App listening on localhost:${port}.`);
});
