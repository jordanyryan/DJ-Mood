const url = "https://musicovery.com/api/V4/playlist.php?&fct=getfromtag&tag=sad&format=json&popularitymin=0&yearmin=2000";
fetch(url).then(function(data){
  console.log(data)
})
