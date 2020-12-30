var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Message Server', message: 'May the force be with you... always!'});
});

module.exports = router;
