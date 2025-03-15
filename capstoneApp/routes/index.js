var express = require('express');
var dotenv = require('dotenv');
var router = express.Router();
dotenv.config()

/* default landing page, routes to login page */
router.get('/', function(req, res) {
  res.redirect('/login');
});

module.exports = router;
