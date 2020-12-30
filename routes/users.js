var express = require('express');
var router = express.Router();
const User = require('../models/user');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

// Use body-parser to get data from body
router.use(bodyParser.json());

// POST for signup
router.post('/signup', (req, res, next) => {
  console.log('Signup!');
  // Register new user
  User.register(new User({username: req.body.username}), req.body.password, 
      (err, user) => {
          if (err){
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({err: err});
          }
          else {
              // User registration was successful, let's authenticate the user
              /*
              passport.authenticate('local')(req,res, () => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({status: 'Registration successful! User logged in.'});    
              });
              */
             passport.authenticate('local', 
                            { successRedirect: '/messages',
                              failureRedirect: '/',
//                              failureFlash: true},                              
                              failureFlash: 'Incorrect username or password!'},                              
                              )(req, res, () => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({status: 'Registration successful! User logged in.'});                                                 
                              }
                              );
          }
  });
});

// POST for login - data provided in request body (as JSON)
// remember to provide username and password 
router.post('/login', passport.authenticate('local', 
                            { successRedirect: '/messages',
                              failureRedirect: '/',
//                              failureFlash: true},                              
                              failureFlash: 'Incorrect username or password!'},                              
                              ), 
                              (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'User logged in.'});
});



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET for logout
router.get('/logout', (req, res, next)=>{

  if (req.session){
      // user is logged in
      // destroy session
      req.session.destroy();
      console.log('Session has been destroyed!');
      // clear cookie
      res.clearCookie('session-id');
      console.log('Cookie cleared from response.');
      res.redirect('/');
  }
  else {
      // user is not logged in
      var err = new Error('You are not logged in!');
      next(err);
  }

});

module.exports = router;
