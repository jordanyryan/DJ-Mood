var express = require('express')
var router = express.Router();
var passport = require('passport')


//GET /auth/login/spotify

router.get('/login/spotify',
  passport.authenticate('spotify'));


//GET /auth/spotify/callback

router.get('/spotify/callback',
  passport.authenticate('spotify', {failureRedirect: '/'}),
  function(req, res) {
    // Success auth, redirect to profile page
    res.redirect('/profile');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;