require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const User = require("./models/user");
const $ = require('jquery');
var LocalStorage = require('node-localstorage').LocalStorage;
if ( typeof localStorage === "undefined" || localStorage === null){
  localStorage = new LocalStorage('./scratch');
}

const expressValidator = require('express-validator')

passport.use(new SpotifyStrategy({
  clientID: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/spotify/callback"
}, function(accessToken, refreshToken, profile, done){
  (console.log(accessToken))
  if (profile.emails) {
  User.findOneAndUpdate({
    email: profile.emails[0].value,
  }, {
    name: profile.displayName,
    email: profile.emails[0].value ,
    username: profile.id,
    accessToken: accessToken
  }, {
    upsert: true
  },
  done);
  } else {
    var noEmailError = new Error("Your email privacy settings prevent you from signing into DJ Mood")
    done(noEmailError, null);
  }
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(userId, done){
  User.findById(userId, done);
});

var routes = require('./routes/index');
var auth = require('./routes/auth')


var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// rendering the preferences for users based on Mood
app.get('/preferences', (req, res) => {
  res.render('preferences');
});

app.use(logger('dev'));
app.use(bodyParser.urlencoded({limit: '7mb', extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(process.env.DB_URI);
var db = mongoose.connection;

var sessionOptions = {
    secret: process.env.DB_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: db})
};

app.use(session(sessionOptions))


app.use(passport.initialize());

app.use(passport.session());

db.on('error', console.error.bind(console, 'connection error:'));

app.use('/', routes);

app.use('/auth', auth);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});

module.exports = app;
