// Packages
const path = require('path');
const express = require('express');
const history = require('connect-history-api-fallback');

// Config
const port = process.env.PORT || 8080;


// Init
const app = express();

// API Routes
app.use('/api', require('./src/server/api.js'));

// SPA fallback
const distMiddleware = express.static(path.resolve(__dirname, 'dist'));
const publicMiddleware = express.static(path.resolve(__dirname, 'public'));

app.use(distMiddleware);
app.use(publicMiddleware);
app.use(history({
	disableDotRule: true,
	verbose: true,
}));
app.use(distMiddleware);
app.use(publicMiddleware);

app.listen(port, () =>{
	console.log(`App listening at http://localhost:${port}.`);
});
