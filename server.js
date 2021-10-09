// Packages
const path = require('path');
const http = require('http');
const express = require('express');
const history = require('connect-history-api-fallback');
const { Server } = require('socket.io');

// Config
const port = process.env.PORT || 8080;


// Express
const app = express();
const server = http.createServer(app);

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


// Socket.IO
const io = new Server(server, {
	serveClient: false,
});
const ioHandlers = require('./src/server/io.js');
ioHandlers.init(io);
ioHandlers.setupOnConnect(io);


// Start server
server.listen(port, () =>{
	console.log(`App listening at http://localhost:${port}.`);
});
