import { Router } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import passportConfig from '../../config/passport';
import { signUp, logIn, me, verifyToken } from '../controllers/auth';
import User from '../models/user';

const router = Router();

router.post('/signup', signUp);
router.post('/login', logIn);
router.get('/me', verifyToken, me);
router.get('/logout', (req, res, next) => {
  res.status(200).json({
    auth: false,
    token: null
  });
});

export default router;