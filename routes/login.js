/**
 * POST - Handle user authenticating
 */
var
User     = require('../models/user'),
util     = require('util'),
bcrypt = require('bcrypt'),
passport = require('../auth/passport'),
step = require('step');

exports.signup = function (req, res) {
  var user;
  step(
    function hashPassword() {
      User.encryptPassword(req.body.password, this);
    },
    function createUser(err, hash) {
      if (err) {
        res.render('signup', { errors: [err] });
      } else {
        var fullName = req.body.full_name.split(" ");

        user = User.build({
          email: req.body.email,
          username: req.body.email,
          password: hash,
          firstName: fullName[0],
          lastName: fullName[fullName.length - 1],
          gender: (req.body.gender === 0) ? false: true,
          birthday: new Date(req.body.year, req.body.month + 1, req.body.day)
        })
        .save()
        .success(function (user) {
          // User data was valid!
          req.logIn(user, function (err) {
            if (!err) return res.redirect('/users/' + user.id);
          });
        })
        .error(function (err) {
          // User data was invalid!
        });
      }
    }
  );
};

exports.login = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (!user) return res.redirect('/login');
    if (req.user.remember_me) {
      // User wants to be kept signed in, grant a session
      req.logIn(user, function (err) {
        if (err) return res.redirect('/login');
        res.redirect('/users' + user.id);
      });
    } else {
      req.session.destroy();
      res.redirect('/users' + user.id);
    }
  })(req, res, next);
};