var _ = require('underscore'),
bcrypt = require('bcrypt'),
events = require('events'),
util = require('util'),
DB = require('../database'),
Schema = require('./schema').Schema;

// Module level constants
var USER_TABLE = "users";
var BCRPYT_SALT_ROUNDS = 10;

function User(options) {
    for (var opt in options) {
        if (_.contains(this.fields, opt)) {
            this.opt = options[opt];
        }
    }
}

/**
 * Inherits from Schema
 */
util.inherits(User, Schema);

/**
 * [Saves the following model into the database]
 * @return {[Object]} user
 */
User.prototype.save = function () {
    var options = this.fieldSet;

    bcrypt.hash(this.password, BCRPYT_SALT_ROUNDS, function (err, hash) {
        this.password = hash;
    });

    DB.client.connect();

    DB.client.query('INSERT INTO ' + USER_TABLE + ' SET ?', options, function (err, result) {
        if (err) {
            console.log('Error: ' + err + '. Failed for user' + this);
            return;
        }
        this.id = result.insertId;
    });

    DB.client.end();

    return this;
};

User.prototype.fields = [ "id",
                          "username",
                          "password",
                          "first_name",
                          "last_name",
                          "email",
                          "gender",
                          "birth_date"];

User.prototype.find = function (id) {
    DB.client.connect();

    DB.client.query('SELECT * FROM ' + USER_TABLE + ' WHERE id = ? LIMIT 1', id,
        function (err, result) {

    });

    DB.client.end();
};

module.exports.LoginManager = function (user, pass, callback) {
    bcrypt.hash(pass, BCRPYT_SALT_ROUNDS, function (err, hash) {
        pass = hash;
    });

    DB.client.connect();

    DB.client.query('SELECT * FROM ' + USER_TABLE + ' WHERE username = ? AND password = ? LIMIT 1', user, pass,
        function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, new User(result));
            }
        });
};


module.exports.User = User;