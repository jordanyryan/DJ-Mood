var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
	var video = JSON.parse(req.body);
	// write data to temp file
	// send temp file to api (use SDK)
	// parse response if necessary
	// run thru algorithm to trigger/compile playlists
	// get back uri of spotify playlist & return that to hit AJAX .done callback in webcam.js
});

module.exports = router;