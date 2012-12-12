var _ = require('underscore'),
mysql = require('mysql'),
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
 * If successful, saves the user.id otherwise user.id = undefined
 * @param { Function} callback(err) function to call back
 */
User.prototype.save = function (callback) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(BCRPYT_SALT_ROUNDS));

    var options = this.fieldSet();
    var self = this;

    var SQL = util.format('INSERT INTO %s SET ?', USER_TABLE);
    DB.client.query(SQL, options, function (err, result) {
        if (err) {
            return callback(err);
        }
        self.id = result.insertId;
        callback();
    });
};

User.findById = function (id, callback) {
    var SQL = util.format('SELECT %s.id FROM %s WHERE id = ? LIMIT 1', USER_TABLE, USER_TABLE);
    DB.client.query(SQL, id, function (err, result, fields) {
        if (err) {
            callback(err);
        } else {
            callback(null, new User(result[0]));
        }
    });
};

User.findByUsernameAndPassword = function (user, pass, callback) {

    var SQL = util.format('SELECT * FROM %s WHERE username = %s LIMIT 1',  USER_TABLE, mysql.escape(user));
    DB.client.query(SQL, function (err, result, fields) {
            if (err) {
                callback(err);
            } else {
                // Load DB hash and compare with current pass
                if (bcrypt.compareSync(pass, result[0].password)) {
                    callback(null, new User(result[0]));
                } else {
                    callback();
                }
            }
        });

};


module.exports = User;

module.exports.BCRPYT_SALT_ROUNDS = BCRPYT_SALT_ROUNDS;