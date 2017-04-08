var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/user/me', function(req, res, next) {
  res.render('show', {})
}

module.exports = router;


