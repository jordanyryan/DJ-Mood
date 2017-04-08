var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var passport = require('passport');
var SpotifyStrategy = require('passport-spotify').Strategy


var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://admin:admin@ds155150.mlab.com:55150/dj-mood', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000,() => {
    console.log('listening on port 3000')
  })
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
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
  console.log(accessToken, refreshToken, profile, cb)
}


passport.use(new SpotifyStrategy(spotOpts, spotCallBack))


app.route('/login')
  .get(passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private']}))




app.route('/auth/spotify/callback')
  .get(passport.authenticate('spotify',  function(err, user, info){
  }))




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

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


module.exports = app;
