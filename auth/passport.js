var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
bcrypt = require('bcrypt'),
cache = require('../store/cache'),
User = require('../models/user');

// Module level constants
var ERROR_MESSAGE = {
  USER_NOT_FOUND: 'Incorrect username & password combination'
};

// Passport session setup
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.find(id)
  .success(function (user) {
    done(null, user);
  })
  .error(function (err) {
    done(err);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]'

}, function (username, password, done) {

  User.find({where: {username : username }})
  .success(function (user) {
    bcrypt.compare(password, user.password, function (err, matched) {
      if (err) done(err);
      if (!matched) done(null, false, { message: ERROR_MESSAGE.USER_NOT_FOUND });
      return done(null, user);
    });
  })
  .error(function (err) { return done(err); });
}));

module.exports = exports = passport;