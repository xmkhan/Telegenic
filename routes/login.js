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
          req.session.regenerate(function (err) {
            res.redirect('/user/' + user.id);
          });
        })
        .error(function (err) {
          // User data was invalid!
        });

      }
    }
  );
};

exports.login = function (req, res) {
  if (req.body.user.username && req.body.password) {
    User.login(req.body.user.username, req.body.password, function (found, user) {
      if (found) {
        req.session.regenerate(function (err) {
          res.redirect('/user/' + user.id);
        });
      }
    });
  }
};