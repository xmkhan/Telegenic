/**
 * POST - Handle user authenticating
 */
var bcrypt = require('bcrypt'),
User = require('../models/user').User;

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

    bcrypt.hash(user.password, BCRPYT_SALT_ROUNDS, function (err, hash) {
        user.password = hash;
        user.save();
    });
};