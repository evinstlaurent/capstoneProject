var express = require('express');
var dotenv = require('dotenv');
var router = express.Router();
dotenv.config()

/* GET user page. */
router.get('/', function(req, res) {
  res.render('user');
});

module.exports = router;
