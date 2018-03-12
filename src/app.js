import express, { Router } from 'express';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import {} from 'dotenv/config';

import authRoutes from './api/routes/auth';
import noteRoutes from './api/routes/notes';
import userRoutes from './api/routes/users';
import { verifyToken } from './api/controllers/auth';

mongoose.Promise = global.Promise;

const app = express();

mongoose.connect('mongodb://stdnt-io:Ssiioonngg0527__@ds249398.mlab.com:49398/stdnt-io');

app.use(morgan('dev'));

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['Ssiioonngg0527__']
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');

//     return res.status(200).json({});
//   }

//   next();
// });

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }

  res.status(401).json({
    message: 'UNAUTHORIZED'
  });
};

const apiRouter = Router();
apiRouter.use('/notes', verifyToken, noteRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', verifyToken, userRoutes);
app.use('/api/v1', apiRouter);

app.get('/', (req, res, next) => {
  res.status(204);
})

app.get('/favicon.ico', (req, res, next) => {
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