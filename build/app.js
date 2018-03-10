'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cookieSession = require('cookie-session');

var _cookieSession2 = _interopRequireDefault(_cookieSession);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

require('dotenv/config');

var _notes = require('./api/routes/notes');

var _notes2 = _interopRequireDefault(_notes);

var _users = require('./api/routes/users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

var app = (0, _express2.default)();
var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  _mongoose2.default.connect('mongodb://localhost/thesis-pwa');
} else if (env === 'production') {
  _mongoose2.default.connect(process.env.MONGO_URL);
}

app.use((0, _morgan2.default)('dev'));

// app.use(cookieSession({
//   maxAge: 24 * 60 * 60 * 1000,
//   keys: ['Ssiioonngg0527__']
// }));

// initialize passport
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');

    return res.status(200).json({});
  }

  next();
});

var isAuthenticated = function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('authenticated');
    next();
  } else {
    console.log('unauthenticated');
    res.status(401).json({
      message: 'UNAUTHORIZED'
    });
  }
};

var apiRouter = (0, _express.Router)();
apiRouter.use('/notes', _notes2.default);
// apiRouter.use('/users', userRoutes);
app.use('/api/v1', apiRouter);

app.get('/', function (req, res, next) {
  res.status(204);
});

app.get('/favicon.ico', function (req, res, next) {
  res.status(204);
});

app.use(function (req, res, next) {
  var error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

exports.default = app;
//# sourceMappingURL=app.js.map