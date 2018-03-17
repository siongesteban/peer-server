import mongoose from 'mongoose';

import Schedule from '../models/schedule';
import Appointment from '../models/appointment';

export const createAppointment = (req, res, next) => {
  const scheduleId = req.body.scheduleId;
  const newAppointment = new Appointment({
    _id: new mongoose.Types.ObjectId(),
    parentSchedule: scheduleId,
    description: req.body.description,
    timeStart: req.body.timeStart,
    timeEnd: req.body.timeEnd,
    color: req.body.color,
  });

  newAppointment.save()
    .then(appointment => {
      Schedule.update({ _id: scheduleId }, {
        $push: { appointments: appointment._id }
      }).exec()
        .then(result => {
          Appointment.findById(appointment._id)
            .select('-__v')
            .exec()
            .then(appointment => {
              if (appointment) {
                res.status(200).json({
                  message: 'New appointment created.',
                  appointment,
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

export const updateAppointment = (req, res, next) => {
  const id = req.params.id;
  let propsToUpdate = {};

  for (let prop in req.body) {
    if (req.body.hasOwnProperty(prop)) {
      propsToUpdate[prop] = req.body[prop];
    }
  }

  Appointment.update({ _id: id }, {
    $set: {
      ...propsToUpdate
    }
  }).exec()
    .then(result => {
      Appointment.findById(id)
        .select('-__v')
        .exec()
        .then(appointment => {
          res.status(200).json({
            message: 'Appointment updated.',
            appointment
          });
        });
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

export const deleteAppointment = (req, res, next) => {
  const scheduleId = req.body.scheduleId;
  const appointmentId = req.params.id;

  Appointment.findOneAndRemove(appointmentId)
    .exec()
    .then(result => {
      Schedule.update({ _id: scheduleId }, {
        $pull: { appointments: appointmentId }
      }).exec()
        .then(result => {
          res.status(200).json({
            message: 'Appointment has been deleted.',
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};