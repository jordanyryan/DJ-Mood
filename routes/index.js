var express = require('express');
var router = express.Router();
var fs = require('fs');
var $ = require('jquery');
var request = require('request');
var spotify = require('../moodPlaylist');
var User = require("../models/user");

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
    res.render('index', {
        title: 'Home',
        user: req.user
    });
});

/* GET about page */
router.get('/about', function(req, res) {
    res.render('about', {
        title: 'About',
        user: req.user
    });
});

/* GET video page */
router.get('/video', function(req, res) {
    res.render('video', {
        title: 'Mood Playlist',
        user: req.user
    });
});

/* GET profile page */
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

/* GET login page */
router.get('/login', function(req, res) {
    res.render('login', {
        title: 'Log In',
        user: req.user
    });
});

router.post('/profile', (req, res) => {
    console.log(req.user.email)
    let preferences = (Object.values(req.body))
    User.update({_id: req.user.id }, { $set: { preferences: preferences}}, function(req, res){
      console.log(res)
      console.log(req)
    })
    res.redirect('/profile')
  })


    router.post('/videos', function(req, res, next) {
        let username = req.user.username;
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

                    var emotionalJSON = JSON.parse(res.body);
                    console.log(emotionalJSON.impressions);
                    var userState = emotionalJSON.impressions[0].average_emotion
                    console.log('Your emotions (this will be compared to our baselines):', userState);
                    var baseStates = Object.keys(kairosBaseCases);
                    console.log('Comparing to:', baseStates);
                    var bestMatch = 999999999;
                    var newMatch = 0;
                    for (var i = 0; i < baseStates.length; i++) {
                        var baseState = kairosBaseCases[baseStates[i]];
                        var squaredDiffs = []
                        for (var j = 0; j < 6; j++) {
                            squaredDiffs.push((userState.joy - baseState.joy) * (userState.joy - baseState.joy));
                            squaredDiffs.push((userState.surprise - baseState.surprise) * (userState.surprise - baseState.surprise));
                            squaredDiffs.push((userState.anger - baseState.anger) * (userState.anger - baseState.anger));
                            squaredDiffs.push((userState.disgust - baseState.disgust) * (userState.disgust - baseState.disgust));
                            squaredDiffs.push((userState.fear - baseState.fear) * (userState.fear - baseState.fear));
                            squaredDiffs.push((userState.sadness - baseState.sadness) * (userState.sadness - baseState.sadness));
                        }
                        var sumOfSquaredDiffs = squaredDiffs.reduce(function(acc, val) {
                            return (acc + val);
                        }, 0);
                        newMatch = Math.sqrt(sumOfSquaredDiffs);
                        if (newMatch < bestMatch) {
                            bestMatch = newMatch;
                            matchingState = baseStates[i]
                        }
                    }
                    spotify.runner(matchingState);
                    // here we parse the emotions JSON and return one word emotional state
                    // pass this word to preferences, get back another word of what kind of music to play
                    // pass THAT word to playlist maker to compose playlist
                    // pass playlist URI to front end and update the player.
                });
            }, 25000);
        });
    });

    module.exports = router;
