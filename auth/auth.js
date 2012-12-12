var passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy,
 util = require('util'),
 cache = require('../store/cache').client,
 User = require('../models/user');

// Module level constants
var USER_NOT_FOUND_MSG = 'Incorrect username & password combination';

// Passport session setup
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'

}, function (username, password, done) {
    User.findByUsernameAndPassword(username, password, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, { message: USER_NOT_FOUND_MSG});
        return done(null, user);
    });
}));

module.exports.passport = passport;