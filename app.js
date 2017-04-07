var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs')

var index = require('./routes/index');
var users = require('./routes/users');

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
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

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

module.exports = app;
