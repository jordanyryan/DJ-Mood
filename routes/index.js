var express = require('express');
var router = express.Router();
var fs = require('fs');
var $ = require('jquery');
var request = require('request');

/* GET home page */
router.get('/', function(req, res) {
  res.render('index', { title: 'Home', user: req.user });
});

/* GET about page */
router.get('/about', function(req, res) {
  res.render('about', { title: 'About', user: req.user });
});

/* GET video page */
router.get('/video', function(req, res) {
  res.render('video', { title: 'Mood Playlist', user: req.user });
});

/* GET profile page */
router.get('/profile', function(req, res) {
  if(req.user) {
    res.render('profile', { title: 'Profile', user: req.user });
  } else {
    res.redirect('/login');
  }
  
});

/* GET login page */
router.get('/login', function(req, res) {
  res.render('login', { title: 'Log In', user: req.user });
});



router.post('/videos', function(req, res, next) {
  request.post({
    url: ('https://api.kairos.com/v2/media?source=' + req.body.flv),
    headers: {
      app_id: '6d32c141',
      app_key: '6db3ff0a241edbbe3d2b4f2943fb330e'
    }
  }, function(err, res) {
    var idJSON = JSON.parse(res.body);
    console.log('Giving Kairos some time to analyze the results...');
    setTimeout(function() {
      request.get({
        url: ('https://api.kairos.com/v2/analytics/' + idJSON.id),
        headers: {
          app_id: '6d32c141',
          app_key: '6db3ff0a241edbbe3d2b4f2943fb330e'
        }
      }, function(err, res) {
        console.log(res.body); // here we parse the emotions JSON and return one word emotional state
        // pass this word to preferences, get back another word of what kind of music to play
        // pass THAT word to playlist maker to compose playlist
        // pass playlist URI to front end and update the player.
      });
    }, 25000);
  });
});

module.exports = router;