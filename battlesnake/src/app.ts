import express from 'express';
const app = express();

// Setup routes
import roomRouter from './routes/rooms';
app.use('/rooms', roomRouter);

export default app;
