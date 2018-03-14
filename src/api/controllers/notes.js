import mongoose from 'mongoose';

import Note from '../models/note';
import User from '../models/user';
import { getUser } from '../../utils/user';

export const getNotes = (req, res, next) => {
  const userId = getUser(req.headers.authorization).id;

  Note.find({ 'author': userId })
    .select('-collaborators -__v')
    .populate({
      path: 'author',
      select: 'givenName familyName',
    })
    .populate({
      path: 'collabs',
      select: '-isPartOfCollab -collaborators -collabs -tags -isDeleted -__v',
      populate: {
        path: 'author',
        select: 'givenName familyName'
      }
    })
    .populate({
      path: 'parentNote',
      select: '-isPartOfCollab -collaborators -isDeleted -__v',
      populate: [
          {
            path: 'collabs',
            select: '-isPartOfCollab -parentNote -collaborators -collabs -tags -isDeleted -__v',
          },
          {
            path: 'author',
            select: 'givenName familyName',
          }
      ]
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
          res.status(201).json({
            message: 'New note created.',
            note,
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

export const createNoteCollab = (req, res, next) => {
  const authUserEmail = getUser(req.headers.authorization).email;

  // Find the user by email to get its id.
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: 'Could not find the user.',
        });
      }

      if (user.email === authUserEmail) {
        return res.status(403).json({
          message: `You're already part of the note.`,
        });
      }

      // Find the parent note first and determine
      // if the user is already a part of the collaboration.
      Note.findOne({ _id: req.body.parentNoteId, collaborators: user._id })
        .exec()
        .then(parentNote => {
          // Check if the user is already included in the collaborators
          console.log(parentNote);
          if (parentNote) {
            return res.status(403).json({
              message: 'The user is already a collaborator.',
            });
          }

          // Proceed on creating a new note for the new collaborator

          // Fill the initial fields
          const newCollabNote = new Note({
            _id: new mongoose.Types.ObjectId(),
            author: user._id,
            parentNote: req.body.parentNoteId,
            isPartOfCollab: true,
          });
    
          newCollabNote.save()
            .then(note => {
              // After saving, push the new note's id
              // to the user's notes field
              User.update({ _id: user._id }, {
                $push: { notes: note._id }
              }).exec()
                .then(result => {
                  // Update the parent note by pushing the
                  // collab note's id and collaborator's id
                  Note.update({ _id: req.body.parentNoteId }, {
                    $push: {
                      collaborators: user._id,
                      collabs: note._id,
                    }
                  }).exec()
                    .then(result => {
                      res.status(200).json({
                        message: 'The note has been shared to the user.',
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
            });
        })
        .catch(err => {
          return res.status(500).json({
            error: err,
          });
        });
    })
    .catch(err => {
      return res.status(500).json({
        error: err,
      });
    })
}

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