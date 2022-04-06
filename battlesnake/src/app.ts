import express from 'express';
import { createServer as createHttpServer } from 'http';
import { Server as IOServer } from 'socket.io';

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));

// Setup routes
import { router as roomRouter } from './routes/rooms';
app.use('/rooms', roomRouter);

export default app;
