"use strict";
const express = require('express');
const router = express.Router();
const request = require('request-promise');
const userAgent = "DJ-Mood-Student-Project-DEVBOOTCAMP-(https://github.com/jordanyryan/DJ-Mood)-tomchang93@gmail.com";
/* GET home page. */
function joiner(str1, str2){
  let res = str1 + '+' + str2;
  return res;
};
function getTracks(callback){
  request({
    url: "http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=sad&api_key=73d2e1e7b7187ac1edc67ee9c7d28b11&format=json&limit=5",
    headers: {
      'User-Agent': userAgent
    },
    json: true
  })
  .then(function(json){
    console.log("running");
    let tracks = json["tracks"]["track"];
    console.log("Grabbed the tracks");
    callback(tracks);
  })
  .catch(function(error){
    console.log(error)
    callback(null);
  })
};

function getIds(tracks, callback){
  let trackUri = []
  let j = 0;
  tracks.forEach( (track) => {
    let title = track["name"];
    let titleJoined = track["name"].split(" ").join("+");
    let artist = track["artist"]["name"];
    request({
      url: ("https://api.spotify.com/v1/search?q=" + titleJoined + "&type=track"),
      json: true
    }).then(function(json){
      let result = null
      let results = json["tracks"]["items"];
      j++
      for (var i = 0; i < results.length; i++ ){
        let compArtist = results[i]["artists"].map((artist) => {
          return artist["name"];
        });
        let compTitle = results[i]["name"];
        if ( (compTitle == title) && (compArtist.includes(artist)) ){
          result = results[i]["uri"];
          trackUri.push(result)
          break;
          // songIds.push(results[i]["id"]);

        };
      };

      if(j === tracks.length){

        callback(trackUri)
      }
    })
      
  })
  // while(array.length === 0){
    
  // }
};

function createPlaylist(trackUri, callback){
  let playlist = null;
  request({
    method: 'POST',
    url: "https://api.spotify.com/v1/users/mrchangman/playlists",
    body: JSON.stringify({
      "description": "JD",
      "public": true,
      "name": "Hi JD"
    }),
    headers: {
      "Authorization": 'Bearer ' + "BQCyWFOR-kLOkGrV8QHIXKGxFSyL7DoR-7IJXccKsfJ1Tj_pqS_3DJFG4voTDr2l2rzNyM8SS9sUzocHO4l1IqfCH-u6RGRDXHwrulHmEDIQoIhF7Imhc_xKsVUTu8nieT2UOIouhm766UcXb5GQYUDgOElexB2Er-9On-mDHgnnJfElA3JqQmaYMWDJRXi4da4",
      'Content-Type': 'application/json'
    }
  },
  function(error, response, body){
    playlist = JSON.parse(body).id
    console.log(playlist)
    callback(playlist)
  });
};

function addTracks(tracks, playlist, callback){
  let songsUrl = tracks.join(',');
  console.log(songsUrl)
  request({
    method: 'POST',
    url: ("https://api.spotify.com/v1/users/mrchangman/playlists/" + playlist + '/tracks?position=0&uris=' + songsUrl),
    headers: {
      "Authorization": 'Bearer ' + "BQCyWFOR-kLOkGrV8QHIXKGxFSyL7DoR-7IJXccKsfJ1Tj_pqS_3DJFG4voTDr2l2rzNyM8SS9sUzocHO4l1IqfCH-u6RGRDXHwrulHmEDIQoIhF7Imhc_xKsVUTu8nieT2UOIouhm766UcXb5GQYUDgOElexB2Er-9On-mDHgnnJfElA3JqQmaYMWDJRXi4da4",
      'Content-Type': 'application/json'
    }
  })
}


function runner(){
  getTracks(function( tracks ){
    console.log("got track")
    getIds(tracks, function(trackUri){
      console.log("got track uri")
      createPlaylist( trackUri, function( playlist ){
        console.log("got playlist")
        addTracks(trackUri, playlist, function(){
          console.log("tracks added")
        })
      })
    });
  })
}
router.get('/', function(req, res, next) {
  runner()
  res.render('index');
});


router.post('/', function(req, res){
})

module.exports = router;
