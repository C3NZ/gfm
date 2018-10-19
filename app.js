var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const teamsRouter = require('./routes/teams');
const profilesRouter = require('./routes/profiles')

if(!process.env.PORT) {
    require('dotenv').config()
}

if(process.env.DEBUG_MODE){
    process.env.GITHUB_CLIENT_ID = process.env.TEST_CLIENT_ID;
    process.env.GITHUB_CLIENT_SECRET = process.env.TEST_CLIENT_SECRET
    //process.env.callbackURL = "https://aaa3c099.ngrok.io/login"
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/gitforme' )

const User = require('./models/user')

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.callbackURL || "http://localhost:3000/login/callback"
}, (accessToken, refreshToken, profile, cb) => {
    //Find the user that authenticated or create them in our database
    User.find({githubID: profile.id}).then(user => {
        if (!user.length) {
            var newProfile = {
                githubID: profile.id,
                username: profile.username,
                displayName: profile.displayName,
                accessToken: accessToken
            }
            User.create(newProfile).then(newUser => {
                return cb(null, newUser)
            }).catch(err => {
                return cb(err, null)
            })
        }else {
            return cb(null, user)
        }
    }).catch(err => {
        console.log('here')
        return cb(err, null);
    });
}));

passport.serializeUser(function(user, done) {
    console.log(user)
    done(null, user[0]._id);
});

passport.deserializeUser(function(id, done) {
  User.find({githubID: id}).then(function (err, user) {
    done(err, user);
  });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'cenz', save: true, resave: true, store: new MongoStore({mongooseConnection: mongoose.connection})}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', authRouter);
app.use('/teams', teamsRouter);
app.use('/profile', profilesRouter);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
