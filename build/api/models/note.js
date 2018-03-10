'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var collabSchema = new _mongoose.Schema({
  _id: _mongoose.Schema.Types.ObjectId,
  text: String,
  author: String
});

var noteSchema = new _mongoose.Schema({
  _id: _mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  },
  text: String,
  author: String,
  color: String,
  collabs: {
    type: [collabSchema],
    required: false
  },
  deleted: {
    type: Boolean,
    default: false
  },
  updatedAt: Date
});

exports.default = _mongoose2.default.model('Note', noteSchema);
//# sourceMappingURL=note.js.map