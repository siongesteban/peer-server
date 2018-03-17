import express, { Router } from 'express';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';

import authRoutes from './api/routes/auth';
import userRoutes from './api/routes/users';
import noteRoutes from './api/routes/notes';
import scheduleRoutes from './api/routes/schedules';
import { verifyToken } from './api/controllers/auth';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL);

const app = express();

app.use(morgan('dev'));

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['Ssiioonngg0527__']
}));

// initialize passport
// app.use(passport.initialize());
// app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

const apiRouter = Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', verifyToken, userRoutes);
apiRouter.use('/notes', verifyToken, noteRoutes);
apiRouter.use('/schedules', verifyToken, scheduleRoutes);
app.use('/api/v1', apiRouter);

app.get('/', (req, res, next) => {
  res.status(204);
});

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

export default app;