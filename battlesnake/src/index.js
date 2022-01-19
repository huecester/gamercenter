import express from 'express';

const port = process.env.PORT;
const app = express();

app.get('/', (req, res) => {
	res.send('Hello, world!');
});

app.listen(port, () => {
	console.log(`App listening on port ${port}.`);
});
