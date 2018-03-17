import mongoose from 'mongoose';

import Schedule from '../models/schedule';
import User from '../models/user';
import { getUser } from '../../utils/user';

export const getSchedules = (req, res, next) => {
  const userId = getUser(req.headers.authorization).id;

  Schedule.find({ user: userId, isDeleted: false })
    .sort('-createdAt')
    .select('-__v')
    .populate({
      path: 'user',
      select: 'givenName familyName',
    })
    .exec()
    .then(schedules => {
      if (schedules.length === 0) {
        return res.status(200).json({
          message: 'There are no schedules.',
          schedules,
        });
      }

      res.status(200).json({
        message: 'Fetched all schedules.',
        schedules
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

export const getSchedule = (req, res, next) => {
  const id = req.params.id;
  const userId = getUser(req.headers.authorization).id;

  Schedule.findOne({ _id: id, user: userId, isDeleted: false })
    .select('-__v')
    .populate({
      path: 'user',
      select: 'givenName familyName',
    })
    .exec()
    .then(schedule => {
      if (schedule) {
        res.status(200).json({
          message: 'Schedule found.',
          schedule,
        });
      } else {
        res.status(404).json({
          message: 'Schedule not found.',
          schedule,
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

export const createSchedule = (req, res, next) => {
  const userId = getUser(req.headers.authorization).id;
  const newSchedule = new Schedule({
    _id: new mongoose.Types.ObjectId(),
    user: userId,
    name: req.body.name,
    description: req.body.description,
    color: req.body.color,
  });

  newSchedule.save()
    .then(schedule => {
      User.update({ _id: userId }, {
        $push: { schedules: schedule._id }
      }).exec()
        .then(result => {
          Schedule.findById(schedule._id)
            .select('-__v')
            .populate({
              path: 'user',
              select: 'givenName familyName',
            })
            .exec()
            .then(schedule => {
              if (schedule) {
                res.status(200).json({
                  message: 'New schedule created.',
                  schedule,
                });
              }
            })
            .catch(err => {
              res.status(500).json({
                error: err
              });
            });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

export const updateSchedule = (req, res, next) => {
  const id = req.params.id;
  let propsToUpdate = {};

  for (let prop in req.body) {
    if (req.body.hasOwnProperty(prop)) {
      propsToUpdate[prop] = req.body[prop];
    }
  }

  Schedule.update({ _id: id }, {
    $set: {
      ...propsToUpdate
    }
  }).exec()
    .then(result => {
      Schedule.findById(id)
        .select('-__v')
        .populate({
          path: 'user',
          select: 'givenName familyName',
        })
        .exec()
        .then(schedule => {
          res.status(200).json({
            message: 'Schedule updated.',
            schedule
          });
        });
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

export const deleteSchedule = (req, res, next) => {
  Schedule.update({ _id: req.params.id }, {
    $set: { isDeleted: true }
  }).exec()
    .then(result => {
      res.status(200).json({
        message: 'Schedule has been deleted.',
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};