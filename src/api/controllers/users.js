import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import titleize from 'titleize';

import User from '../models/user';

export const getUsers = (req, res, next) => {
  User.find({})
    .exec()
    .then(users => {
      res.status(200).json({
        message: 'Fetched all users.',
        users
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

export const updateUser = (req, res, next) => {
  const id = req.params.id;

  if (!req.body.newPassword) {
    req.body = {
      ...req.body,
      givenName: titleize(req.body.givenName),
      familyName: titleize(req.body.familyName),
    };
  }

  let propsToUpdate = {};

  for (let prop in req.body) {
    if (req.body.hasOwnProperty(prop)) {
      propsToUpdate[prop] = req.body[prop];
    }
  }

  if (req.body.newPassword) {
    User.findById(id)
      .exec()
      .then(user => {
        if (!user.comparePassword(req.body.password)) {
          return res.status(401).json({
            message: 'Password is invalid.'
          });
        } else {
          if (user.comparePassword(req.body.newPassword)) {
            return res.status(401).json({
              message: `You can't use your existing password.`
            });
          }

          user.password = req.body.newPassword;
          user.save()
            .then(user => {
              return res.status(200).json({
                message: 'Your password has been updated.'
              });
            })
            .catch(err => {
              return res.status(500).json({
                message: 'Unable to update your password.'
              });
            });
        }
      })
      .catch(err => {
        return res.status(500).json({
          message: 'An error occured. Please try again.'
        });
      })
  } else {
    User.update({ _id: id }, {
      $set: {
        ...propsToUpdate
      }
    }).exec()
      .then(result => {
        User.findById(id)
        .exec()
        .then(user => {
          if (!user) {
            return res.status(404).json({
              message: 'User does not exist.'
            });
          }
  
          const newToken = jwt.sign(
            {
              id,
              givenName: user.givenName,
              familyName: user.familyName,
              username: user.username
            },
            process.env.SECRET_KEY, {
              expiresIn: 86400
            }
          );
  
          res.status(200).json({
            message: 'Your profile has been updated.',
            newToken
          });
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'An error occured. Please try again.'
        });
      });
  }
};