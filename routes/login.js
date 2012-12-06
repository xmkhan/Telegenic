/**
 * POST - Handle user authenticating
 */
var crypto = require('crypto'),
 User = require('../models/user'),
BCRPYT_SALT_ROUNDS  = require('../models/user').BCRPYT_SALT_ROUNDS,
passport = require('../auth/auth').passport;

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
    if (!user) {
        // TODO: add some query param to execute error msg
        req.logout();
        res.redirect('/');
    } else {
        user.save();
        req.login(user, function (err) {
            if (err) res.redirect('/');
            res.redirect('/user/' + req.user.id);
        });
    }
};

exports.user_login = function (req, res) {


    User.findByUsernameAndPassword(req.body.username, req.body.password, function (err, user) {
        if (!err && user) {
            res.redirect('/user/' + user.id);
        }
    });
};