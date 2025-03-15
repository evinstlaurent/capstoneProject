var express = require('express');
var dotenv = require('dotenv');
var router = express.Router();
dotenv.config()

/* GET recipes page. */
router.get('/', function(req, res) {
  res.render('recipes');
});

module.exports = router;
