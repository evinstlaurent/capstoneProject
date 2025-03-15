var express = require('express');
var dotenv = require('dotenv');
var router = express.Router();
dotenv.config()

/* GET login page. */
router.get('/', function(req, res) {
  res.render('login');
});

module.exports = router;
