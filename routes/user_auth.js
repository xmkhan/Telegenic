/**
 * POST - Handle user authenticating
 */
var crypto = require('crypto'),
 User = require('../models/user').User,
 userLogin = require('../models/user').LoginManager,
 userPages =  require('./user.js');

// Module level constants
var BCRPYT_SALT_ROUNDS = 10;

exports.signup = function (req, res) {

    var user = new User({
        username: req.body.username,
        password: req.body.password,
        first_name: req.bodyfirst_name,
        last_name: req.body.last_name,
        email: req.body.email,
        gender: req.body.gender,
        birth_date: req.body.birth_date
    });

    user.save();
    req.session.userID = user.id;
    req.session.regenerate(function (err) {
        if (err) {
            res.redirect('/login');
        } else {
            res.redirect('/home/' + user.id);
        }
    });
};

exports.login = function (req, res) {
    if (req.sessionID) {
        req.sessionStore.get(req.sessionID, function (err, session) {
            if (!err && session && session.userID) {
                var user_id = session.userID;
                res.redirect('/home/' + user_id);
            }
        });

        userLogin(req.body.username, req.body.password, function (err, user) {
            // Grab user contents
        });
    }
};