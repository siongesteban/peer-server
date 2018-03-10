'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _notes = require('../controllers/notes');

var api = (0, _express.Router)();

api.get('/', _notes.getNotes);
api.get('/:id', _notes.getNote);
api.post('/', _notes.createNote);
api.patch('/:id', _notes.updateNote);
api.delete('/:id', _notes.deleteNote);

exports.default = api;
//# sourceMappingURL=notes.js.map