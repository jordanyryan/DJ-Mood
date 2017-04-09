var express = require('express');
var router = express.Router();
var request = require('request');
/* GET home page. */
function joiner(str1, str2){
  var res = str1 + '+' + str2;
  return res;
};
router.get('/', function(req, res, next) {
  songIds = [];
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
            console.log(results[i]["id"]);
            break;
          };
        }
      })
    })
  })
  joinedIds = songIds.join(",")
  console.log(joinedIds);
  res.render('index');
});

router.post('/', function(req, res){
  request({
    method: 'POST',
    uri: "https://api.spotify.com/v1/users/mrchangman/playlists",
    
  })
})

module.exports = router;
