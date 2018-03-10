import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import User from '../models/user';

export const updateUser = (req, res, next) => {
  const id = req.params.id;
  let propsToUpdate = {};

  for (let prop in req.body) {
    if (req.body.hasOwnProperty(prop)) {
      propsToUpdate[prop] = req.body[prop];
    }
  }

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

        console.log(`New user: ${user}`);

        const newToken = jwt.sign(
          {
            id,
            givenName: user.givenName,
            familyName: user.familyName,
            email: user.email
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
};