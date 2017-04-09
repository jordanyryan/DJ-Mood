var express = require('express');
var router = express.Router();
var request = require('request');
/* GET home page. */
function joiner(str1, str2){
  var res = str1 + '+' + str2;
  return res;
};
router.get('/', function(req, res, next) {
  res.render('index');
});

var songIds = [];
var playlistID = null;
router.post('/', function(req, res){
var songIds = [];
var playlistID = null;
  request({url: "http://musicovery.com/api/V4/playlist.php?&fct=getfromtag&tag=sad&format=json&popularitymin=0&yearmin=2000", json: true}, function(error, res, json){
    if (error) {
      throw error;
    }
    let tracks = json["root"]["tracks"]["track"];

    tracks.forEach((track) => {
      let title = track["title"]
      let titleJoined = track["title"].split(" ").join("+") ;
      let artist = track["artist"]["name"];
      request({url: ("https://api.spotify.com/v1/search?q=" + titleJoined + "&type=track"), json: true }, function(error, res, json){
        if (error){
          throw error;
        };
        if (!json["tracks"]){
          return;
        };
        let results = json["tracks"]["items"];
        for (i = 0; i < results.length; i++ ){
          let compArtist = results[i]["artists"].map((artist) => {
            return artist["name"];
          });
          let compTitle = results[i]["name"];
          if ( (compTitle = title) && (compArtist.includes(artist)) ){
            songIds.push(results[i]["id"]);
            break;
          };
        }
      })
    })
  })
  console.log(songIds);
  request({
    method: 'POST',
    url: "https://api.spotify.com/v1/users/mrchangman/playlists",
    body: JSON.stringify({
      "description": "JD",
      "public": true,
      "name": "Hi JD"
    }),
    headers: {
      "Authorization": 'Bearer ' + "BQDkzU8gZm3aqixE1xXTelIzl9jK-bGNSoun9xUP8DH0Y6tAlTChaN3nzeVYP9NwtyJdFvSirw8RUijRZXVgweD68wq58yOb65RsjO4BZHpYHh2JURR5JP_hiRT10Rq9WnCoe6zO2kJb-G2MIHr73-__oSZ_4tyiiVOLH5T9zjmQNtBDvxKjNUiAYXaX8Zfsyzo",
      'Content-Type': 'application/json'
    }
  },
  function(error, response, body){
    playlistID = JSON.parse(body).id
  });
  console.log(playlistID, "asdgfsdgkarjtjghdfgsebasergqfbdajfeaeugbjdvsfews")
  console.log(songIds);
  let songsUrl = "/tracks?position=0&uris=spotify3%Atrack3%A" + songIds.join(",spotify3%Atrack3%A")
  console.log(songsUrl);
  request({
    method: 'POST',
    url: "https://api.spotify.com/v1/users/mrchangman/playlists" + playlistID + songsUrl ,
    headers: {
      "Authorization": 'Bearer ' + "BQDkzU8gZm3aqixE1xXTelIzl9jK-bGNSoun9xUP8DH0Y6tAlTChaN3nzeVYP9NwtyJdFvSirw8RUijRZXVgweD68wq58yOb65RsjO4BZHpYHh2JURR5JP_hiRT10Rq9WnCoe6zO2kJb-G2MIHr73-__oSZ_4tyiiVOLH5T9zjmQNtBDvxKjNUiAYXaX8Zfsyzo",
      'Content-Type': 'application/json'
    }
  }
  
  )
  console.log("yay")

})

module.exports = router;
