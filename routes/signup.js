var express = require('express');
var router = express.Router();

/* GET signup page. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'My Message Server', message: 'Please, go ahead and signup...'});
});

module.exports = router;
