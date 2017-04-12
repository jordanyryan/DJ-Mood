const express = require('express');
const router = express.Router();
const fs = require('fs');
const $ = require('jquery');
const request = require('request');
const spotify = require('../moodPlaylist');
const passport = require('passport')
const session = require('express-session')
var User = require("../models/user");
var kairosBaseCases = {
  happy: {
    joy: 50,
    surprise: 0,
    sadness: 0,
    anger: 0,
    disgust: 0,
    fear: 0
  },
  sad: {
    joy: 0,
    surprise: 0,
    sadness: 50,
    anger: 0,
    disgust: 0,
    fear: 0
  },
  angry: {
    joy: 0,
    surprise: 0,
    sadness: 0,
    anger: 50,
    disgust: 0,
    fear: 0
  },
  chill: {
    joy: 0,
    surprise: 0,
    sadness: 0,
    anger: 0,
    disgust: 0,
    fear: 0
  },
  stressed: {
    joy: 0,
    surprise: 0,
    sadness: 10,
    anger: 10,
    disgust: 10,
    fear: 10
  }
}

router.get('/playlist', function(req, res) {
  if (!localStorage.getItem('playlistID')) {
    res.status(202).send();
  } else {
    let url = `https://embed.spotify.com/?uri=spotify%3Auser%3A${req.user.username}%3Aplaylist%3A${localStorage.getItem("playlistID")}`
    res.send({
      url: url,
      type: localStorage.getItem('preferenceState')
    });
  }
});

router.get('/', function(req, res) {
    res.render('index', {
        title: 'Home',
        user: req.user
    });
});

router.get('/about', function(req, res) {
    res.render('about', {
        title: 'About',
        user: req.user
    });
});

router.get('/video', function(req, res) {
  if (req.user) {
    let url = `https://embed.spotify.com/?uri=spotify%3Auser%3A${req.user.username}%3Aplaylist%3A${localStorage.getItem("playlistID")}`
    res.render('video', { title: 'Mood Playlist', url: url, user: req.user });
  } else {
    res.redirect('/login');
  }
});

router.get('/profile', function(req, res) {
  if (req.user) {
    res.render('profile', {
      title: 'Profile',
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Log In',
    user: req.user
  });
});

router.post('/profile', (req, res) => {
  if (req.user) {
    var preferences = Object.keys(req.body).map(function(k) {
      return(req.body[k]);
    });
    User.update({_id: req.user.id }, { $set: { preferences: preferences}}, function(req, res) {
    })
    res.redirect('/profile')
  } else {
    res.redirect('/login');
  }
})

router.post('/videos', function(req, res, next) {
  if (req.user) {
    localStorage.removeItem('playlistID');
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
        pingUntilAnalyzed(idJSON.id, req, res)
      }, 5000);
    });
  } else {
    res.redirect('/login');
  }
});

function pingUntilAnalyzed(id, req) {
  request.get({
    url: ('https://api.kairos.com/v2/analytics/' + id),
    headers: {
      app_id: process.env.KAIROS_APP_ID,
      app_key: process.env.KAIROS_APP_KEY
    }
  }, function(err, res) {
    var responseJSON = JSON.parse(res.body)
    if (responseJSON.impressions) {
      return averageEmotions(responseJSON, req);
    } else {
      console.log("Analyzing...")
      setTimeout(function() {
        pingUntilAnalyzed(id, req);
      }, 3000);
    };
  })
};

function averageEmotions(emotionalJSON, req) {
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
  return analyzeKairosOutput(averageEmotions, req)
}

function analyzeKairosOutput(emotionalJSON, req) {
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
  // 0: Happy
  // 1: Sad
  // 2: Angry
  // 3: Relaxed
  // 4: Chill
  switch(matchingState) {
    case 'happy': 
      var preferenceState = req.user.preferences[0]
      break;
    case 'sad':
      var preferenceState = req.user.preferences[1]
      break;
    case 'angry':
      var preferenceState = req.user.preferences[2]
      break;
    case 'relaxed':
      var preferenceState = req.user.preferences[3]
      break;
    case 'chill':
      var preferenceState = req.user.preferences[4]
      break;
  };
  localStorage.setItem('preferenceState', preferenceState)
  spotify.runner([preferenceState, req]);
};

module.exports = router;

