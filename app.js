var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var passport = require('passport');
var SpotifyStrategy = require('passport-spotify').Strategy
var mongoose = require('mongoose')


var index = require('./routes/index');

var users = require('./routes/users');
var videos = require('./routes/videos');

var show = require('./routes/show')
// var users = require('./routes/users');


var app = express();



     
 
var mongodbUri = 'mongodb://admin:admin@ds155150.mlab.com:55150/dj-mood';
 
mongoose.connect(mongodbUri);
var conn = mongoose.connection;       

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '7mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

app.use('/users', users);
app.use('/videos', videos);

app.use('/show', index)
// app.use('/users', users);

app.use(session({
  secret: "djmooood",
  resave: true,
  saveUninitialized: true
}))

var clientID = '689fd32504d044eb8a4cd79019d5507e',
    clientSecret = '32c9c88bc0f74187802d7e93dfa2ca92'
    callbackURL = 'http://localhost:3000/auth/spotify/callback'

var spotOpts = {
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: callbackURL
}


var spotCallBack = function(accessToken, refreshToken, profile, cb) {
  console.log(profile)
}


passport.use(new SpotifyStrategy(spotOpts, spotCallBack))


app.route('/login')
  .get(passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private']}))




app.route('/auth/spotify/callback')
  .get(passport.authenticate('spotify',  function(err, user, info){
  }))


app.get('/download', function(req,res) {
  res.download('tmp/test.jpg');
})



// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

// passport.use(new SpotifyStrategy({
//     clientID: client_id,
//     clientSecret: client_secret,
//     callbackURL: "http://localhost:8888/auth/spotify/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate({ spotifyId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

conn.on('error', console.error.bind(console, 'connection error:'));  

conn.once('open', function(err) {                                                                                                                                         
  if(err) throw err;
  // Wait for the database connection to establish, then start the app.
  app.listen(5000);                                                          
});

module.exports = app;
