require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var SpotifyStrategy = require('passport-spotify').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var User = require("./models/user");
var $ = require('jquery');
var expressValidator = require('express-validator')



passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/spotify/callback"
}, function(accessToken, refreshToken, profile, done) {

    if (profile.emails) {
        User.findOneAndUpdate({
            email: profile.emails[0].value
        }, {

            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.id,
            preferences: []
        }, {
            upsert: true
        }, done);
    } else {
        var noEmailError = new Error("Your email privacy settings prevent you from signing into DJ Mood")
        done(noEmailError, null);
    }

}));



passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(userId, done) {
    User.findById(userId, done);
});
var routes = require('./routes/index');
var auth = require('./routes/auth')


var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/preferences', (req, res) => {
    res.render('preferences');
})

app.use(bodyParser.json());


app.use(logger('dev'));
app.use(bodyParser.urlencoded({limit: '7mb', extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.DB_URI);
var db = mongoose.connection;

//Session config for passport
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
