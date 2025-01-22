// src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import restaurantRouter from './routes/v1/restaurant';
import userRouter from './routes/v1/user';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const API_PREFIX = '/v1';

app.use(express.json());
app.use(`${API_PREFIX}/restaurant`, restaurantRouter);
app.use(`${API_PREFIX}/user`, userRouter);

const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';
const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL!)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running at http://${HOST}:${PORT}${API_PREFIX}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });