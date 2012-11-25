/**
 * POST - Handle user authenticating
 */
var bcrypt = require('bcrypt'),
User = require('../models/user').User;

exports.signup = function (req, res) {

    var user = new User({
        username: req.param('username'),
        password: req.param('password'),
        first_name: req.param('first_name'),
        last_name: req.param('last_name'),
        email: req.param('email'),
        gender: req.param('gender'),
        birth_date: req.param('birth_date')
    });

    user.save();
};