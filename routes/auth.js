const express = require('express')
const router = express.Router();
const passport = require('passport')

router.get('/login/spotify',
  passport.authenticate('spotify', {scope: 'user-read-email user-read-private playlist-modify-public playlist-modify-private'})
);
 
router.get('/spotify/callback',
  passport.authenticate('spotify', {failureRedirect: '/'}),
  function(req, res) {
  res.redirect('/profile');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;