import express from 'express';
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));

// Setup routes
import { router as roomRouter } from './routes/rooms';
app.use('/rooms', roomRouter);

export default app;
