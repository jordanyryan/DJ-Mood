
var express = require('express');
var router = express.Router();
var fs = require('fs');
var $ = require('jquery');
var request = require('request');
var spotify = require('../moodPlaylist');

var kairosBaseCases = {
  happy: {
    joy: 100,
    surprise: 0,
    sadness: 0,
    anger: 0,
    disgust: 0,
    fear: 0
  },
  sad: {
    joy: 0,
    surprise: 0,
    sadness: 100,
    anger: 0,
    disgust: 0,
    fear: 0
  },
  angry: {
    joy: 0,
    surprise: 0,
    sadness: 0,
    anger: 100,
    disgust: 0,
    fear: 0
  },
  bored: {
    joy: 0,
    surprise: 0,
    sadness: 0,
    anger: 0,
    disgust: 0,
    fear: 0
  }
}


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
  let username = req.user.username;
  request.post({
    url: ('https://api.kairos.com/v2/media?source=' + req.body.flv),
    headers: {
      app_id: process.env.KAIROS_APP_ID,
      app_key: process.env.KAIROS_APP_KEY
    }
  }, function(err, res) {
    var idJSON = JSON.parse(res.body);
    console.log('Giving Kairos some time to analyze the results...');
    setTimeout(function() {
      pingUntilAnalyzed(idJSON.id)
      // pass this word to preferences, get back another word of what kind of music to play
      // pass THAT word to playlist maker to compose playlist
      // pass playlist URI to front end and update the player.
    }, 5000);
  });
});

function pingUntilAnalyzed(id) {
  // check if input has been analyzed
  request.get({
    url: ('https://api.kairos.com/v2/analytics/' + id),
    headers: {
      app_id: process.env.KAIROS_APP_ID,
      app_key: process.env.KAIROS_APP_KEY
    }
  }, function(err, res) {
    var responseJSON = JSON.parse(res.body)
    if (responseJSON.impressions) {
      // if response has impressions, return it and move on
      averageEmotions(responseJSON);
    } else {
      // if not, wait 3s and make another request
      console.log("Analyzing...")
      setTimeout(function() {
        pingUntilAnalyzed(id);
      }, 3000);
    };
  })
};

function averageEmotions(emotionalJSON) {
  var impressions = emotionalJSON.impressions.map(function(impression) {
    return(impression.average_emotion);
  });
  var sumOfSadness = impressions.reduce(function(acc, impression) {
    return(acc + impression.sadness);
  }, 0);
  var sumOfJoy = impressions.reduce(function(acc, impression) {
    return(acc + impression.joy);
  }, 0);
  var sumOfAnger = impressions.reduce(function(acc, impression) {
    return(acc + impression.anger);
  }, 0);
  var sumOfSurprise = impressions.reduce(function(acc, impression) {
    return(acc + impression.surprise);
  }, 0);
  var sumOfDisgust = impressions.reduce(function(acc, impression) {
    return(acc + impression.disgust);
  }, 0);
  var sumOfFear = impressions.reduce(function(acc, impression) {
    return(acc + impression.fear);
  }, 0);
  var averageEmotions = {};
  averageEmotions.sadness = sumOfSadness / impressions.length;
  averageEmotions.joy = sumOfJoy / impressions.length;
  averageEmotions.anger = sumOfAnger / impressions.length;
  averageEmotions.disgust = sumOfDisgust / impressions.length;
  averageEmotions.fear = sumOfFear / impressions.length;
  averageEmotions.surprise = sumOfSurprise / impressions.length;
  analyzeKairosOutput(averageEmotions)
}

function analyzeKairosOutput(emotionalJSON) {
  var baseStates = Object.keys(kairosBaseCases);
  var bestMatch = 999999999;
  var newMatch = 0;
  for (var i = 0; i < baseStates.length; i++) {
    var baseState = kairosBaseCases[baseStates[i]];
    var squaredDiffs = []
    squaredDiffs.push((emotionalJSON.joy - baseState.joy) * (emotionalJSON.joy - baseState.joy));
    squaredDiffs.push((emotionalJSON.surprise - baseState.surprise) * (emotionalJSON.surprise - baseState.surprise));
    squaredDiffs.push((emotionalJSON.anger - baseState.anger) * (emotionalJSON.anger - baseState.anger));
    squaredDiffs.push((emotionalJSON.disgust - baseState.disgust) * (emotionalJSON.disgust - baseState.disgust));
    squaredDiffs.push((emotionalJSON.fear - baseState.fear) * (emotionalJSON.fear - baseState.fear));
    squaredDiffs.push((emotionalJSON.sadness - baseState.sadness) * (emotionalJSON.sadness - baseState.sadness));
    var sumOfSquaredDiffs = squaredDiffs.reduce(function(acc, val) {
      return(acc + val);
    }, 0);
    newMatch = Math.sqrt(sumOfSquaredDiffs);
    if (newMatch < bestMatch) {
      bestMatch = newMatch;
      matchingState = baseStates[i]
    }
  }
  spotify.runner(matchingState);
};

module.exports = router;