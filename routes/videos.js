var express = require('express');
var request = require('request');
var router = express.Router();
var fs = require('fs');

router.post('/', function(req, res, next) {
	for (var i in req.body) {
		var dataURL = i;
	}
	// decode webcam output to base64 buffer
	var videoBuffer = readBase64Video(dataURL);
	// write buffer contents to 'test.webm'
	var fileName = 'test.webm';
	var wStream = fs.createWriteStream('tmp/' + fileName)
	wStream.write(videoBuffer.data);
	wStream.end();
	// send test.webm to api
	request.post({
		url: ('https://api.kairos.com/v2/media?source=https://immense-wildwood-62744.herokuapp.com/download'),
		headers: {
			'app_id': '6d32c141',
			'app_key': '6db3ff0a241edbbe3d2b4f2943fb330e'
		}
	}, function(error, response, body) {
		console.log(response.headers);
		console.log(response.statusCode); //200 - reaches api fine
		console.log(response.body); //99: unknown errors - ???
	});
	// write data to temp file - DONE
	// send temp file to api - below in /api
	// run thru algorithm to trigger/compile playlists - on /api response
	// get back uri of spotify playlist & return that to hit AJAX .done callback in webcam.js
});

function readBase64Video(data) {
	var matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
	var response = {};
	response.type = matches[1];
	response.data = new Buffer(matches[2], 'base64');
	return response;
};

module.exports = router;