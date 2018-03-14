import mongoose from 'mongoose';

import Note from '../models/note';
import NoteCollab from '../models/noteCollab';
import { getUser } from '../../utils/user';

export const getNotes = (req, res, next) => {
  Note.find({ isDeleted: false })
    .populate({
      path: 'author',
      select: 'givenName familyName',
    })
    .exec()
    .then(notes => {
      if (notes.length === 0) {
        return res.status(200).json({
          message: 'There are no notes.',
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
    .select('_id title text author collabs color deleted')
    .exec()
    .then(note => {
      if (note) {
        res.status(200).json({
          note
        });
      } else {
        res.status(404).json({
          message: 'Not found.',
          note: null
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
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.split(' ')[1];

  const newNote = new Note({
    _id: new mongoose.Types.ObjectId(),
    author: getUser(token).id,
    title: req.body.title,
    content: req.body.content,
    color: req.body.color,
});

newNote.save()
  .then(note => {
    res.status(201).json({
      message: 'New note created.',
      note,
    });
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
      ...propsToUpdate,
      updatedAt: new Date()
    }
  }).exec()
    .then(result => {
      Note.findById(id)
        .select('_id title text author collabs color deleted updatedAt')
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
    $set: { deleted: true }
  }).exec()
    .then(result => {
      Note.findById(id)
        .select('_id title text author color')
        .exec()
        .then(note => {
          res.status(200).json({
            message: 'Note deleted.'
          });
        });
    })
    .catch(err => {
      res.status(500).json(err);
    });
};