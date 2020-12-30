var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');


// Mongoose setup & options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};
const mongo_url = 'mongodb://localhost:27017/messagedb'
const mongoose = require('mongoose');
var connect = mongoose.connect(mongo_url, options);

// create our app
var app = express();

// init session & passport
var session = require('express-session');
// use session with secret key
app.use(session({secret: 'Very very secret!',
                 resave: true,
                 saveUninitialized: true}));


// require passport and our authentication setup                 
const passport = require('passport');
const authenticate = require('./authenticate');

// init passport
// passport session init
app.use(passport.initialize());
app.use(passport.session());

function auth(req, res, next){
  //console.log(req.headers);
  if (req.user){  // is the user data included in the request?
      next();
  }
  else {
      var err = new Error('Not authenticated!');
      err.status = 403;
      next(err);
  }
}

// Use flash messages (via connect-flash module)
app.use(flash());

var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var usersRouter = require('./routes/users');
var messageRouter = require('./routes/messageRouter');
var commentRouter = require('./routes/commentRouter');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/users', usersRouter);  
app.use(auth); // This checks the authentication, everything after needs auth...
app.use('/messages', messageRouter);
app.use('/comments', commentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
