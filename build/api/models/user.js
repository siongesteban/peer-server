'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = new _mongoose.Schema({
  firstName: String,
  lastName: String,
  googleId: String
});

exports.default = _mongoose2.default.model('User', userSchema);
//# sourceMappingURL=user.js.map