import bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import User from '../models/user';

export const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  let token;

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(403).json({
      auth: false,
      token: 'No token provided.'
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        auth: false,
        message: 'Failed to authenticate token.'
      });
    }

    req.userId = decoded.id;
    next();
  });
};

export const signUp = (req, res, next) => {
  User.findOne({ username: req.body.username})
    .exec()
    .then(user => {
      if (user) {
        return res.status(401).json({
          message: 'Username is already taken.'
        });
      }

      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: req.body.password,
      });

      newUser.save()
        .then(user => {
          res.status(201).json({
            message: 'You account has been created.',
            user
          });
        })
        .catch(err => {
          res.status(500).json({
            message: 'An error occured. Please try again.'
          });
        });
    });
};

export const me = (req, res, next) => {
  User.findById(req.userId, (err, user) => {
    if (err) {
      return res.status(500).json({
        message: 'There was a problem finding the user.'
      });
    }

    if (!user) {
      return res.status(400).json({
        message: 'User was not found.'
      });
    }

    res.status(200).json(user);
  });
};

export const logIn = (req, res, next) => {
  User.findOne({ 'username': req.body.username }, (err, user) => {
    if (err) {
      return res.status(500).json({
        message: 'An error occured. Please try again.'
      });
    }

    if (!user) {
      return res.status(404).json({
        message: 'User does not exist.'
      });
    }

    if (!user.comparePassword(req.body.password)) {
      return res.status(401).json({
        auth: false,
        token: null
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        givenName: user.givenName,
        familyName: user.familyName,
        username: user.username
      },
      process.env.SECRET_KEY, {
        expiresIn: 86400
      }
    );

    res.status(200).json({
      auth: true,
      token
    });
  });
};