import express from 'express';
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));

// Setup routes
import roomRouter from './routes/rooms';
app.use('/rooms', roomRouter);

export default app;
