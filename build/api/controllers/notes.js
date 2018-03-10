'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNote = exports.getNotes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _note = require('../models/note');

var _note2 = _interopRequireDefault(_note);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getNotes = exports.getNotes = function getNotes(req, res, next) {
  _note2.default.find({ deleted: false }).select('_id title text author color collabs deleted').exec().then(function (notes) {
    res.status(200).json({
      message: 'Fetched all notes.',
      notes: notes
    });
  }).catch(function (err) {
    res.status(500).json({
      error: err
    });
  });
};

var getNote = exports.getNote = function getNote(req, res, next) {
  var id = req.params.id;

  _note2.default.findById(id).select('_id title text author collabs color deleted').exec().then(function (note) {
    if (note) {
      res.status(200).json({
        message: 'Not found.',
        note: note
      });
    } else {
      res.status(404).json(null);
    }
  }).catch(function (err) {
    res.status(500).json({
      error: err
    });
  });
};

var createNote = exports.createNote = function createNote(req, res, next) {
  var newNote = new _note2.default({
    _id: new _mongoose2.default.Types.ObjectId(),
    title: req.body.title,
    text: req.body.text,
    author: req.body.author,
    color: req.body.color,
    collabs: req.body.collabs
  });

  newNote.save().then(function (note) {
    res.status(201).json({
      message: 'New note created.',
      note: {
        _id: note._id,
        title: note.title,
        text: note.text,
        author: note.author,
        color: note.color
      }
    });
  }).catch(function (err) {
    res.status(500).json({
      error: err
    });
  });
};

var updateNote = exports.updateNote = function updateNote(req, res, next) {
  var id = req.params.id;
  var propsToUpdate = {};

  for (var prop in req.body) {
    if (req.body.hasOwnProperty(prop)) {
      propsToUpdate[prop] = req.body[prop];
    }
  }

  _note2.default.update({ _id: id }, {
    $set: _extends({}, propsToUpdate, {
      updatedAt: new Date()
    })
  }).exec().then(function (result) {
    _note2.default.findById(id).select('_id title text author collabs color deleted updatedAt').exec().then(function (note) {
      res.status(200).json({
        message: 'Note updated.',
        note: note
      });
    });
  }).catch(function (err) {
    res.status(500).json(err);
  });
};

var deleteNote = exports.deleteNote = function deleteNote(req, res, next) {
  _note2.default.update({ _id: req.params.id }, {
    $set: { deleted: true }
  }).exec().then(function (result) {
    _note2.default.findById(id).select('_id title text author color').exec().then(function (note) {
      res.status(200).json({
        message: 'Note deleted.'
      });
    });
  }).catch(function (err) {
    res.status(500).json(err);
  });
};
//# sourceMappingURL=notes.js.map