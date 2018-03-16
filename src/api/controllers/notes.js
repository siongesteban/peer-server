import mongoose from 'mongoose';

import Note from '../models/note';
import User from '../models/user';
import { getUser } from '../../utils/user';

export const getNotes = (req, res, next) => {
  const userId = getUser(req.headers.authorization).id;

  Note.find({ author: userId, isDeleted: false })
    .sort('-createdAt')
    .select('-__v')
    .populate({
      path: 'author',
      select: 'givenName familyName',
    })
    .exec()
    .then(notes => {
      if (notes.length === 0) {
        return res.status(200).json({
          message: 'There are no notes.',
          notes,
        });
      }

      res.status(200).json({
        message: 'Fetched all notes.',
        notes
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

export const getNote = (req, res, next) => {
  const id = req.params.id;

  Note.findById(id)
    .select('-__v')
    .populate({
      path: 'author',
      select: 'givenName familyName',
    })
    .exec()
    .then(note => {
      if (note) {
        res.status(200).json({
          message: 'Note found.',
          note,
        });
      } else {
        res.status(404).json({
          message: 'Not found.',
          note,
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

export const createNote = (req, res, next) => {
  const userId = getUser(req.headers.authorization).id;
  const newNote = new Note({
    _id: new mongoose.Types.ObjectId(),
    author: userId,
    title: req.body.title,
    content: req.body.content,
    color: req.body.color,
  });

  newNote.save()
    .then(note => {
      User.update({ _id: userId }, {
        $push: { notes: note._id }
      }).exec()
        .then(result => {
          Note.findById(note._id)
            .select('-__v')
            .populate({
              path: 'author',
              select: 'givenName familyName',
            })
            .exec()
            .then(note => {
              if (note) {
                res.status(200).json({
                  message: 'New not created.',
                  note,
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

export const updateNote = (req, res, next) => {
  const id = req.params.id;
  let propsToUpdate = {};

  for (let prop in req.body) {
    if (req.body.hasOwnProperty(prop)) {
      propsToUpdate[prop] = req.body[prop];
    }
  }

  Note.update({ _id: id }, {
    $set: {
      ...propsToUpdate
    }
  }).exec()
    .then(result => {
      Note.findById(id)
        .exec()
        .then(note => {
          res.status(200).json({
            message: 'Note updated.',
            note
          });
        });
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

export const deleteNote = (req, res, next) => {
  Note.update({ _id: req.params.id }, {
    $set: { isDeleted: true }
  }).exec()
    .then(result => {
      res.status(200).json({
        message: 'Note has been deleted.',
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};