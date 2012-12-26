/**
 * Module dependencies.
 */

var
Sequelize = require('sequelize'),
sequelize = require('../store/database'),
bcrypt    = require('bcrypt'),
step      = require('step'),
Media     = require('./media'),
Comment   = require('./comment');

// Module level constants
var BCRYPT_SEED_ROUNDS = 10;


/**
 * User : Defines the user
 * @type {[Sequelize Model]}
 */
var User = sequelize.define('User', {
  email    : { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true, notEmpty: true }},
  password : { type: Sequelize.STRING, allowNull: false },
  username : {type: Sequelize.STRING, allowNull: true, unique: true, validate: { is: ["[a-z0-9\\.]", "i"], len: [7, 12], notEmpty: true }},
  firstName: { type: Sequelize.STRING, allowNull: true },
  lastName : { type: Sequelize.STRING, allowNull: true },
  gender   : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }, // T = Male, F = Female
  birthday : { type: Sequelize.DATE, allowNull: true, validate: { isAfter: "1920-01-01", isBefore: "1996-12-31" }}
},
{
  instanceMethods: {
    comparePassword: function (pass, callback) {
      bcrypt.compare(pass, this.password, function (err, matched) {
        callback((err || !matched) ? false: true);
      });
    }
  },
  classMethods: {
    encryptPassword: function (pass, callback) {
      if (pass.length < 7) return callback(new Error('Password is too short'));

      step(
        function genSalt() {
          bcrypt.genSalt(BCRYPT_SEED_ROUNDS, this);
        },
        function hash(err, salt) {
          if (err) callback(err);
          bcrypt.hash(pass, salt, this);
        },
        function result(err, hash) {
          if (err || !hash || hash.length === 0) callback(err);
          else callback(null, hash);
        }
        );
    }
  }
});

User.hasMany(Media, { foreignKey: 'mediaId'});
User.hasMany(Comment, { foreignKey: 'commentId'});

module.exports = exports = User;