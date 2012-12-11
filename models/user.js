var _ = require('underscore'),
bcrypt = require('bcrypt'),
util = require('util'),
DB = require('../store/database'),
Schema = require('./schema').Schema;

// Module level constants
var USER_TABLE = "users";
var BCRPYT_SALT_ROUNDS = 10;


var fields = [ "id",
                "username",
                "password",
                "first_name",
                "last_name",
                "email",
                "gender",
                "birth_date"
             ];

function User(options) {
    if (!options) return;

    for (var opt in options) {
        if (_.contains(fields, opt)) {
            this[opt] = options[opt];
        }
    }
}

/**
 * Inherits from Schema
 */
util.inherits(User, Schema);

/**
 * Sets the fields prototype to the users fields
 */
User.prototype.fields = fields;

/**
 * Saves the following model into the database
 * @return {[Object]} user
 */
User.prototype.save = function () {
    var options = this.fieldSet();

    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(BCRPYT_SALT_ROUNDS));

    var SQL = util.format('INSERT INTO %s SET ?', USER_TABLE);
    DB.client.query(SQL, options, function (err, result) {
        if (err) {
            console.log('Error: ' + err + '. Failed for user' + this);
            return;
        }
        this.id = result.insertId;
    });


    return this;
};

User.findById = function (id, callback) {
    var SQL = util.format('SELECT %s.id FROM %s WHERE id = ? LIMIT 1', USER_TABLE, USER_TABLE);
    DB.client.query(SQL, id, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, new User(result));
        }
    });

};

User.findByUsernameAndPassword = function (user, pass, callback) {
    bcrypt.hash(pass, BCRPYT_SALT_ROUNDS, function (err, hash) {
        pass = hash;
    });

    var SQL = util.format('SELECT %s.username, %s.password FROM  %s WHERE username = ? AND password = ? LIMIT 1', USER_TABLE, USER_TABLE, USER_TABLE);
    DB.client.query(SQL, user, pass, function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, new User(result));
            }
        });

};


module.exports = User;

module.exports.BCRPYT_SALT_ROUNDS = BCRPYT_SALT_ROUNDS;