var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/', function(req, res, next) {
	for (var i in req.body) {
		var dataURL = i;
	}
	var videoBuffer = readBase64Video(dataURL);
	var fileName = 'test.webm';
	fs.writeFile('tmp/' + fileName, videoBuffer.data, function() {
		res.redirect('/videos/api');
	});
	// write data to temp file - DONE
	// send temp file to api - below in /api
	// run thru algorithm to trigger/compile playlists - on /api response
	// get back uri of spotify playlist & return that to hit AJAX .done callback in webcam.js
});

router.get('/api', function(req, res, next) {
	console.log('redirected to someplace to build request and save the file')
	// build out request
	// on DONE redirect response to run thru kairos matching algorithm
});

function readBase64Video(data) {
	var matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
	var response = {};
	response.type = matches[1];
	response.data = new Buffer(matches[2], 'base64');
	return response;
};

module.exports = router;