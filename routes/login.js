/**
 * POST - Handle user authenticating
 */
var crypto = require('crypto'),
 User = require('../models/user'),
 util = require('util'),
 passport = require('../auth/auth').passport;

exports.signup = function (req, res) {
    // TODO: Need to apply frontend validation to the backend.
    var name = req.body.full_name.split(" ");
    var birthdayFormat = util.format("%d/%d/%d",
        parseInt(req.body.month, 10) + 1,
        req.body.day,
        req.body.year);

    var user = new User({
        username: req.body.email, // By default we set the email -> username
        password: req.body.password,
        first_name: name[0],
        last_name: name[name.length - 1],
        email: req.body.email,
        gender: req.body.gender,
        birth_date: new Date(birthdayFormat)
    });

    if (!user) {
        req.logout();
        // TODO: add some query param to execute error msg
        res.redirect('/');
    } else {
        user.save();
        req.login(user, function (err) {
            if (err) res.redirect('/');
            res.redirect('/user/' + req.user.id);
        });
    }
};

exports.login = function (req, res) {


    User.findByUsernameAndPassword(req.body.username, req.body.password, function (err, user) {
        if (!err && user) {
            res.redirect('/user/' + user.id);
        }
    });
};